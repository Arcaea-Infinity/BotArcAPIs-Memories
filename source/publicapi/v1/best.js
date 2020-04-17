// filename : /v1/userbest.js
// author   : CirnoBakaBOT
// date     : 02/17/2020
// comment  : api for user best record

const TAG = 'v1/userbest.js\t';

const APIError = require('../../corefunc/error');
const arcapi_friend_add = require('../../arcapi/_arcapi_friend_add');
const arcapi_friend_clear = require('../../arcapi/_arcapi_friend_clear');
const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
const arcapi_account_release = require('../../arcapi/_arcapi_account_release');
const arcapi_rank_friend = require('../../arcapi/_arcapi_rank_friend');

const dbproc_arcrecord_update = require('../../database/_dbproc_arcrecord_update');
const dbproc_arcplayer_update = require('../../database/_dbproc_arcplayer_update');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /best?usercode=xxx&songid&difficulty=x
      // check for request arguments
      if (typeof argument.usercode == 'undefined')
        throw new APIError(-1, 'invalid usercode');
      if (typeof argument.songid == 'undefined')
        throw new APIError(-2, 'invalid songid');
      if (typeof argument.difficulty == 'undefined')
        throw new APIError(-3, 'invalid difficulty');

      let _arc_account = null;
      let _arc_friendlist = null;
      let _arc_friend = null;
      let _arc_ranklist = null;
      let _arc_rank = null;

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
          _arc_friendlist = await arcapi_friend_add(_arc_account, argument.usercode);
        } catch (e) { throw new APIError(-4, 'add friend failed'); }

        // length must be 1
        if (_arc_friendlist.length != 1)
          throw new APIError(-5, 'internal error occurred');

        // result of arcapi not include
        // user code anymore since v6
        _arc_friend = _arc_friendlist[0];
        _arc_friend.code = argument.usercode;

        // get rank result
        try {
          _arc_ranklist = await arcapi_rank_friend(_arc_account, argument.songid, argument.difficulty, 0, 1);
        } catch (e) { throw new APIError(-6, 'internal error occurred'); }

        if (!_arc_ranklist.length)
          throw new APIError(-7, 'not played yet');

        // calculate song rating
        _arc_rank = _arc_ranklist[0];
        _arc_rank.rating = 233;

        const _return = _arc_rank;
        delete _return.name;
        delete _return.user_id;

        // result of arcapi not include
        // user code anymore since v6
        delete _return.user_code;

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
      // insert new record into database
      dbproc_arcrecord_update(_arc_friend.user_id, _arc_rank)
        .catch((error) => { syslog.e(error.stack); });

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
}