// filename : arcmana/_arcmana_account_alloc.js
// author   : TheSnowfield
// date     : 04/14/2020
// common   : request an arc account

const TAG = 'arcmana/_arcmana_account_alloc.js';

const APIError = require('../corefunc/error');

const arcapi_login = require('../arcapi/_arcapi_login');
const arcapi_userme = require('../arcapi/_arcapi_userme');
const dbproc_arcaccount_update = require('../database/_dbproc_arcaccount_update');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    // request an arc account from global ARCACCOUNT
    // ** pretend to be a queue =(:3) z)_ **

    if (typeof ARCACCOUNT == 'undefined')
      return reject(new Error('ARCACCOUNT is undefined?'));

    let _account = null;

    while (true) {

      if (!ARCACCOUNT.length)
        return reject(new Error('ARCACCOUNT length is zero'));

      // grab an account from queue
      _account = ARCACCOUNT.shift(1);
      if (typeof _account == 'undefined')
        return reject(new Error('Element is undefined?'));

      // if the account has no token
      if (_account.token == '') {

        // try login and request a new token
        try {
          _account.token = await arcapi_login(_account.name, _account.passwd, _account.device);
        } catch (e) {

          // this account has been banned
          if (e == 106) {
            _account.banned = true;
            syslog.w(TAG, `This account has been banned. remove from pool => ${_account.name}`);
          }

          syslog.e(TAG, e.stack);

        } finally {

          // fetch information of account if needed
          if (!_account.banned && (!_account.uid || !_account.ucode)) {
            const _info = await arcapi_userme(_account);
            _account.uid = _info.user_id;
            _account.ucode = _info.user_code;
          }

          // update the database
          dbproc_arcaccount_update(_account);

          // available account
          if (!_account.banned && _account.token != '')
            break;

        }

      } else break;
    }

    resolve(_account);
    syslog.i(TAG, `Allocated arc account => ${_account.name} ${_account.token}`);
  });
}
