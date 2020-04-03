import fs from 'fs-extra'
import path from 'path'

import { compileFromFile } from 'json-schema-to-typescript'
import FA from 'fasy'

import { findModuleRoot } from '../lib/findModuleRoot'

const SCHEMA_EXTENSION = '.schema.json'
const TYPE_EXTENSION = '.ts'

const { moduleRoot } = findModuleRoot()
const schemasRoot = path.join(moduleRoot, 'schemas')
const outputRoot = path.join(moduleRoot, 'src', '.generated', 'types')

async function convertOneSchemaToType(schemaFilename: string) {
  const schemaFilepath = path.join(schemasRoot, schemaFilename)
  const outputFilename = schemaFilename.replace(SCHEMA_EXTENSION, TYPE_EXTENSION)
  const outputFilepath: string = path.join(outputRoot, outputFilename)
  const typescriptContent = await compileFromFile(schemaFilepath)
  return fs.writeFile(outputFilepath, typescriptContent)
}

export default async function convertSchemasToTypes() {
  let schemaFilenames = await fs.readdir(schemasRoot)
  schemaFilenames = schemaFilenames.filter((schemaFilename) => schemaFilename.endsWith(SCHEMA_EXTENSION))
  if (schemaFilenames.length > 0) {
    await fs.mkdirp(outputRoot)
    return FA.concurrent.map(convertOneSchemaToType, schemaFilenames)
  }
  return Promise.resolve()
}

convertSchemasToTypes().catch(console.error)
