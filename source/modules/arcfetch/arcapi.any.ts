const TAG: string = 'arcapi.any.ts';

import syslog from '../syslog/syslog';
import arcfetch, { ArcFetchRequest, ArcFetchMethod } from './arcfetch';
import IArcAccount from './interfaces/IArcAccount';

export default (account: IArcAccount, method: ArcFetchMethod,
  path: string, databody: any): Promise<any> => {

  // construct remote request
  const _remote_request =
    new ArcFetchRequest(method, path, {
      userToken: account.token,
      deviceId: account.device,
      submitData: databody
    });

  // send request
  return arcfetch(_remote_request)
    .catch((e) => {

      // if token is invalid
      // just erase the token and wait for
      // auto login in next time allocating
      if (e == 'UnauthorizedError') {
        account.token = '';
        syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
      }

      throw e;

    });

}
