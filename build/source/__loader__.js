"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'source/__loader__.ts';
const utils_1 = __importDefault(require("./corefunc/utils"));
const syslog_1 = __importDefault(require("./modules/syslog/syslog"));
const handler_request_notfound = (response, message = '') => __awaiter(void 0, void 0, void 0, function* () {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
    response.end(message);
    syslog_1.default.v(TAG, 'Send response back');
});
const handler_request_favicon = (response) => __awaiter(void 0, void 0, void 0, function* () {
    let _http_body = '';
    let _http_status = 0;
    let _http_content_type = '';
    const file = require('fs');
    try {
        yield file.promises.readFile('./image/favicon.ico')
            .then((data) => {
            _http_status = 200;
            _http_body = data;
            _http_content_type = 'image/x-icon';
        });
    }
    catch (e) {
        syslog_1.default.e(e.stack);
        return handler_request_notfound(response);
    }
    response.statusCode = _http_status;
    response.setHeader('Content-Type', _http_content_type);
    response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
    response.end(_http_body);
    syslog_1.default.v(TAG, 'Send response back');
});
const forward_route = {
    '/v1/arc/forward': /^\/v1\/arc\/forward\//,
    '/v2/arc/forward': /^\/v2\/arc\/forward\//,
    '/v3/arc/forward': /^\/v3\/arc\/forward\//,
    '/v4/forward/forward': /^\/v4\/forward\/forward\//
};
const handler_request_publicapi = (response, argument, method, path, header, databody) => __awaiter(void 0, void 0, void 0, function* () {
    let _http_body = '';
    let _http_status = 0;
    let _http_content_type = '';
    let _api_entry;
    try {
        for (const v in forward_route) {
            if (new RegExp(forward_route[v]).test(path)) {
                path = path.replace(forward_route[v], '');
                _api_entry = yield Promise.resolve().then(() => __importStar(require(`./publicapi${v}`)));
                break;
            }
        }
        if (!_api_entry)
            _api_entry = yield Promise.resolve().then(() => __importStar(require(`./publicapi/${path}.js`)));
    }
    catch (e) {
        return handler_request_notfound(response, 'request path notfound =(:3) z)_');
    }
    try {
        const _api_result = {};
        _api_entry = _api_entry.default;
        yield _api_entry(argument, method, path, header, databody)
            .then((result) => {
            _api_result.status = 0;
            _api_result.content = result;
        })
            .catch((error) => {
            _api_result.status = error.status;
            _api_result.message = error.notify;
        });
        _http_status = 200;
        _http_body = JSON.stringify(_api_result);
        _http_content_type = 'application/json; charset=utf-8';
    }
    catch (e) {
        syslog_1.default.e(e.stack);
        return handler_request_notfound(response, 'some error happend! (>_<)|||');
    }
    response.statusCode = _http_status;
    response.setHeader('Content-Type', _http_content_type);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
    response.end(_http_body);
    syslog_1.default.v(TAG, 'Send response back');
});
const handler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const _sign_agent = (_b = (_a = request.headers['client-agent']) !== null && _a !== void 0 ? _a : request.headers['user-agent']) !== null && _b !== void 0 ? _b : '';
    if (!utils_1.default.httpMatchUserAgent(_sign_agent)) {
        syslog_1.default.w(TAG, `Invalid user agent => ${_sign_agent}`);
        return handler_request_notfound(response);
    }
    const _api_url = new URL(`http://0.0.0.0${request.url}`);
    const _api_path = _api_url.pathname;
    const _api_headers = request.headers;
    const _api_arguments = utils_1.default.httpGetAllParams(_api_url.searchParams);
    syslog_1.default.i(TAG, `Accept ${_sign_agent} ` +
        `request => ${request.method} ` +
        `${_api_path} ${JSON.stringify(_api_arguments)}`);
    let _rawdata = '';
    request.on('data', (data) => { _rawdata += data; });
    request.on('end', () => {
        var _a;
        if (request.method == 'GET') {
            if (_api_path == '/favicon.ico')
                return handler_request_favicon(response);
        }
        let _api_bodydata = null;
        if (request.method == 'POST')
            _api_bodydata = _rawdata;
        return handler_request_publicapi(response, _api_arguments, (_a = request.method) !== null && _a !== void 0 ? _a : '', _api_path, _api_headers, _api_bodydata);
    });
});
exports.default = handler;
//# sourceMappingURL=__loader__.js.map