// filename : error.js
// author   : TheSnowfield
// date     : 04/10/2020
// comment  : error with status code

class APIError extends Error {

  /**
   * An APIError
   * @param {number} status
   * @param {string} notify
   */
  constructor(status, notify) {
    if (typeof status != 'number')
      throw new TypeError('first argument is status code, cannot be null');
    if (typeof notify != 'string')
      throw new TypeError('second argument is notify message, cannot be null');

    super(`APIError: status: ${status}, notify: ${notify}`);
    this.name = 'APIError';
    this.status = status;
    this.notify = notify;
  }
}

module.exports = APIError;