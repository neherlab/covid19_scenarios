const fs = require('fs-extra')
const path = require('path')

/* eslint-disable no-loops/no-loops,no-param-reassign,no-plusplus */
module.exports = {
  findModuleRoot(maxDepth = 10) {
    let moduleRoot = __dirname
    while (--maxDepth) {
      moduleRoot = path.resolve(moduleRoot, '..')
      const file = path.join(moduleRoot, 'package.json')
      if (fs.existsSync(file)) {
        const pkg = fs.readJsonSync(file)
        return { moduleRoot, pkg }
      }
    }
    throw new Error('Module root not found')
  },
}
