// filename : v1/arc/recycle.js
// author   : TheSnowfield
// date     : 04/27/2020
// comment  : api for query persistent

const TAG = 'v1/arc/recycle.js\t';

const APIError = require('../../../corefunc/error');

const arcmana_account_recycleauto = require('../../../arcmana/account_recycleauto');

module.exports = (argument, method, path, header, databody) => {
  return new Promise(async (resolve, reject) => {

    try {
      
      // /arc/recycle[token=xxx]
      // get token from GET parameters
      let _access_token = null;
      if (argument['token']) {
        _access_token = argument.token;
      }

      // compatible with arcapi request format
      else if (header['authorization']) {
        const _array = header['authorization'].split(' ');
        if (_array.length == 2 && _array[0] == 'Bearer')
          _access_token = _array[1];
      }

      // validate the token
      if (!_access_token)
        throw new APIError(-1, 'invalid token');

      // recycle the account
      try { await arcmana_account_recycleauto(_access_token); }
      catch (e) { throw new APIError(-2, 'invalid token'); }

      resolve();

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }

  });
}
