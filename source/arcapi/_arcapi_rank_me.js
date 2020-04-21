// filename : arcapi/_arcapi_rank_me.js
// author   : TheSnowfield
// date     : 04/13/2020

const TAG = 'arcapi/_arcapi_rank_me.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, songid, difficulty, start = 0, limit = 10) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('GET', 'score/song/me?' +
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
      .then((root) => { return resolve(root.value); })
      .catch((e) => { return reject(e); })
  });
}