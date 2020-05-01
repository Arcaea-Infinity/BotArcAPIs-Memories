import arcapi_login from '../arcapi/arcapi.login';
import arcapi_userme from '../arcapi/arcapi.userme';
import dbproc_arcaccount_update from '../../procedures/arcaccount_update';

export default (): Promise<ArcAccount> => {

  return new Promise(async (resolve, reject) => {

    if (typeof ARCACCOUNT == 'undefined')
      reject(new Error('ARCACCOUNT is undefined?'));

    let _account: ArcAccount;

    while (true) {

      if (!ARCACCOUNT.length)
        reject(new Error('ARCACCOUNT length is zero'));

      // grab an account from queue
      _account = ARCACCOUNT.shift(1);
      if (typeof _account == 'undefined')
        reject(new Error('Element is undefined?'));

      // if the account has no token
      if (_account.token == '') {

        // try login and request a new token
        try {
          _account.token = await arcapi_login(_account.name, _account.passwd, _account.device);
        } catch (e) {

          // this account has been banned
          if (e == 106) {
            _account.banned = true;
          }

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
  });
}
