const TAG: string = 'v4/user/info.ts\t';

import syslog from  '../../../modules/syslog/syslog';
import APIError from  '../../../modules/apierror/apierror';

import arcapi_friend_add from  '../../../modules/arcfetch/arcapi.friend.add';
import arcapi_friend_clear from  '../../../modules/arcfetch/arcapi.friend.clear';
import account_alloc from  '../../../modules/account/alloc';
import account_recycle from  '../../../modules/account/recycle';

import arcrecord_update from  '../../../modules/database/database.arcrecord.update';
import arcplayer_update from  '../../../modules/database/database.arcplayer.update';
import arcrecord_byuserid from  '../../../modules/database/database.arcrecord.byuserid';

import IArcAccount from  '../../../modules/arcfetch/interfaces/IArcAccount';
import IArcPlayer from  '../../../modules/arcfetch/interfaces/IArcPlayer';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /userinfo?usercode=xxx[&recent=true]
      // check for request arguments
      if (typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid usercode');

      let _arc_account: IArcAccount | null = null;
      let _arc_friendlist: Array<IArcPlayer> | null = null;
      let _arc_friend: IArcPlayer | null = null;

      // request an arc account
      try {
        _arc_account = await account_alloc();
      } catch (e) { throw new APIError(-2, 'allocate an arc account failed'); }

      try {

        // clear friend list
        try {
          await arcapi_friend_clear(_arc_account);
        } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-3, 'clear friend list failed'); }

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

        // must do deep copy
        const _return = JSON.parse(JSON.stringify(_arc_friend));

        // insert new record into database
        if (_arc_friend.recent_score.length)
          await arcrecord_update(_arc_friend.user_id, _arc_friend.recent_score)
            .catch((error) => { syslog.e(error.stack); });

        // delete field if no need recent data
        if (argument.recent != 'true') {
          delete _return.recent_score;
        } else {
          // pickup user recent records from the database
          _return.recent_score = await arcrecord_byuserid(_arc_friend.user_id, 7);
        }

        // delete usercode field
        delete _return.code;

        resolve(_return);

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

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
