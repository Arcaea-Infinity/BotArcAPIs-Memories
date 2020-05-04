import syslog from '@syslog';
import arcfetch, { ArcFetchRequest } from './arcfetch';

const TAG: string = 'arcapi.userme.ts';

export default (account: IArcAccount): Promise<IArcUserMe> => {
  
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcFetchRequest(ArcFetchMethod.GET, 'user/me', {
        deviceId: account.device,
        userToken: account.token
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.value); })
      .catch((e) => {

        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);

      });

  });

}
