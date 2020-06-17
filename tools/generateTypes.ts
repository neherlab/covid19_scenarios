/* eslint-disable array-func/no-unnecessary-this-arg,unicorn/no-process-exit */
import Ajv, { Ajv as AjvModule } from 'ajv'
import rimrafOriginal from 'rimraf'
import pack from 'ajv-pack'
import FA from 'fasy'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import path from 'path'
import prettier from 'prettier'
import { quicktype, InputData, JSONSchema, JSONSchemaInput, JSONSchemaStore, parseJSON } from 'quicktype-core'
import { valid } from 'semver'
import util from 'util'

import { findModuleRoot } from '../lib/findModuleRoot'
import { get } from 'lodash'

const rimraf = util.promisify(rimrafOriginal)

const SCHEMA_EXTENSION = '.yml'
const SCHEMA_VER_FILEPATH = 'schemas/_SchemaVer.yml'

class Store extends JSONSchemaStore {
  private schemasRoot: string

  constructor(schemasRoot: string) {
    super()
    this.schemasRoot = schemasRoot
  }

  async fetch(address: string): Promise<JSONSchema | undefined> {
    const schemaFilepath = path.join(this.schemasRoot, address)
    const jsonSchemaString = (await fs.readFile(schemaFilepath)).toString('utf-8')
    return parseJSON(jsonSchemaString, 'JSON Schema', address) as Record<string, unknown>
  }
}

function quicktypesAddSources(schemasRoot: string, schemaInput: JSONSchemaInput) {
  return async (schemaFilename: string) => {
    const schemaFilepath = path.join(schemasRoot, schemaFilename)
    const typeName = schemaFilename.replace(SCHEMA_EXTENSION, '')
    const jsonSchemaString = (await fs.readFile(schemaFilepath)).toString('utf-8')
    await schemaInput.addSource({ name: typeName, schema: jsonSchemaString })
  }
}

async function quicktypesGenerate(
  lang: string,
  schemaVer: string,
  schemasRoot: string,
  schemaFilenames: string[],
  outputPath: string,
  rendererOptions?: { [name: string]: string },
) {
  const schemaInput = new JSONSchemaInput(new Store(schemasRoot))
  await FA.concurrent.forEach(quicktypesAddSources(schemasRoot, schemaInput), schemaFilenames)

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  const { lines } = await quicktype({ inputData, lang, rendererOptions })
  let code = lines.join('\n')

  if (lang === 'typescript') {
    code = prettier.format(code, { parser: 'typescript' })

    // insert schemaVer constant
    code = `export const schemaVer = '${schemaVer}'\n\n${code}`

    // make schemaVer to be of an exact string type (for example '2.0.0', instead of 'string')
    code = code.replace(`schemaVer: string`, `schemaVer: '${schemaVer}'`)
  } else if (lang === 'python') {
    // insert schema_ver variable
    code = code.replace(`T = TypeVar("T")`, `schema_ver = '${schemaVer}'\n\nT = TypeVar("T")`)
  }

  return fs.writeFile(outputPath, code)
}

function ajvAddSources(schemasRoot: string, ajv: AjvModule) {
  return async (schemaFilename: string) => {
    const schemaFilepath = path.join(schemasRoot, schemaFilename)
    const jsonSchemaString = fs.readFileSync(schemaFilepath).toString('utf-8')
    const schema = yaml.safeLoad(jsonSchemaString) as Record<string, unknown>
    ajv.addSchema(schema)
  }
}

function ajvGenerateOne(schemasRoot: string, ajv: AjvModule, outputDir: string) {
  return async (schemaFilename: string) => {
    const schemaFilepath = path.join(schemasRoot, schemaFilename)
    const typeName = schemaFilename.replace(SCHEMA_EXTENSION, '')
    const jsonSchemaString = fs.readFileSync(schemaFilepath).toString('utf-8')
    const schema = yaml.safeLoad(jsonSchemaString) as Record<string, unknown>
    const validateFunction = ajv.compile(schema)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let code = pack(ajv, validateFunction)
    code = prettier.format(code, { parser: 'babel' })
    return fs.writeFile(path.join(outputDir, `validate${typeName}.js`), code)
  }
}

async function ajvGenerate(schemasRoot: string, schemaFilenames: string[], outputDir: string) {
  const ajv = new Ajv({ sourceCode: true, $data: true, jsonPointers: true, allErrors: true })
  await FA.concurrent.forEach(ajvAddSources(schemasRoot, ajv), schemaFilenames)
  return FA.concurrent.forEach(ajvGenerateOne(schemasRoot, ajv, outputDir), schemaFilenames)
}

async function getSchemaVer(schemaVerFilepath: string) {
  const jsonSchemaString = fs.readFileSync(schemaVerFilepath).toString('utf-8')
  const schema = yaml.safeLoad(jsonSchemaString) as Record<string, unknown>
  const schemaVer = get(schema, 'const') as string
  if (!valid(schemaVer)) {
    throw new Error(`Expected \`schemaVer\` to be a valid version string but got: "${schemaVer}"`)
  }
  return schemaVer
}

export default async function generateTypes() {
  const { moduleRoot } = findModuleRoot()
  const schemasRoot = path.join(moduleRoot, 'schemas')
  const tsOutputDir = path.join(moduleRoot, 'src', '.generated', 'latest')
  const pyOutputDir = path.join(moduleRoot, 'data', 'generated')
  const tsOutput = path.join(tsOutputDir, 'types.ts')
  const pyOutput = path.join(pyOutputDir, 'types.py')
  const schemaVerFilepath = path.join(moduleRoot, SCHEMA_VER_FILEPATH)

  const schemaVer = await getSchemaVer(schemaVerFilepath)

  let schemaFilenames = await fs.readdir(schemasRoot)
  schemaFilenames = schemaFilenames.filter((schemaFilename) => schemaFilename.endsWith(SCHEMA_EXTENSION))

  await FA.concurrent.forEach(async (d) => rimraf(`${d}/**`), [tsOutputDir, pyOutputDir])
  await FA.concurrent.forEach(async (d) => fs.mkdirp(d), [tsOutputDir, pyOutputDir])

  return Promise.all([
    quicktypesGenerate('typescript', schemaVer, schemasRoot, schemaFilenames, tsOutput, {
      'converters': 'all-objects',
      'nice-property-names': 'true',
      'runtime-typecheck': 'true',
    }),
    quicktypesGenerate('python', schemaVer, schemasRoot, schemaFilenames, pyOutput, {
      'python-version': '3.6',
      'alphabetize-properties': 'false',
    }),
    ajvGenerate(schemasRoot, schemaFilenames, tsOutputDir),
  ])
}

generateTypes().catch((error) => {
  console.error(error)
  process.exit(1)
})
