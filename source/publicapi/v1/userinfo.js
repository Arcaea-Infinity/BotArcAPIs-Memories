// filename : v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : api for arcuser information

const TAG = 'v1/userinfo.js\t';

const APIError = require('../../corefunc/error');
const arcapi_friend_add = require('../../arcapi/_arcapi_friend_add');
const arcapi_friend_clear = require('../../arcapi/_arcapi_friend_clear');
const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
const arcapi_account_release = require('../../arcapi/_arcapi_account_release');

const dbproc_record_update = require('../../database/_dbproc_record_update');
const dbproc_userinfo_update = require('../../database/_dbproc_userinfo_update');

module.exports = async (argument) => {
  const _return_template = {
    'status': 0,
    'message': null,
    'content': null
  };

  let _return = null;
  let _arc_account = null;

  try {

    // /userinfo?usercode=xxx[&hasrecent=true]
    // check for request arguments
    if (typeof argument.usercode == 'undefined')
      throw new APIError(-1, 'invalid argument');

    // request an arc account
    _return = arcapi_account_alloc();
    if (!_return.success)
      throw new APIError(-2, 'request an arc account from pool failed');
    _arc_account = _return.account;

    // clear friend list
    _return = await arcapi_friend_clear(_arc_account);
    if (!_return)
      throw new APIError(-3, 'internal error');

    // add friend
    _return = await arcapi_friend_add(_arc_account, argument.usercode);
    if (!_return.success)
      throw new APIError(-4, 'add friend failed');

    // length must be 1
    if (_return.friends.length != 1)
      throw new APIError(-5, 'internal error');
    const _arc_friend = _return.friends[0];

    // release account
    arcapi_account_release(_arc_account);

    // update user info and recent played
    // dbproc_userinfo_update(_arc_friend);
    // if (_arc_friend.recent_score.length)
    //   dbproc_record_update(_arc_friend.recent);

    // fill the data template
    _return_template.content = _arc_friend;
    _return_template.content.recent_score = _arc_friend.recent_score[0];

    // if need recent data
    if (!argument.hasrecent && !_arc_friend.recent_score.length) {
      delete _return_template.content.recent_score;
    }

  } catch (e) {

    syslog.e(TAG, e.stack);

    // release this account
    if (_arc_account)
      arcapi_account_release(_arc_account);

    // return errcode and errmessage
    _return_template.status = e.status;
    _return_template.message = e.notify;

  }

  return _return_template;
};
