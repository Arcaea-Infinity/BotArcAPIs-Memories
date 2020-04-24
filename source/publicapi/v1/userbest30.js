// filename : v1/userbest30.js
// author   : TheSnowfield
// date     : 04/24/2020
// comment  : api for user best30

const TAG = 'v1/userbest30.js\t';

const APIError = require('../../corefunc/error');
const Utils = require('../../corefunc/utils');

const arcapi_friend_add = require('../../arcapi/_arcapi_friend_add');
const arcapi_friend_clear = require('../../arcapi/_arcapi_friend_clear');
const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
const arcapi_account_release = require('../../arcapi/_arcapi_account_release');
const arcapi_aggregate = require('../../arcapi/_arcapi_aggregate');

const dbproc_arcrecord_update = require('../../database/_dbproc_arcrecord_update');
const dbproc_arcplayer_update = require('../../database/_dbproc_arcplayer_update');
const dbproc_arcbest30_byuid = require('../../database/_dbproc_arcbest30_byuid');
const dbproc_arcbest30_update = require('../../database/_dbproc_arcbest30_update');
const dbproc_arcsong_charts_all = require('../../database/_dbproc_arcsong_charts_all');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /userbest30?usercode=xxx
      // check for request arguments
      if (typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid usercode');

      let _arc_account = null;
      let _arc_friendlist = null;
      let _arc_friend = null;
      let _arc_best30 = null;
      let _arc_best30_cache = null;

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

        if (!_arc_friend.recent_score.length)
          throw new APIError(-6, 'not played yet');

        // read best30 cache from database
        try {
          _arc_best30_cache = await dbproc_arcbest30_byuid(_arc_friend.user_id);
          syslog.d(_arc_best30_cache);
        } catch (e) { throw new APIError(-7, 'internal error'); }

        // confirm update cache is needed by compare last played time
        if (!_arc_best30_cache ||
          _arc_best30_cache.last_played < _arc_friend.recent_score[0].time_played) {

          // do fetch best30
          _arc_best30 = await do_fetch_userbest30(_arc_account, _arc_friend);

          // delete unused fields
          _arc_best30.best30_list.forEach((_, index) => {
            delete _arc_best30.best30_list[index].name;
            delete _arc_best30.best30_list[index].user_id;
          });

          // update cache
          dbproc_arcbest30_update(_arc_friend.user_id,
            _arc_friend.recent_score[0].time_played, _arc_best30)
            .catch((e) => { syslog.e(TAG, e.stack); });

          // update records
          dbproc_arcrecord_update(_arc_friend.user_id, _arc_best30.best30_list)
            .catch((e) => { syslog.e(TAG, e.stack); });

        } else {
          _arc_best30 = _arc_best30_cache;
        }

        const _return = {
          best30_avg: _arc_best30.best30_avg,
          recent10_avg: _arc_best30.recent10_avg,
          best30_list: _arc_best30.best30_list
        };

        resolve(_return);

      } catch (e) {
        // recycle the account when any error occurred
        if (_arc_account)
          arcapi_account_release(_arc_account);
        // re-throw the error
        throw e;
      }

      // release account
      arcapi_account_release(_arc_account)
        .catch((e) => { syslog.e(TAG, e.stack); });
      // update user info and recently played
      dbproc_arcplayer_update(_arc_friend)
        .catch((e) => { syslog.e(TAG, e.stack); });
      // insert new record into database
      if (_arc_friend.recent_score.length)
        dbproc_arcrecord_update(_arc_friend.user_id, _arc_friend.recent_score)
          .catch((e) => { syslog.e(TAG, e.stack); });

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
}

