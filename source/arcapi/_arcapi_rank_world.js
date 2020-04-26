// filename : arcapi/_arcapi_rank_world.js
// author   : TheSnowfield
// date     : 04/13/2020

const TAG = '_arcapi_rank_world.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, songid, difficulty, start = 0, limit = 10) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('GET', 'score/song?' +
        new URLSearchParams({
          'song_id': songid,
          'difficulty': difficulty,
          'start': start,
          'limit': limit
        }), {
        usertoken: account.token
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.value); })
      .catch((e) => {

        // if token is not available
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);
      })
  });
}