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
exports.ArcFetchRequest = exports.ArcFetchMethod = void 0;
const TAG = 'corefunc/arcfetch.ts';
const abab_1 = require("abab");
const syslog_1 = __importDefault(require("../syslog/syslog"));
const node_fetch_1 = __importStar(require("node-fetch"));
const archash4all_1 = require("archash4all");
var ArcFetchMethod;
(function (ArcFetchMethod) {
    ArcFetchMethod["GET"] = "GET";
    ArcFetchMethod["POST"] = "POST";
})(ArcFetchMethod = exports.ArcFetchMethod || (exports.ArcFetchMethod = {}));
class ArcFetchRequest extends node_fetch_1.Request {
    constructor(method, resturl, init) {
        let _request_url = `${do_selectnode()}/${ARCAPI_URL_CODENAME}/${ARCAPI_VERSION}/${resturl}`;
        const _request_headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'AppVersion': ARCAPI_APPVERSION,
            'User-Agent': ARCAPI_USERAGENT,
            'Platform': 'android',
            'Connection': 'Keep-Alive'
        };
        if (init.userToken) {
            _request_headers['Accept-Encoding'] = 'identity';
            _request_headers['Authorization'] = `Bearer ${init.userToken}`;
        }
        else if (init.userName && init.userPasswd) {
            _request_headers['Accept-Encoding'] = 'identity';
            _request_headers['Authorization'] = `Basic ${abab_1.btoa(`${init.userName}:${init.userPasswd}`)}`;
        }
        if (init.deviceId) {
            _request_headers['DeviceId'] = init.deviceId;
        }
        let _hash_body = "";
        if (method == 'POST' && init.submitData) {
            _hash_body = init.submitData.toString();
        }
        _request_headers['X-Random-Challenge'] = archash4all_1.archash(_hash_body);
        let _request_body = null;
        if (init.submitData) {
            if (method == 'GET' && init.submitData instanceof URLSearchParams) {
                _request_url += '?' + init.submitData;
            }
            else if (method == 'POST') {
                _request_body = init.submitData;
            }
        }
        super(_request_url, {
            method: method,
            headers: _request_headers,
            body: _request_body
        });
        this._init = init;
        this._method = method;
        this._resturl = resturl;
    }
    set init(val) {
        this._init = val;
    }
    set methods(val) {
        this._method = val;
    }
    set resturl(val) {
        this._resturl = val;
    }
    get init() {
        return this._init;
    }
    get methods() {
        return this._method;
    }
    get resturl() {
        return this._resturl;
    }
}
exports.ArcFetchRequest = ArcFetchRequest;
const do_selectnode = () => {
    if (!BOTARCAPI_FRONTPROXY_NODES.length
        || BOTARCAPI_FRONTPROXY_NODES.length == 0) {
        return ARCAPI_URL;
    }
    let _enabled = [];
    let _weight_sum = 0;
    for (let i = 0; i < BOTARCAPI_FRONTPROXY_NODES.length; ++i) {
        if (BOTARCAPI_FRONTPROXY_NODES[i].enabled
            || BOTARCAPI_FRONTPROXY_NODES[i].enabled == undefined) {
            _enabled.push(BOTARCAPI_FRONTPROXY_NODES[i]);
            _weight_sum += BOTARCAPI_FRONTPROXY_NODES[i].weight;
        }
    }
    let roll = Math.random() * _weight_sum;
    _weight_sum = 0;
    for (let i = 0; i < _enabled.length; ++i) {
        _weight_sum += _enabled[i].weight;
        if (_weight_sum >= roll)
            return _enabled[i].url;
    }
    return _enabled[_enabled.length - 1].url;
};
const do_rebuild = (request) => {
    return new ArcFetchRequest(request.methods, request.resturl, request.init);
};
const do_fetch = (request) => {
    return node_fetch_1.default(request)
        .then((response) => {
        if (response.status == 200)
            return response.text();
        throw new Error(`invalid http code ${response.status}`);
    })
        .then((rawdata) => {
        try {
            return JSON.parse(rawdata);
        }
        catch (e) {
            syslog_1.default.e(TAG, 'Arcapi currently unavailable');
            syslog_1.default.e(TAG, rawdata);
            return Promise.reject(9);
        }
    })
        .then((root) => {
        if (root.success)
            return root;
        else {
            const _errcode = root.error_code != undefined ? root.error_code : root.code;
            syslog_1.default.e(TAG, `Arcapi returns an error => ${_errcode}`);
            syslog_1.default.e(TAG, JSON.stringify(root));
            return Promise.reject(_errcode);
        }
    });
};
const arcfetch = (request) => __awaiter(void 0, void 0, void 0, function* () {
    syslog_1.default.v(TAG, `Arcfetch => ${request.url}`);
    let _retry = 0;
    let _request = request;
    while (true) {
        try {
            return yield do_fetch(_request);
        }
        catch (e) {
            _retry += 1;
            syslog_1.default.w(TAG, `Failed...retrying ${_retry} / ${ARCAPI_RETRY}`);
            if (e instanceof Error)
                syslog_1.default.e(TAG, e.stack);
            else if (typeof e == 'number' || e == 'UnauthorizedError') {
                _retry = ARCAPI_RETRY;
                syslog_1.default.w(TAG, `Retry canceled => errcode ${e}`);
            }
            if (BOTARCAPI_FRONTPROXY_CHANGE_NODE) {
                _request = do_rebuild(_request);
                syslog_1.default.w(TAG, `Change node to => ${_request.url}`);
            }
            if (_retry >= ARCAPI_RETRY)
                throw e;
        }
    }
});
exports.default = arcfetch;
//# sourceMappingURL=arcfetch.js.map