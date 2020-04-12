// filename : arcapi/_arcapi_rank_friend.js
// author   : CirnoBakaBOT
// date     : 04/12/2020

const TAG = 'arcapi/_arcapi_friend_delete.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async function (account, songid, difficulty, start = 0, limit = 10) {
  const _return_template = {
    success: false,
    ranks: null
  };

  try {
    // construct remote request
    const _remote_request =
      new ArcAPIRequest('GET', 'score/song/friend?' +
        new URLSearchParams({
          'song_id': songid,
          'difficulty': difficulty,
          'start': start,
          'limit': limit
        }), {
        usertoken: account.token
      });

    // send request
    await arcfetch(_remote_request)
      .then((root) => {
        _return_template.success = true;
        _return_template.ranks = root.value;
      })
      .catch((e) => { throw e; })

  } catch (e) { syslog.e(TAG, e); }

  return _return_template;
}