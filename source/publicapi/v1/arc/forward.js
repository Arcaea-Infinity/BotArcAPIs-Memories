// filename : v1/arc/forward.js
// author   : TheSnowfield
// date     : 04/27/2020
// comment  : forward request to arcapi

const TAG = 'v1/arc/forward.js\t';

const APIError = require('../../../corefunc/error');

const arcapi_any = require('../../../arcapi/any');
const arcmana_account_fromtoken = require('../../../arcmana/account_fromtoken');

module.exports = (argument, method, path, header, databody) => {
  return new Promise(async (resolve, reject) => {

    try {

      // get token from GET parameters
      let _access_token = null;
      if (argument['token']) {
        _access_token = argument.token;

        // delete access token from parameters
        delete argument.token;
      }

      // compatible with arcapi request format
      else if (header['Authorization']) {
        const _array = header['Authorization'].split(' ');
        if (_array.length == 2 && _array[0] == 'Bearer')
          _access_token = _array[1];

        delete header['Authorization'];
      }

      // validate the token
      if (!_access_token)
        throw new APIError(-1, 'invalid token');


      // get account from token
      let _account = null;
      try { _account = await arcmana_account_fromtoken(_access_token); }
      catch (e) { throw new APIError(-2, 'invalid token'); }

      // request arcapi
      let _return = {};
      try { _return = await arcapi_any(_account, method, path, databody); }
      catch (e) { /* do nothing */ }

      resolve(_return);

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }

  });
}
