// filename : /v1/_arcapi_account_unlock.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// commit   : unlock and arc account atomically

import Utils from 'Utils';
import ArcApiFriendDelete from './_arcapi_friend_delete';

export default async function (arc_account) {

  let _return = null;
  const _return_template = {
    success: false,
    arc_friendlist: null
  };

  // try delete friend
  _return = await ArcApiFriendDelete(arc_account, BOTARCAPI_ARCAPI_ATOMICUSER.user_id);
  if (_return.success) {

    // update to latest friend list
    _return_template.arc_friendlist = _return.arc_friendlist;

    // make sure friend has been deleted
    _return_template.success =
      Utils.ArcFriendUserIdExist(_return.arc_friendlist, BOTARCAPI_ARCAPI_ATOMICUSER.user_id);

  }

  return _return_template;
}