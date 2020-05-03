import syslog from '../../corefunc/syslog';
import APIError from '../../corefunc/apierror';
import arcapi_friend_add from '../../arcaea/arcapi/arcapi.friend.add';
import arcapi_friend_clear from '../../arcaea/arcapi/arcapi.friend.clear';
import account_alloc from '../../arcaea/account/account.alloc';
import account_recycle from '../../arcaea/account/account.recycle';
import arcrecord_update from '../../database/database.arcrecord.update';
import arcplayer_update from '../../database/database.arcplayer.update';

const TAG = 'v1/userinfo.ts\t';
export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /userinfo?usercode=xxx[&recent=true]
      // check for request arguments
      if (typeof argument.usercode == 'undefined' || argument.usercode == '')
        throw new APIError(-1, 'invalid usercode');

      let _arc_account = null;
      let _arc_friendlist = null;
      let _arc_friend = null;

      // request an arc account
      try {
        _arc_account = await account_alloc();
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

        // must do deep copy
        const _return = JSON.parse(JSON.stringify(_arc_friend));
        _return.recent_score = _arc_friend.recent_score[0];

        // delete field if needn't recent data or not played yet
        if (argument.recent != 'true' || !_arc_friend.recent_score.length)
          delete _return.recent_score;

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
