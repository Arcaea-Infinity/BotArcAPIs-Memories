// filename : /source/arcapi/_arcapi_friend_clear.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : delete all friends from arc account

module.exports = async function (arc_account, arc_friendlist = []) {
  const _arcapi_userme = require('./_arcapi_userme');
  const _arcapi_friend_delete = require('./_arcapi_friend_delete');

  // if no friend list pass in, we must request the origin arcapi
  if (!arc_friendlist) {
    const _arc_account_info = await _arcapi_userme(_arc_account);

    // check data valid
    if (_arc_account_info) {

      // f r i e n d l i s t !
      arc_friendlist = _arc_account_info.friends;
    }
  }

  // here we go
  arc_friendlist.forEach(friend => {
    _arcapi_friend_delete(arc_account, friend.user_id);
  });

}