import arcfetch, { ArcFetchRequest } from '../arcfetch';

export default
  (account: IArcAccount, songid: string,
    difficulty: number, start: number = 0, limit: number = 10) => {

    return new Promise((resolve, reject) => {
      // construct remote request
      const _remote_request =
        new ArcFetchRequest(ArcFetchMethod.GET, 'score/song/friend', {
          userToken: account.token,
          submitData: new URLSearchParams({
            'song_id': songid,
            'difficulty': difficulty,
            'start': start,
            'limit': limit
          } as any),
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