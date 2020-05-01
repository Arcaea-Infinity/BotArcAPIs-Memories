import arcfetch, { ArcFetchRequest } from '../arcfetch';

export default
  (account: IArcAccount): Promise<IArcUserMe> => {
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
