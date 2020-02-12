// filename : webpack.debug.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : this file is entry of webpack,
//            provides configs for webpack when packing

// sourcecode dir
const SRCDIR = './api';

// arcapi configs
const BOTARCAPI_MAJOR = 1;
const BOTARCAPI_MINOR = 0;
const BOTARCAPI_VERSION = 0;
const BOTARCAPI_ARCAPI_VERSION = 9;
const BOTARCAPI_ARCAPI_APPVERSION = '2.5.1c';
const BOTARCAPI_ARCAPI_USERAGENT = 'WeLoveArcaea (Linux; U; Android 2.3.3; BotArcAPI)'
const BOTARCAPI_SRC_UTILS = `${SRCDIR}/utils.js`;
const BOTARCAPI_SRC_AUTOLOADER = `${SRCDIR}/autoloader.js`;
const BOTARCAPI_SRC_PACKTARGET = `${SRCDIR}/v${BOTARCAPI_MAJOR}/__main__.js`;


// webpack configs
let path = require('path');
const WEBPACK_MODE = 'production';
const WEBPACK_TARGET = 'webworker';
const WEBPACK_DEVTOOL = 'cheap-module-source-map';
const WEBPACK_ENTRY = BOTARCAPI_SRC_AUTOLOADER;
const WEBPACK_TARGET_NAME = 'script.js';
const WEBPACK_TARGET_PATH = path.resolve(__dirname, 'worker');

// webpack build
let webpack = require('webpack');
module.exports = {
    mode: WEBPACK_MODE,
    entry: WEBPACK_ENTRY,
    target: WEBPACK_TARGET,
    devtool: WEBPACK_DEVTOOL,
    resolve: {
        alias: {
            Utils: path.resolve(__dirname, BOTARCAPI_SRC_UTILS),
            BotArcAPI: path.resolve(__dirname, BOTARCAPI_SRC_PACKTARGET)
        }
    },
    plugins: [
        // new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            'BOTARCAPI_MAJOR': BOTARCAPI_MAJOR,
            'BOTARCAPI_MINOR': BOTARCAPI_MINOR,
            'BOTARCAPI_VERSION': BOTARCAPI_VERSION,
            'BOTARCAPI_ARCAPI_VERSION': BOTARCAPI_ARCAPI_VERSION,
            'BOTARCAPI_ARCAPI_USERAGENT': BOTARCAPI_ARCAPI_USERAGENT,
            'BOTARCAPI_ARCAPI_APPVERSION': BOTARCAPI_ARCAPI_APPVERSION
        })
    ],
    output: {
        filename: WEBPACK_TARGET_NAME,
        path: WEBPACK_TARGET_PATH
    }
};
