const TAG: string = 'v4/user/best.ts\t';

import Utils from '../../../corefunc/utils';
import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';

import arcapi_friend_add from '../../../modules/arcfetch/arcapi.friend.add';
import arcapi_friend_clear from '../../../modules/arcfetch/arcapi.friend.clear';
import account_alloc from '../../../modules/account/alloc';
import account_recycle from '../../../modules/account/recycle';
import arcplayer_byany from '../../../modules/database/database.arcplayer.byany';

import arcsong_bysongid from '../../../modules/database/database.arcsong.bysongid';
import arcsong_sid_byany from '../../../modules/database/database.arcsong.sid.byany';
import arcrecord_update from '../../../modules/database/database.arcrecord.update';
import arcrecord_history from '../../../modules/database/database.arcrecord.history';
import arcplayer_update from '../../../modules/database/database.arcplayer.update';
import IDatabaseArcPlayer from "../../../modules/database/interfaces/IDatabaseArcPlayer";
import IDatabaseArcRecord from '../../../modules/database/interfaces/IDatabaseArcRecord';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject): Promise<any> => {

    try {

      // /user/best?[user=xxx][usercode=xxx]&songname=xxx&difficulty=x
      // validate request arguments
      if ((typeof argument.user == 'undefined' || argument.user == '')
        && typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid username or usercode');

      if (argument.usercode && !(/\d{9}/g.test(argument.usercode)))
        throw new APIError(-2, 'invalid usercode');

      if (typeof argument.songname == 'undefined' || argument.songname == '')
        throw new APIError(-3, 'invalid songname');

      argument.quantity = parseInt(argument.quantity);
      if (isNaN(argument.quantity) || argument.quantity == 0)
        argument.quantity = BOTARCAPI_USERBEST_HISTORY_DEFAULT;
      if (argument.quantity < 0 || argument.quantity > BOTARCAPI_USERBEST_HISTORY_MAX)
        throw new APIError(-4, 'invalid history quantity');

      if (typeof argument.difficulty == 'undefined' || argument.difficulty == '')
        throw new APIError(-5, 'invalid difficulty');

      let _arc_difficulty: any = Utils.arcMapDiffFormat(argument.difficulty, 0);
      if (!_arc_difficulty)
        throw new APIError(-6, 'invalid difficulty');

      let _arc_ucode: string = "";
      let _arc_account: any = null;
      let _arc_songid: any = null;
      let _arc_songinfo: any = null;
      let _arc_friendlist: any = null;
      let _arc_friend: any = null;

      // check songid valid
      try {
        _arc_songid = await arcsong_sid_byany(argument.songname);
      } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-7, 'this song is not recorded in the database'); }

      if (_arc_songid.length > 1)
        throw new APIError(-8, 'too many records');
      _arc_songid = _arc_songid[0];

      try {
        _arc_songinfo = await arcsong_bysongid(_arc_songid);
      } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-9, 'internal error'); }

      // check for beyond is existed
      if (_arc_songinfo.difficultly_byn == -1 && _arc_difficulty == 3) {
        throw new APIError(-10, 'this song has no beyond level');
      }

      // use this usercode directly
      if (argument.usercode) {
        _arc_ucode = argument.usercode;
      }

      // try search this user code while usercode not passing in
      else if (argument.user) {

        let users: IDatabaseArcPlayer[];

        try {
          users = await arcplayer_byany(argument.user);
        } catch (e) { throw new APIError(-11, 'internal error occurred'); }

        if (users.length <= 0)
          throw new APIError(-12, 'user not found');

        // too many users
        if (users.length > 1)
          throw new APIError(-13, 'too many users');

        _arc_ucode = users[0].code;
      }

      // check user code again
      if (!_arc_ucode)
        throw new APIError(-14, 'internal error occurred');

      // request an arc account
      try {
        _arc_account = await account_alloc();
      } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-15, 'allocate an arc account failed'); }

      try {

        // clear friend list
        try {
          await arcapi_friend_clear(_arc_account);
        } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-16, 'clear friend list failed'); }

        // add friend
        try {
          _arc_friendlist = await arcapi_friend_add(_arc_account, _arc_ucode);
        } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-17, 'add friend failed'); }

        // length must be 1
        if (_arc_friendlist.length != 1)
          throw new APIError(-18, 'internal error occurred');

        // result of arcapi not include
        // user code anymore since v6
        _arc_friend = _arc_friendlist[0];
        _arc_friend.code = _arc_ucode;

        let _history: IDatabaseArcRecord[] = [];

        try {
          _history = await arcrecord_history(_arc_friend.user_id,
            _arc_songid, _arc_difficulty, argument.quantity);
        } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-19, 'internal error'); }

        resolve({ history: _history.map((v: any) => { delete v.uid; return v; }) });

      } catch (e) {
        // recycle account when any error occurred
        if (_arc_account)
          account_recycle(_arc_account);
        // re-throw the error
        throw e;
      }

      // release account
      account_recycle(_arc_account);

      // update user info and recently played
      arcplayer_update(_arc_friend)
        .catch((error) => { syslog.e(error.stack); });

      // insert new record into database
      if (_arc_friend.recent_score.length)
        arcrecord_update(_arc_friend.user_id, _arc_friend.recent_score)
          .catch((error) => { syslog.e(error.stack); });

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
