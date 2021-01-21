const TAG: string = 'v3/arc/recycle.js\t';

import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';
import account_recycle_managed from '../../../modules/account/recycle.managed';
import { ArcFetchMethod } from '../../../modules/arcfetch/arcfetch';

export default (argument: any, method: ArcFetchMethod,
  path: string, header: any, databody: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /arc/recycle[token=xxx]
      // get token from GET parameters
      let _access_token = null;
      if (argument.token) {
        _access_token = argument.token;
      }

      // compatible with arcapi request format
      else if (header.authorization) {
        const _array = header.authorization.split(' ');
        if (_array.length == 2 && _array[0] == 'Bearer')
          _access_token = _array[1];
      }

      // validate the token
      if (!_access_token)
        throw new APIError(-1, 'invalid token');

      // recycle the account
      try { await account_recycle_managed(_access_token); }
      catch (e) { throw new APIError(-2, 'invalid token'); }

      resolve(null);

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }

  });

}