const do_fetch_userbest30 = (account, userinfo) => {
  return new Promise(async (resolve, reject) => {

    try {

      let _arc_chartlist = null;
      let _arc_chartuser = [];

      // read all charts for best30 querying
      try {
        _arc_chartlist = await dbproc_arcsong_charts_all();
      } catch (e) { throw new APIError(-8, 'internal error'); }

      if (!_arc_chartlist) {
        syslog.f(TAG, 'Fatal error occured when read charts');
        syslog.f(TAG, 'Consider to update the song database?');
        throw new APIError(-9, 'internal error');
      }

      // query 30 charts first
      try {
        const _chartheap = _arc_chartlist.splice(0, 30);

        for (let i = 0; i < 6; ++i) {

          // fill the endpoints
          const _endpoints = [];
          for (let j = 0; j < 5; ++j) {
            const v = _chartheap[i * 5 + j];
            _endpoints.push(`/score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=1`);
          }

          // send request
          const _result = await arcapi_aggregate(account, _endpoints);

          // validate data
          for (let j = 0; j < 5; ++j) {
            if (!_result[j]) continue;

            const v = _chartheap[i * 5 + j];
            if (_result[j].song_id != v.sid || _result[j].difficulty != v.rating_class)
              return reject(new APIError(-10, 'internal error'));

            // calculate rating
            _result[j].rating = Utils.arcCalcSongRating(_result[j].score, v.rating);
            _arc_chartuser.push(_result[j]);
          }
        }

        // sort the results by rating
        do_charts_sort(_arc_chartuser);

      } catch (e) { syslog.e(TAG, e.stack); return reject(new APIError(-11, 'querying best30 failed')) }


      // then query the remained charts until rating less than user ptt -2
      try {

        while (true) {

          const _chartheap = [];
          const _endpoints = [];
          for (let i = 0; i < 5; ++i) {
            if (_arc_chartlist.length != 0 &&
              _arc_chartuser[_arc_chartuser.length - 1].rating - 2 <= _arc_chartlist[0].rating) {

              // fill the endpoints and chartheap
              const v = _arc_chartlist.shift();
              _endpoints.push(`/score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=1`);
              _chartheap.push(v);

            } else break;
          }

          // no chart to queue
          if (!_endpoints.length)
            break;

          // send request
          const _result = await arcapi_aggregate(account, _endpoints);

          // validate data
          for (let i = 0; i < _chartheap.length; ++i) {
            if (!_result[i]) continue;

            if (_result[i].song_id != _chartheap[i].sid ||
              _result[i].difficulty != _chartheap[i].rating_class)
              return reject(new APIError(-12, 'internal error'));

            // calculate rating
            _result[i].rating = Utils.arcCalcSongRating(_result[i].score, _chartheap[i].rating);

            // if chart does not full
            // then pushback and resort
            if (_arc_chartuser.length < 30) {
              _arc_chartuser.push(_result[i]);
              do_charts_sort(_arc_chartuser);
            }

            // else if current rating higher than last one
            // then replace it and resort
            else if (_result[i].rating > _arc_chartuser[_arc_chartuser.length - 1].rating) {
              _arc_chartuser[_arc_chartuser.length - 1] = _result[i];
              do_charts_sort(_arc_chartuser);
            }

          }
        }

        // sort the results by rating
        do_charts_sort(_arc_chartuser);

      } catch (e) { return reject(new APIError(-13, 'querying best30 failed')) }

      syslog.d(JSON.stringify(_arc_chartuser));

      // calculate sum of best30
      let _best30_sum = 0;
      _arc_chartuser.forEach((element) => { _best30_sum += element.rating; });

      syslog.d(_best30_sum, userinfo.rating);

      // calculate best30 and recent10 average
      // return zero when user rating is nagative
      const _best30_avg = _best30_sum / 30;
      const _recent10_avg = userinfo.rating == -1 ? 0 : (userinfo.rating / 100) * 4 - _best30_avg * 3;

      const _return = {
        best30_avg: _best30_avg,
        recent10_avg: _recent10_avg,
        best30_list: _arc_chartuser,
      };

      resolve(_return);

    } catch (e) { return reject(e); }

  });
}

const do_charts_sort = (charts) => {
  charts.sort((x, y) => {
    return y.rating - x.rating;
  });
}
