import arcfetch, { ArcFetchRequest } from '../arcfetch';

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

          // if token is invalid
          // just erase the token and wait for
          // auto login in next time allocating
          if (e == 'UnauthorizedError') {
            account.token = '';
          }

          reject(e);
        })
    });
  }