import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package'

export interface FindModuleRootResult {
  moduleRoot: string
  pkg: JSONSchemaForNPMPackageJsonFiles
}

export declare function findModuleRoot(maxDepth: number = 10): FindModuleRootResult
