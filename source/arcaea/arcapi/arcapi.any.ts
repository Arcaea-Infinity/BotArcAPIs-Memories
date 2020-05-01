import arcfetch, { ArcFetchRequest } from '../arcfetch';

export default
  (account: IArcAccount, method: ArcFetchMethod,
    path: string, databody: string): Promise<any> => {
    return new Promise((resolve, reject) => {

      // construct remote request
      const _remote_request =
        new ArcFetchRequest(method, path, {
          userToken: account.token,
          submitData: databody
        });

      // send request
      arcfetch(_remote_request)
        .then((root) => { resolve(root); })
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
