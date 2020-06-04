import fs from 'fs-extra'
import path from 'path'

import Papa from 'papaparse'

import { findModuleRoot } from '../lib/findModuleRoot'

const { moduleRoot } = findModuleRoot()

async function main() {
  const filePath = path.join(moduleRoot, 'data/case-counts/switzerland/CHE-Bern.tsv')
  const content = (await fs.readFile(filePath)).toString('utf-8')

  const { data, errors, meta } = Papa.parse(content, {
    header: true,
    skipEmptyLines: 'greedy',
    trimHeaders: true,
    dynamicTyping: true,
    comments: '#',
  })

  console.info(require('util').inspect({ data }, { colors: true, depth: null }))
}

main().catch(console.error)
