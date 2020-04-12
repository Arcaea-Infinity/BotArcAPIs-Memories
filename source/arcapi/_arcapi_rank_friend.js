// filename : arcapi/_arcapi_rank_friend.js
// author   : CirnoBakaBOT
// date     : 04/12/2020

const TAG = 'arcapi/_arcapi_friend_delete.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async function (arcaccount, songid, difficulty, start = 0, limit = 10) {
  const _return_template = {
    success: false,
    ranklist: null
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
        usertoken: arcaccount.token
      });

    // send request
    await arcfetch(_remote_request)
      .then((root) => {
        _return_template.success = true;
        _return_template.ranklist = root.value;
      })
      .catch((e) => { throw e; })

  } catch (e) { syslog.e(TAG, e); }

  return _return_template;
}