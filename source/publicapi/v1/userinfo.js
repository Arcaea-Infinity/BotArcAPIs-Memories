// filename : v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : api for arcuser information

const TAG = 'v1/userinfo.js';

const APIError = require('../../error.js');
const arcapi_friend_add = require('../../arcapi/_arcapi_friend_add');
const arcapi_friend_clear = require('../../arcapi/_arcapi_friend_clear');
const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
const arcapi_account_release = require('../../arcapi/_arcapi_account_release');

const dbproc_arcaccount_alloc = require('../../database/_dbproc_arcaccount_alloc');
const dbproc_arcaccount_release = require('../../database/_dbproc_arcaccount_release');

const dbproc_record_update = require('../../database/_dbproc_record_update');
const dbproc_userinfo_update = require('../../database/dbproc_userinfo_update');
const dbproc_userinfo_byusercode = require('../../database/_dbproc_userinfo_byusercode');

module.exports = async function (argument) {
  const _return_template = {
    'status': 0,
    'message': null,
    'content': {
      'name': null,
      'rating': null,
      'user_id': null,
      'join_date': null,
      'character': null,
      'is_skill_sealed': null,
      'is_char_uncapped': null,
      'recent': {
        'score': null,
        'health': null,
        'rating': null,
        'song_id': null,
        'modifier': null,
        'difficulty': null,
        'near_count': null,
        'miss_count': null,
        'clear_type': null,
        'time_played': null,
        'perfect_count': null,
        'best_clear_type': null,
        'shiny_perfect_count': null
      }
    }
  };

  let _return = null;
  let _arc_account = null;

  try {

    // /userinfo?usercode=xxx[&hasrecent=true]
    // check for request arguments
    if (typeof argument.usercode != 'undefined')
      throw new APIError(-1, 'invalid argument');

    // try to query userinfo by usercode
    _return = await dbproc_userinfo_byusercode(arguemnt.usercode);
    const _user_info = _return.user_info;

    // request an arc account
    _return = await dbproc_arcaccount_alloc();
    if (!_return.success)
      throw new APIError(-2, 'request an arc account from pool failed');
    _arc_account = _return.arc_account;

    throw new APIError(-233,'debug break');

    // if we know user id then can add friend directly
    // otherwise we must clear friend list to keep atomically
    if (!_user_info.user_id) {
      _return = await arcapi_friend_clear(_arc_account);
      if (!_return.success)
        throw new APIError(-3, 'clear friend list failed');
    }

    // add friend and fetch result then release arc account
    _return = await arcapi_friend_add(_arc_account, argument.usercode)
    if (!_return.success)
      throw new APIError(-4, 'add friend failed');
    arcapi_account_release(_arc_account);

    // find out this user
    const _arc_friend_list = _return.friend_list;
    const _arc_friend = _arc_friend_list[0];

    // fill the data template
    _return_template.content.name = _arc_friend.name;
    _return_template.content.rating = _arc_friend.rating;
    _return_template.content.user_id = _arc_friend.user_id;
    _return_template.content.join_date = _arc_friend.join_date;
    _return_template.content.character = _arc_friend.character;
    _return_template.content.recent_score = _arc_friend.recent_score;
    _return_template.content.is_skill_sealed = _arc_friend.is_skill_sealed;
    _return_template.content.is_char_uncapped = _arc_friend.is_char_uncapped;
    dbproc_userinfo_update(_arc_friend);

    // if need recent data and this user has recent
    if (argument.hasrecent && _arc_friend.recent) {
      _return_template.content.recent.score = _arc_friend.recent.score;
      _return_template.content.recent.health = _arc_friend.recent.health;
      _return_template.content.recent.rating = _arc_friend.recent.rating;
      _return_template.content.recent.song_id = _arc_friend.recent.song_id;
      _return_template.content.recent.modifier = _arc_friend.recent.modifier;
      _return_template.content.recent.difficulty = _arc_friend.recent.difficulty;
      _return_template.content.recent.near_count = _arc_friend.recent.near_count;
      _return_template.content.recent.miss_count = _arc_friend.recent.miss_count;
      _return_template.content.recent.clear_type = _arc_friend.recent.clear_type;
      _return_template.content.recent.time_played = _arc_friend.recent.time_played;
      _return_template.content.recent.perfect_count = _arc_friend.recent.perfect_count;
      _return_template.content.recent.best_clear_type = _arc_friend.recent.best_clear_type;
      _return_template.content.recent.shiny_perfect_count = _arc_friend.recent.shiny_perfect_count;
      dbproc_record_update(_arc_friend.recent);
    }

  } catch (e) {

    // release this account
    if (_arc_account)
      arcapi_account_release(_arc_account);

    // return errcode and errmessage
    _return_template.status = e.status;
    _return_template.message = e.notify;

  }

  return _return_template;
};
