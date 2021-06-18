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
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'arcapi.login.ts';
const arcfetch_1 = __importStar(require("./arcfetch"));
exports.default = (name, password, deviceid) => {
    return new Promise((resolve, reject) => {
        const _remote_request = new arcfetch_1.ArcFetchRequest(arcfetch_1.ArcFetchMethod.POST, `auth/login`, {
            userName: name,
            userPasswd: password,
            deviceId: deviceid,
            submitData: new URLSearchParams({ 'grant_type': 'client_credentials' })
        });
        arcfetch_1.default(_remote_request)
            .then((root) => { resolve(root.access_token); })
            .catch((e) => { reject(e); });
    });
};
//# sourceMappingURL=arcapi.login.js.map