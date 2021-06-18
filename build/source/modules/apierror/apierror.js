"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    constructor(status, notify) {
        super(`status: ${status}, notify: ${notify}`);
        this.name = 'APIError';
        this.status = status;
        this.notify = notify;
    }
}
exports.default = APIError;
//# sourceMappingURL=apierror.js.map