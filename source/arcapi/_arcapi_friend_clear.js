// filename : /arcapi/_arcapi_friend_clear.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// comment  : delete all friends from arc account

const TAG = '/arcapi/_arcapi_friend_clear.js';

const arcapi_userme = require('./_arcapi_userme');
const arcapi_friend_delete = require('./_arcapi_friend_delete');

module.exports = async function (arc_account, arc_friendlist = []) {

  // if no friend list pass in, we must request the origin arcapi
  if (!arc_friendlist) {
    const _arc_account_info = await arcapi_userme(_arc_account);

    // check data valid
    if (_arc_account_info)
      arc_friendlist = _arc_account_info.friends;
  }

  // here we go
  arc_friendlist.forEach(friend => {
    await arcapi_friend_delete(arc_account, friend.user_id);
  });
}
