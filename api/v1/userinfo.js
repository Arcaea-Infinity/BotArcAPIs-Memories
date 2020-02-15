// filename : /v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : api for user information

import Utils from 'Utils';
import ArcApiFriendAdd from './_arcapi_friend_add';
import ArcApiFriendDelete from './_arcapi_friend_delete';
import ArcApiAccountAlloc from './_arcapi_account_alloc';
import ArcApiAccountRelease from './_arcapi_account_release';

export default async function (argument) {
  const TAG = 'userinfo.js';

  // initialize response data
  let _response_status = 200;
  let _response_data_template = {
    'name': null,
    'rating': null,
    'user_id': null,
    'join_date': null,
    'character': null,
    'is_skill_sealed': null,
    'is_char_uncapped': null
  };

  // check for arguments
  if (typeof argument.usercode != 'undefined') {

    let _return = null;

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
          console.log(TAG, '_arc_friend_index', _arc_friend_target);

          if (_arc_friend_target) {

            // delete friend
            await ArcApiFriendDelete(_arc_account, _arc_friend_target.user_id);

            // release account
            await ArcApiAccountRelease(_arc_account);

            // fill the data template
            _response_data_template.name = _arc_friend_target.name;
            _response_data_template.rating = _arc_friend_target.rating;
            _response_data_template.user_id = _arc_friend_target.user_id;
            _response_data_template.join_date = _arc_friend_target.join_date;
            _response_data_template.character = _arc_friend_target.character;
            _response_data_template.is_skill_sealed = _arc_friend_target.is_skill_sealed;
            _response_data_template.is_char_uncapped = _arc_friend_target.is_char_uncapped;

            // invalid friend target
          } else _response_status = 500;

          // invalid friend list
        } else _response_status = 502;

        // add friend error
      } else _response_status = 502;

      // alloc arc account error
    } else _response_status = 400;

    // argument error
  } else _response_status = 400;

  // return data
  return Utils.MakeApiObject(_response_status, _response_data_template);
};
