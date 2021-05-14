const TAG: string = 'arcapi.friend.add.ts';

import syslog from '../syslog/syslog';
import arcfetch, { ArcFetchRequest, ArcFetchMethod } from './arcfetch';
import IArcAccount from './interfaces/IArcAccount';
import IArcPlayer from './interfaces/IArcPlayer';

export default (account: IArcAccount, usercode: string): Promise<Array<IArcPlayer>> => {

  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcFetchRequest(ArcFetchMethod.POST, 'friend/me/add', {
        userToken: account.token,
        deviceId: account.device,
        submitData: new URLSearchParams({ 'friend_code': usercode })
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.value.friends); })
      .catch((e) => {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);

      });

  });

}
