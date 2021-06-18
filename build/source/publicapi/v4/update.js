"use strict";
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
const TAG = 'v4/update.ts\t';
const node_fetch_1 = __importDefault(require("node-fetch"));
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield node_fetch_1.default("https://webapi.lowiro.com/webapi/serve/static/bin/arcaea/apk")
                .then((response) => response.text())
                .then((rawdata) => {
                try {
                    return JSON.parse(rawdata);
                }
                catch (e) {
                    throw new apierror_1.default(-1, 'service unavailable');
                }
            })
                .then((root) => {
                if (root.success != true)
                    throw new apierror_1.default(-2, "fetch latest release failed");
                resolve({
                    "url": root.value.url,
                    "version": root.value.version
                });
            });
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=update.js.map