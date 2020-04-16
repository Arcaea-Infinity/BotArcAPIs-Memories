// filename : v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 04/16/2020
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

    let _arc_account = null;

    try {

      // /userinfo?usercode=xxx[&hasrecent=true]
      // check for request arguments
      if (typeof argument.usercode == 'undefined')
        reject(new APIError(-1, 'invalid argument'));

      // request an arc account
      await arcapi_account_alloc()
        .then((account) => { _arc_account = account; })
        .catch((error) => { reject(new APIError(-2, 'request an arc account from pool failed')); });

      // clear friend list
      await arcapi_friend_clear(_arc_account)
        .catch((error) => { reject(new APIError(-3, 'internal error')); });

      // add friend
      let _arc_friend = null;
      await arcapi_friend_add(_arc_account, argument.usercode)
        .then((friends) => {
          // length must be 1
          if (friends.length != 1)
            return reject(new APIError(-4, 'internal error'));

          // result of arcapi not include
          // user code anymore since v6
          _arc_friend = friends[0];
          _arc_friend.code = argument.usercode;
        })
        .catch((error) => { reject(new APIError(-5, 'add friend failed')); });

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

      // fill the data template
      const _return = _arc_friend;
      _return.recent_score = _arc_friend.recent_score[0];

      // if need recent data
      if (argument.hasrecent != 'true' && !_arc_friend.recent_score.length) {
        delete _return.recent_score;
      }

      resolve(_return);

    } catch (error) {

      // release this account
      if (_arc_account)
        arcapi_account_release(_arc_account);

      // only handle APIError
      if (error instanceof APIError)
        return reject(error);

      syslog.e(TAG, error.stack);
      reject(new APIError(-6, 'internal error'));
    }
  });
}
