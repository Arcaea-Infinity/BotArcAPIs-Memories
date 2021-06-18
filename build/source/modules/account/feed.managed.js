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
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'account/feed.managed.ts';
exports.default = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ARCPERSISTENT[token])
            return reject(new Error('Invalid token'));
        if (++ARCPERSISTENT[token].feeded >= BOTARCAPI_FORWARD_FEED_MAX)
            return reject(new Error('Feed token failed'));
        ++ARCPERSISTENT[token].feed;
        resolve(ARCPERSISTENT[token].feed * ARCPERSISTENT[token].validtime);
    }));
};
//# sourceMappingURL=feed.managed.js.map