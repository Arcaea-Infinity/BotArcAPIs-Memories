// filename : v1/arc/alloc.js
// author   : TheSnowfield
// date     : 04/27/2020
// comment  : api for query persistent

const TAG = 'v1/arc/alloc.js\t';

const APIError = require('../../../corefunc/error');
const arcmana_account_allocauto = require('../../../arcmana/account_allocauto');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /arc/alloc[?time=xxx]
      // check for request arguments
      argument.time = parseInt(argument.time);

      // default time is 30 sec
      if (isNaN(argument.time))
        argument.time = 30;

      // clamp time range
      if (argument.time < 30 || argument.time > 240)
        throw new APIError(-1, 'invalid time');

      let _token = null;
      try { _token = await arcmana_account_allocauto(argument.time); }
      catch (e) { throw new APIError(-2, 'allocate an arc account failed'); }

      const _return = {
        access_token: _token,
        valid_time: argument.time
      };

      resolve(_return);

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
}
