const TAG: string = 'v4/user/best30.ts\t';

import syslog from '../../../modules/syslog/syslog';
import Utils from '../../../corefunc/utils';
import APIError from '../../../modules/apierror/apierror';

import arcapi_friend_add from '../../../modules/arcfetch/arcapi.friend.add';
import arcapi_friend_clear from '../../../modules/arcfetch/arcapi.friend.clear';
import arcapi_aggregate from '../../../modules/arcfetch/arcapi.aggregate';
import account_alloc from '../../../modules/account/alloc';
import account_recycle from '../../../modules/account/recycle';

import arcrecord_update from '../../../modules/database/database.arcrecord.update';
import arcplayer_update from '../../../modules/database/database.arcplayer.update';
import arcbest30_byuid from '../../../modules/database/database.arcbest30.byuid';
import arcbest30_update from '../../../modules/database/database.arcbest30.update';
import arcsong_charts_all from '../../../modules/database/database.arcsong.allcharts';
import arcplayer_byany from '../../../modules/database/database.arcplayer.byany';

import IArcAccount from '../../../modules/arcfetch/interfaces/IArcAccount';
import IArcScore from "../../../modules/arcfetch/interfaces/IArcScore";
import IArcPlayer from '../../../modules/arcfetch/interfaces/IArcPlayer';
import IArcBest30Result from '../../../modules/database/interfaces/IArcBest30Result';
import IDatabaseArcSongChart from '../../../modules/database/interfaces/IDatabaseArcSongChart';
import IDatabaseArcPlayer from "../../../modules/database/interfaces/IDatabaseArcPlayer";

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /user/best30?[user=xxx][usercode=xxx]
      // validate request arguments
      if ((typeof argument.user == 'undefined' || argument.user == '')
        && typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid username or usercode');

      if (argument.usercode && !(/\d{9}/g.test(argument.usercode)))
        throw new APIError(-2, 'invalid usercode');

      argument.overflow = parseInt(argument.overflow);
      if (isNaN(argument.overflow)) argument.overflow = 0;
      if (argument.overflow < 0) argument.overflow = 0;

      let _arc_ucode: string = "";
      let _arc_account: IArcAccount | null = null;
      let _arc_friendlist: Array<IArcPlayer> | null = null;
      let _arc_friend: IArcPlayer | null = null;
      let _arc_best30: IArcBest30Result | any = null;
      let _arc_best30_cache: IArcBest30Result | null = null;

      // use this usercode directly
      if (argument.usercode) {
        _arc_ucode = argument.usercode;
      }

      // try search this user code while usercode not passing in
      else if (argument.user) {

        let users: IDatabaseArcPlayer[];

        try {
          users = await arcplayer_byany(argument.user);
        } catch (e) { throw new APIError(-3, 'internal error occurred'); }

        if (users.length <= 0)
          throw new APIError(-4, 'user not found');

        // too many users
        if (users.length > 1)
          throw new APIError(-5, 'too many users');

        _arc_ucode = users[0].code;
      }

      // check user code again
      if (!_arc_ucode)
        throw new APIError(-6, 'internal error occurred');

      // request an arc account
      try {
        _arc_account = await account_alloc();
      } catch (e) { throw new APIError(-7, 'allocate an arc account failed'); }

      try {

        // clear friend list
        try {
          await arcapi_friend_clear(_arc_account);
        } catch (e) { throw new APIError(-8, 'clear friend list failed'); }

        // add friend
        try {
          _arc_friendlist = await arcapi_friend_add(_arc_account, _arc_ucode);
        } catch (e) { throw new APIError(-9, 'add friend failed'); }

        // length must be 1
        if (_arc_friendlist.length != 1)
          throw new APIError(-10, 'internal error occurred');

        // result of arcapi not include
        // user code anymore since v6
        _arc_friend = _arc_friendlist[0];
        _arc_friend.code = _arc_ucode;

        if (!_arc_friend.recent_score.length)
          throw new APIError(-11, 'not played yet');

        // read best30 cache from database
        try {
          _arc_best30_cache = await arcbest30_byuid(_arc_friend.user_id);
        } catch (e) { throw new APIError(-12, 'internal error occurred'); }

        // confirm update cache is needed by compare last played time
        if (!_arc_best30_cache ||
          _arc_best30_cache.last_played < _arc_friend.recent_score[0].time_played) {

          // do fetch best30
          _arc_best30 = await do_fetch_userbest30(_arc_account, _arc_friend);

          // delete unused fields
          _arc_best30.best30_list.forEach((_: any, index: number) => {
            delete _arc_best30.best30_list[index].name;
            delete _arc_best30.best30_list[index].user_id;
          });

          _arc_best30.best30_overflow.forEach((_: any, index: number) => {
            delete _arc_best30.best30_overflow[index].name;
            delete _arc_best30.best30_overflow[index].user_id;
          });

          // update cache
          arcbest30_update(_arc_friend.user_id, _arc_best30)
            .catch((e: Error) => { syslog.e(TAG, e.stack); });

        } else _arc_best30 = _arc_best30_cache;

        let _return: any = {
          best30_avg: _arc_best30.best30_avg,
          recent10_avg: _arc_best30.recent10_avg,
          best30_list: _arc_best30.best30_list,
          best30_overflow: _arc_best30.best30_overflow
        };

        // clamp overflow results
        if (argument.overflow >= 0) {

          if (argument.overflow == 0)
            delete _return.best30_overflow;
          else
            _return.best30_overflow =
              _return.best30_overflow.slice(0, argument.overflow);
        }

        resolve(_return);

      } catch (e) {

        // recycle the account when any error occurred
        if (_arc_account)
          account_recycle(_arc_account);

        // re-throw the error
        throw e;

      }

      // release account
      account_recycle(_arc_account);

      // update user info and recently played
      arcplayer_update(_arc_friend)
        .catch((e: Error) => { syslog.e(TAG, e.stack); });

      // insert new record into database
      if (_arc_friend.recent_score.length)
        arcrecord_update(_arc_friend.user_id, _arc_friend.recent_score)
          .catch((e: Error) => { syslog.e(TAG, e.stack); });

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}

