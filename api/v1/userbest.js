// filename : /v1/userbest.js
// author   : CirnoBakaBOT
// date     : 02/16/2020
// comment  : api for user best record

import Utils from 'Utils';
import ArcApiFriendAdd from './_arcapi_friend_add';
import ArcApiFriendDelete from './_arcapi_friend_delete';
import ArcApiAccountAlloc from './_arcapi_account_alloc';
import ArcApiAccountRelease from './_arcapi_account_release';
import ArcApiRankFriend from './_arcapi_rank_friend';

export default async function (argument) {
  const TAG = 'userbest.js';

  // initialize response data
  let _return = null;
  let _response_status = 200;
  const _response_data_template = {
    'score': null,
    'health': null,
    'modifier': null,
    'character': null,
    'time_played': null,
    'clear_type': null,
    'best_clear_type': null,
    'miss_count': null,
    'near_count': null,
    'perfect_count': null,
    'shiny_perfect_count': null
  };

  // check for arguments
  if (typeof argument.usercode != 'undefined' && typeof argument.song_id != 'undefined' &&
    typeof argument.difficulty != 'undefined') {

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

            // query rank list
            _return = await ArcApiRankFriend(_arc_account,
              argument.song_id, argument.difficulty, 0, 1);

            if (_return.success) {

              // delete friend
              await ArcApiFriendDelete(_arc_account, _arc_friend_target.user_id);

              // release account
              await ArcApiAccountRelease(_arc_account);

              // fill the data template
              _response_data_template.score = _return.arc_ranklist[0].score;
              _response_data_template.health = _return.arc_ranklist[0].health;
              _response_data_template.modifier = _return.arc_ranklist[0].modifier;
              _response_data_template.character = _return.arc_ranklist[0].character;
              _response_data_template.time_played = _return.arc_ranklist[0].time_played;

              _response_data_template.clear_type = _return.arc_ranklist[0].clear_type;
              _response_data_template.best_clear_type = _return.arc_ranklist[0].best_clear_type;

              _response_data_template.miss_count = _return.arc_ranklist[0].miss_count;
              _response_data_template.near_count = _return.arc_ranklist[0].near_count;
              _response_data_template.perfect_count = _return.arc_ranklist[0].perfect_count;
              _response_data_template.shiny_perfect_count = _return.arc_ranklist[0].shiny_perfect_count;

              // invalid fiend ranklist
            } else _response_status = 502;

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