import Ajv from 'ajv'
import rimraf from 'rimraf'
import pack from 'ajv-pack'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import path from 'path'
import { quicktype, InputData, JSONSchema, JSONSchemaInput, JSONSchemaStore, parseJSON } from 'quicktype-core'

import { findModuleRoot } from '../lib/findModuleRoot'

const SCHEMA_EXTENSION = '.yml'

class Store extends JSONSchemaStore {
  // eslint-disable-next-line class-methods-use-this
  fetch(address: string): Promise<JSONSchema | undefined> {
    const { moduleRoot } = findModuleRoot()
    const schemaFilepath = path.join(moduleRoot, 'schemas', address)
    const jsonSchemaString = fs.readFileSync(schemaFilepath).toString('utf-8')
    return parseJSON(jsonSchemaString, 'JSON Schema', address)
  }
}

export default async function convertSchemasToType() {
  const { moduleRoot } = findModuleRoot()
  const schemasRoot = path.join(moduleRoot, 'schemas')

  const schemaFilenames = fs
    .readdirSync(schemasRoot)
    .filter((schemaFilename) => schemaFilename.endsWith(SCHEMA_EXTENSION))

  const convertForType = async (lang: string, outputPath: string) => {
    const schemaInput = new JSONSchemaInput(new Store())
    await Promise.all(
      schemaFilenames.map((schemaFilename) => {
        const schemaFilepath = path.join(schemasRoot, schemaFilename)
        const typeName = schemaFilename.replace(SCHEMA_EXTENSION, '')
        const jsonSchemaString = fs.readFileSync(schemaFilepath).toString('utf-8')
        if (lang === 'typescript') {
          const schema = yaml.safeLoad(jsonSchemaString)
          const ajv = new Ajv({ sourceCode: true })
          const validate = ajv.compile(schema)
          const moduleCode = pack(ajv, validate)
          fs.writeFile(path.join(TSRoot, `${typeName}Validate.js`), moduleCode)
        }
        return schemaInput.addSource({ name: typeName, schema: jsonSchemaString })
      }),
    )
    const inputData = new InputData()
    inputData.addInput(schemaInput)
    const { lines: outputLines } = await quicktype({
      inputData,
      lang,
    })
    return fs.writeFile(outputPath, outputLines.join('\n'))
  }

  const TSRoot = path.join(moduleRoot, 'src', '.generated')
  rimraf.sync(TSRoot)
  await fs.mkdirp(TSRoot)
  await convertForType('typescript', path.join(TSRoot, 'types.ts'))

  const PYRoot = path.join(moduleRoot, 'data', 'generated_types')
  rimraf.sync(PYRoot)
  await fs.mkdirp(PYRoot)
  await convertForType('python', path.join(PYRoot, 'types.py'))
}

convertSchemasToType().catch(console.error)
