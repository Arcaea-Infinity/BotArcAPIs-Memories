// filename : v1/userinfo.js
// author   : TheSnowfield
// date     : 04/17/2020
// comment  : api for arcuser information

const TAG = 'v1/userinfo.js\t';

const APIError = require('../../corefunc/error');
const arcapi_friend_add = require('../../arcapi/_arcapi_friend_add');
const arcapi_friend_clear = require('../../arcapi/_arcapi_friend_clear');
const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
const arcapi_account_release = require('../../arcapi/_arcapi_account_release');

const dbproc_arcrecord_update = require('../../database/_dbproc_arcrecord_update');
const dbproc_arcplayer_update = require('../../database/_dbproc_arcplayer_update');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /userinfo?usercode=xxx[&hasrecent=true]
      // check for request arguments
      if (typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid argument');

      let _arc_account = null;
      let _arc_friends = null;
      let _arc_friend = null;

      // request an arc account
      try {
        _arc_account = await arcapi_account_alloc();
      } catch (e) { throw new APIError(-2, 'allocate an arc account failed'); }

      try {

        // clear friend list
        try {
          await arcapi_friend_clear(_arc_account);
        } catch (e) { throw new APIError(-3, 'clear friend list failed'); }

        // add friend
        try {
          _arc_friends = await arcapi_friend_add(_arc_account, argument.usercode);
        } catch (e) { throw new APIError(-4, 'add friend failed'); }

        // length must be 1
        if (_arc_friends.length != 1)
          throw new APIError(-5, 'internal error occurred');

        // result of arcapi not include
        // user code anymore since v6
        _arc_friend = _arc_friends[0];
        _arc_friend.code = argument.usercode;

        // must do deep copy
        const _return = JSON.parse(JSON.stringify(_arc_friend));
        _return.recent_score = _arc_friend.recent_score[0];

        // delete field if needn't recent data or not played yet
        if (argument.hasrecent != 'true' || !_arc_friend.recent_score.length)
          delete _return.recent_score;

        resolve(_return);

      } catch (e) {
        // recycle account when any error occurred
        if (_arc_account)
          arcapi_account_release(_arc_account);
        // re-throw the error
        throw e;
      }

      // release account
      arcapi_account_release(_arc_account)
        .catch((error) => { syslog.e(error.stack); });
      // update user info and recently played
      dbproc_arcplayer_update(_arc_friend)
        .catch((error) => { syslog.e(error.stack); });
      // insert new record into database
      if (_arc_friend.recent_score.length)
        dbproc_arcrecord_update(_arc_friend.user_id, _arc_friend.recent_score)
          .catch((error) => { syslog.e(error.stack); });

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
}
