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
const TAG = 'arcapi.friend.clear.ts';
const arcapi_userme_1 = __importDefault(require("./arcapi.userme"));
const arcapi_friend_delete_1 = __importDefault(require("./arcapi.friend.delete"));
exports.default = (account, friends) => __awaiter(void 0, void 0, void 0, function* () {
    let _friends = [];
    if (!friends)
        _friends = (yield arcapi_userme_1.default(account)).friends;
    for (const v of _friends) {
        yield arcapi_friend_delete_1.default(account, v.user_id);
    }
});
//# sourceMappingURL=arcapi.friend.clear.js.map