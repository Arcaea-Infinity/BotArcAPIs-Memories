// filename : arcapi/_arcapi_friend_clear.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// comment  : delete all friends from an arc account

const TAG = 'arcapi/_arcapi_friend_clear.js';

const arcapi_userme = require('./_arcapi_userme');
const arcapi_friend_delete = require('./_arcapi_friend_delete');

module.exports = (account, friends = []) => {

  // fetch friend list
  const do_fetch_friend = async (x) => {
    // we must request the origin arcapi
    // if no friend list passed in
    if (!x.length)
      await arcapi_userme(account)
        .then((root) => { x = root.friends; })
    return x;
  }

  // clear friend list
  const do_clear_friend = async (x, index = 0) => {
    if (index > x.length - 1)
      return;
    await arcapi_friend_delete(account, x[index].user_id);
    await do_clear_friend(x, index + 1);
  }

  // execute promise chain
  return Promise.resolve(friends)
    .then((x) => do_fetch_friend(x))
    .then((x) => do_clear_friend(x))
    .catch((e) => { syslog.e(TAG, e.stack); return reject(e); });
}
