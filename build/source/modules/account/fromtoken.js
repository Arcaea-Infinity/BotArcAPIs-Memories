"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'account/fromtoken.ts';
exports.default = (token) => {
    return new Promise((resolve, reject) => {
        if (!ARCPERSISTENT[token])
            return reject(new Error('Invalid token'));
        resolve(ARCPERSISTENT[token].account);
    });
};
//# sourceMappingURL=fromtoken.js.map