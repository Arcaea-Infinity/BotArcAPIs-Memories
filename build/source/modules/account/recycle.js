"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'account/recycle.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (account) => {
    ARCACCOUNT.push(account);
    syslog_1.default.i(TAG, `Recycled account => ${account.name} ${account.token}`);
};
//# sourceMappingURL=recycle.js.map