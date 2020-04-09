// filename : /publicapi/v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : api for user information

const ArcApiFriendAdd = require('../../arcapi/_arcapi_friend_add');
const ArcApiFriendClear = require('../../_arcapi_friend_clear');
const ArcApiAccountAlloc = require('../../_arcapi_account_alloc');
const ArcApiAccountRelease = require('../../_arcapi_account_release');

export default async function (argument) {
  const TAG = 'userinfo.js';

  // initialize response data
  let _return = null;
  const _response_template = {
    'status': null,
    'content': {
      'name': null,
      'rating': null,
      'user_id': null,
      'join_date': null,
      'character': null,
      'recent_score': null,
      'is_skill_sealed': null,
      'is_char_uncapped': null
    }
  };

  // check for arguments
  if (typeof argument.usercode != 'undefined') {

    // request an arc account
    _return = await ArcApiAccountAlloc();
    if (_return.success) {
      const _arc_account = _return.arc_account;
      const _arc_friendlist_before = _return.arc_account_info.friends;
      console.log(TAG, '_arc_friendlist_before', _arc_friendlist_before);

      // backup old friend list and compare after added friend
      _return = await ArcApiFriendAdd(_arc_account, argument.usercode)
      if (_return.success) {
        const _arc_friendlist_current = _return.arc_friendlist;
        console.log(TAG, '_arc_friendlist_current', _arc_friendlist_current);

        // check friend list valid
        if (_arc_friendlist_current.length - _arc_friendlist_before.length == 1) {

          // compare and find new friend
          const _arc_friend_target =
            Utils.ArcCompareFriendList(_arc_friendlist_before, _arc_friendlist_current);
          console.log(TAG, '_arc_friend_target', _arc_friend_target);

          if (_arc_friend_target) {

            // release account
            await ArcApiAccountRelease(_arc_account);

            // fill the data template
            _response_template.content.name = _arc_friend_target.name;
            _response_template.content.rating = _arc_friend_target.rating;
            _response_template.content.user_id = _arc_friend_target.user_id;
            _response_template.content.join_date = _arc_friend_target.join_date;
            _response_template.content.character = _arc_friend_target.character;
            _response_template.content.recent_score = _arc_friend_target.recent_score;
            _response_template.content.is_skill_sealed = _arc_friend_target.is_skill_sealed;
            _response_template.content.is_char_uncapped = _arc_friend_target.is_char_uncapped;

            // invalid friend target
          } else _response_template.status = -5;

          // invalid friend list
        } else _response_template.status = -4;

        // add friend error
      } else _response_template.status = -3;

      // alloc arc account error
    } else _response_template.status = -2;

    // argument error
  } else _response_template.status = -1;

  // return data
  return _response_template;
};
