// filename : arcapi/_arcapi_friend_clear.js
// author   : TheSnowfield
// date     : 04/11/2020
// comment  : delete all friends from an arc account

const TAG = 'arcapi/_arcapi_friend_clear.js';

const arcapi_userme = require('./_arcapi_userme');
const arcapi_friend_delete = require('./_arcapi_friend_delete');

module.exports = async (account, friends = []) => {

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
  const do_clear_friend = async (friends, index = 0) => {
    if (index > friends.length - 1)
      return;
    await arcapi_friend_delete(account, friends[index].user_id)
    await do_clear_friend(friends, index + 1);
  }

  // execute promise chain
  return Promise.resolve(friends)
    .then((friends) => do_fetch_friend(friends))
    .then((friends) => do_clear_friend(friends))
    .catch((error) => { syslog.e(TAG, error.stack); return reject(error); });
}
