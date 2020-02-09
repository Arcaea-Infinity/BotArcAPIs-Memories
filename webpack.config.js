// webpack mode
const WEBPACK_MODE = 'development';
// const WEBPACK_MODE = 'production';

// sourcecode dir
const BOT_SRC_DIR = './api'

// bot autoloader
const BOT_API_ENTRY = `${BOT_SRC_DIR}/autoloader.js`

// build version
const BOT_API_VERSION = 1;

// latest version dir
const BOT_LATEST_DIR = `${BOT_SRC_DIR}/v${BOT_API_VERSION}/`;

// find out js file who we want to pack
// defaultly including 'autoloader.js'
let WEBPACK_ENTRIES = BOT_API_ENTRY;



// webpack build
module.exports = {
    mode: WEBPACK_MODE,
    entry: WEBPACK_ENTRIES,
    output: {
        filename: 'index.js'
    }
};