const do_fetch_userbest30 =
  (account: IArcAccount, userinfo: IArcPlayer): Promise<IArcBest30Result> => {

    return new Promise(async (resolve, reject) => {

      let _arc_records: IArcScore[] = [];

      try {

        let _arc_chartlist: Array<IDatabaseArcSongChart> | null = null;
        let _arc_chartuser = [];
        let _arc_chartoverflow = [];

        // read all charts for best30 querying
        try {
          _arc_chartlist = await arcsong_charts_all();
        } catch (e) { throw new APIError(-13, 'internal error occurred'); }

        if (!_arc_chartlist) {
          syslog.f(TAG, 'Fatal error occured when read charts');
          syslog.f(TAG, 'Consider to update the song database?');
          throw new APIError(-14, 'internal error occurred');
        }

        // query 30 charts first
        try {

          const _chartheap: Array<IDatabaseArcSongChart> =
            _arc_chartlist.splice(0, 30);

          for (let i = 0; i < 5; ++i) {

            // fill the endpoints
            const _endpoints: Array<string> = [];
            for (let j = 0; j < 6; ++j) {
              const v = _chartheap[i * 6 + j];
              _endpoints.push(`score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=11`);
            }

            // send request
            const _result: any = await arcapi_aggregate(account, _endpoints);

            // validate data
            for (let j = 0; j < 6; ++j) {
              if (!_result[j]) continue;

              const v = _chartheap[i * 6 + j];
              if (_result[j].song_id != v.sid || _result[j].difficulty != v.rating_class)
                return reject(new APIError(-15, 'internal error occurred'));

              // calculate rating
              _result[j].rating = Utils.arcCalcSongRating(_result[j].score, v.rating);
              _arc_chartuser.push(_result[j]);

              // save records
              _arc_records.push(_result[j]);
            }
          }

          // sort the results by rating
          do_charts_sort(_arc_chartuser);

        } catch (e) { syslog.e(TAG, e.stack); return reject(new APIError(-16, 'querying best30 failed')) }


        // then query the remained charts until rating less than user ptt -2
        try {

          while (true) {

            const _chartheap: Array<IDatabaseArcSongChart> = [];
            const _endpoints: Array<string> = [];
            for (let i = 0; i < 6; ++i) {
              if (_arc_chartlist.length != 0 && (_arc_chartuser.length < 30 ||
                _arc_chartuser[_arc_chartuser.length - 1].rating - 2 <= _arc_chartlist[0].rating ||
                _arc_chartuser[_arc_chartuser.length - 1].rating - 3 <= _arc_chartlist[0].rating)) {

                // fill the endpoints and chartheap
                const v: any = _arc_chartlist.shift();
                _endpoints.push(`score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=11`);
                _chartheap.push(v);

              } else break;
            }

            // no chart to query
            if (!_endpoints.length)
              break;

            // send request
            const _result: any = await arcapi_aggregate(account, _endpoints);

            // validate data
            for (let i = 0; i < _chartheap.length; ++i) {
              if (!_result[i]) continue;

              if (_result[i].song_id != _chartheap[i].sid ||
                _result[i].difficulty != _chartheap[i].rating_class)
                return reject(new APIError(-17, 'internal error occurred'));

              // calculate rating
              _result[i].rating = Utils.arcCalcSongRating(_result[i].score, _chartheap[i].rating);

              // pushback and resort when
              // chart is not full
              if (_arc_chartuser.length < 30) {
                _arc_chartuser.push(_result[i]);
                do_charts_sort(_arc_chartuser);
              }

              // replace it and resort when
              // the current rating is higher than last one
              else if (_result[i].rating > _arc_chartuser[_arc_chartuser.length - 1].rating) {

                // save overflow
                _arc_chartoverflow.push(_arc_chartuser[_arc_chartuser.length - 1]);

                // replace last one
                _arc_chartuser[_arc_chartuser.length - 1] = _result[i];
                do_charts_sort(_arc_chartuser);
              }

              // save overflow
              else _arc_chartoverflow.push(_result[i]);

              // save records
              _arc_records.push(_result[i]);
            }

          }

          // sort the results by rating
          do_charts_sort(_arc_chartuser);
          do_charts_sort(_arc_chartoverflow);

        } catch (e) { syslog.e(TAG, e.stack); return reject(new APIError(-18, 'querying best30 failed')) }

        // calculate sum of best30
        let _best30_sum: number = 0;
        _arc_chartuser.forEach((element) => { _best30_sum += element.rating; });

        syslog.d(_best30_sum, userinfo.rating);

        // calculate best30 and recent10 average value
        // return zero when user ptt is negative
        const _best30_avg: number = _best30_sum / 30;
        let _recent10_avg: number = userinfo.rating == -1 ? 0 : (userinfo.rating / 100) * 4 - _best30_avg * 3;

        // this is impossible
        if (_best30_avg == 0 && userinfo.rating > 0)
          return reject(new APIError(-19, 'internal error occurred'));

        // clamp minimum value
        if (_recent10_avg < 0) {
          _recent10_avg = 0;
          syslog.w(TAG, 'Recent 10 average value less than 0.');
        }

        // Save all records that have been searched
        arcrecord_update(userinfo.user_id, _arc_records)
          .catch((e: Error) => { syslog.e(TAG, e.stack); });

        resolve({
          last_played: userinfo.recent_score[0].time_played,
          best30_avg: Math.floor(_best30_avg * 1000) / 1000,
          recent10_avg: Math.floor(_recent10_avg * 1000) / 1000,
          best30_list: _arc_chartuser,
          best30_overflow: _arc_chartoverflow
        } as IArcBest30Result);

      } catch (e) { return reject(e); }

    });

  }

const do_charts_sort = (charts: any) => {

  charts.sort((x: any, y: any) => {
    return y.rating - x.rating;
  });

}
