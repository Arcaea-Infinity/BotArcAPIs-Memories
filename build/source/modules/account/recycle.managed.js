"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'account/recycle.managed.ts';
const recycle_1 = __importDefault(require("./recycle"));
exports.default = (token) => {
    return new Promise((resolve, reject) => {
        if (!ARCPERSISTENT[token]) {
            return reject(new Error('Invalid token or token has beed recycled'));
        }
        recycle_1.default(ARCPERSISTENT[token].account);
        clearTimeout(ARCPERSISTENT[token].proc);
        delete ARCPERSISTENT[token];
        resolve();
    });
};
//# sourceMappingURL=recycle.managed.js.map