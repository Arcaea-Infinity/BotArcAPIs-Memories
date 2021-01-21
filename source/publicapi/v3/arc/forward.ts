const TAG: string = 'v3/arc/forward.js\t';

import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';
import arcapi_any from '../../../modules/arcfetch/arcapi.any';
import account_fromtoken from '../../../modules/account/fromtoken';
import { ArcFetchMethod } from '../../../modules/arcfetch/arcfetch';

export default (argument: any, method: ArcFetchMethod,
  path: string, header: any, databody: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /arc/forward[/url/to/arcapi?foo=xx&bar=xx]
      // get token from GET parameters
      let _access_token: string | null = null;
      if (argument.token) {
        _access_token = argument.token;

        // delete access token from parameters
        delete argument.token;
      }

      // compatible with arcapi request format
      else if (header.authorization) {
        const _array = header.authorization.split(' ');
        if (_array.length == 2 && _array[0] == 'Bearer')
          _access_token = _array[1];

        // delete access token from header
        delete header.authorization;
      }

      // validate the token
      if (!_access_token)
        throw new APIError(-1, 'invalid token');

      // get account from token
      let _account = null;
      try { _account = await account_fromtoken(_access_token); }
      catch (e) { throw new APIError(-2, 'invalid token'); }

      // request arcapi
      let _return: any = {};
      try {
        _return = await arcapi_any(_account, method,
          path + '?' + new URLSearchParams(argument), databody);
      }
      catch (e) {
        _return.error_code = e;
        _return.success = 'false';
      }

      resolve(_return);

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }

  });

}
