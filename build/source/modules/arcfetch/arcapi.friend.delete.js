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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'arcapi.friend.delete.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
const arcfetch_1 = __importStar(require("./arcfetch"));
exports.default = (account, userid) => {
    return new Promise((resolve, reject) => {
        const _remote_request = new arcfetch_1.ArcFetchRequest(arcfetch_1.ArcFetchMethod.POST, 'friend/me/delete', {
            userToken: account.token,
            deviceId: account.device,
            submitData: new URLSearchParams({ 'friend_id': userid })
        });
        arcfetch_1.default(_remote_request)
            .then((root) => { resolve(root.value.friends); })
            .catch((e) => {
            if (e == 'UnauthorizedError') {
                account.token = '';
                syslog_1.default.w(TAG, `Invalid token => ${account.name} ${account.token}`);
            }
            reject(e);
        });
    });
};
//# sourceMappingURL=arcapi.friend.delete.js.map