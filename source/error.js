// filename : error.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : error with status code

class APIError extends Error {
  constructor(status, notify) {
    if (typeof status != 'number')
      throw new TypeError('first argument is status code, cannot be null');
    if (typeof notify != 'string')
      throw new TypeError('second argument is notify message, cannot be null');

    super();
    this.name = 'APIError';
    this.status = status;
    this.notify = notify;
    this.message = `status: ${status}, notify: ${notify}`;
  }
}

module.exports = APIError;