// filename : webpack.config.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : this file is entry of webpack,
//            provides configs for webpack when packing

// sourcecode dir
const SRCDIR = './api';

// arcapi configs
const BOTARCAPI_VERSION = 1;
const BOTARCAPI_SRC_AUTOLOADER = `${SRCDIR}/autoloader.js`;
const BOTARCAPI_SRC_PACKTARGET = `${SRCDIR}/v${BOTARCAPI_VERSION}/__main__.js`;

// webpack configs
let path = require('path');
const WEBPACK_MODE = 'development';
const WEBPACK_TARGET = 'webworker';
const WEBPACK_DEVTOOL = 'cheap-module-source-map';
const WEBPACK_ENTRY = BOTARCAPI_SRC_AUTOLOADER;
const WEBPACK_TARGET_NAME = 'script.js';
const WEBPACK_TARGET_PATH = path.resolve(__dirname, 'worker');

// webpack build
module.exports = {
    mode: WEBPACK_MODE,
    entry: WEBPACK_ENTRY,
    target: WEBPACK_TARGET,
    devtool: WEBPACK_DEVTOOL,
    resolve: {
        alias: {
            BotArcAPI: path.resolve(__dirname, BOTARCAPI_SRC_PACKTARGET)
        }
    },
    output: {
        filename: WEBPACK_TARGET_NAME,
        path: WEBPACK_TARGET_PATH
    }
};
