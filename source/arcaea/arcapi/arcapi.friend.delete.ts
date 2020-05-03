import syslog from '../../corefunc/syslog';
import arcfetch, { ArcFetchRequest } from '../arcfetch';

const TAG: string = 'arcapi.friend.delete.ts';

export default
  (account: IArcAccount, userid: number): Promise<Array<IArcPlayer>> => {
    return new Promise((resolve, reject) => {

      // construct remote request
      const _remote_request =
        new ArcFetchRequest(ArcFetchMethod.POST, 'friend/me/delete', {
          userToken: account.token,
          submitData: new URLSearchParams({ 'friend_id': userid } as any)
        });

      // send request
      arcfetch(_remote_request)
        .then((root) => { resolve(root.value.friends); })
        .catch((e) => {

          if (e == 'UnauthorizedError') {
            account.token = '';
            syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
          }

          reject(e);

        });

    });

  }