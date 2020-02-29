const path = require('path')

const dotenv = require('dotenv')

const { findModuleRoot } = require('../../lib/findModuleRoot')

const { moduleRoot } = findModuleRoot()

dotenv.config({ path: path.join(moduleRoot, '.env') })
