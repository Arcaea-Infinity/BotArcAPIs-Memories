const TAG = 'account/alloc.ts';

import syslog from '@syslog';
import arcapi_login from '@arcfetch/arcapi.login';
import arcapi_userme from '@arcfetch/arcapi.userme';
import arcaccount_update from '@database/database.arcaccount.update';
import IArcAccount from '@arcfetch/interfaces/IArcAccount';

export default (): Promise<IArcAccount> => {

  return new Promise(async (resolve, reject) => {

    let _account: IArcAccount | undefined;

    while (true) {

      if (!ARCACCOUNT.length)
        return reject(new Error('ARCACCOUNT length is zero'));

      // grab an account from queue
      _account = ARCACCOUNT.shift();
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
          arcaccount_update(_account);

          // available account
          if (!_account.banned && _account.token != '')
            break;

        }

      } else break;

    }

    resolve(_account);

    syslog.i(TAG, `Allocated account => ${_account.name} ${_account.token}`);

  });

}
