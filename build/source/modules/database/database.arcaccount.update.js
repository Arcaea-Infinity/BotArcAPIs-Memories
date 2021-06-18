"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcaccount.update.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (account) => {
    const _sqlbinding = {
        passwd: account.passwd,
        device: account.device,
        uid: account.uid,
        ucode: account.ucode,
        token: account.token,
        banned: account.banned ? 'true' : 'false',
        name: account.name
    };
    const _binding_updates = (() => {
        let _array = [];
        Object.keys(_sqlbinding).forEach((v) => {
            if (v != 'name')
                _array.push(`${v} = ?`);
        });
        return _array.join(', ');
    })();
    const _sql = 'UPDATE `accounts` ' +
        `SET ${_binding_updates} WHERE \`name\` == ?`;
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCACCOUNT.run(_sql, Object.values(_sqlbinding));
};
//# sourceMappingURL=database.arcaccount.update.js.map