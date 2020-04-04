import fs from 'fs-extra'
import path from 'path'

import FA from 'fasy'
import { quicktype, InputData, JSONSchemaInput, JSONSchemaStore } from 'quicktype-core'

import { findModuleRoot } from '../lib/findModuleRoot'

const SCHEMA_EXTENSION = '.schema.json'

export interface Conversion {
  schemasRoot: string
  language: string
  typeExtension: string
  outputRoot: string
}

async function quicktypeJSONSchema(targetLanguage: string, typeName: string, jsonSchemaString: string) {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore())
  await schemaInput.addSource({ name: typeName, schema: jsonSchemaString })

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  return quicktype({
    inputData,
    lang: targetLanguage,
  })
}

function convertForOneType({ schemasRoot, language, typeExtension, outputRoot }: Conversion) {
  return async (schemaFilename: string) => {
    await fs.mkdirp(outputRoot)
    const schemaFilepath = path.join(schemasRoot, schemaFilename)
    const typeName = schemaFilename.replace(SCHEMA_EXTENSION, '')
    const outputFilename = typeName.concat(typeExtension)
    const outputFilepath: string = path.join(outputRoot, outputFilename)

    const jsonSchemaString = (await fs.readFile(schemaFilepath)).toString('utf-8')
    const { lines: outputLines } = await quicktypeJSONSchema(language, typeName, jsonSchemaString)
    return fs.writeFile(outputFilepath, outputLines.join('\n'))
  }
}

function convertForOneLanguage(schemaFilenames: string[]) {
  return async (conversion: Conversion) => FA.concurrent.map(convertForOneType(conversion), schemaFilenames)
}

export default async function convertSchemasToTypes() {
  const { moduleRoot } = findModuleRoot()
  const schemasRoot = path.join(moduleRoot, 'schemas')

  let schemaFilenames = await fs.readdir(schemasRoot)
  schemaFilenames = schemaFilenames.filter((schemaFilename) => schemaFilename.endsWith(SCHEMA_EXTENSION))

  const conversions: Conversion[] = [
    {
      schemasRoot,
      language: 'typescript',
      typeExtension: '.ts',
      outputRoot: path.join(moduleRoot, 'src', '.generated', 'types'),
    },
    {
      schemasRoot,
      language: 'python',
      typeExtension: '.py',
      outputRoot: path.join(moduleRoot, 'data', 'generated_types'),
    },
  ]

  if (schemaFilenames.length > 0) {
    return FA.concurrent.map(convertForOneLanguage(schemaFilenames), conversions)
  }
  return Promise.resolve()
}

convertSchemasToTypes().catch(console.error)
