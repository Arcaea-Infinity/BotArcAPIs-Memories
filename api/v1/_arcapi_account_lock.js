// filename : /v1/_arcapi_account_lock.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// commit   : unlock and arc account atomically

import Utils from 'Utils';
import ArcApiFriendAdd from './_arcapi_friend_add';


export default async function (arc_account, arc_account_info = null) {

  let _return = null;
  let _return_template = {
    success: false,
    arc_friendlist: null
  };

  // try get account info from server
  if (!arc_account_info) {
    _return = await ArcApiUserMe(arc_account);

    // if failed
    if (!_return.success)
      return _return_template;

    // save account info
    arc_account_info = _return.arc_account_info;
  }

  // make sure 'hikari' is not exist in friend list
  _return = Utils.ArcFriendUserIdExist(arc_account_info.friends, BOTARCAPI_ARCAPI_ATOMICUSER.user_id)
  if (_return)
    return _return_template;

  // try add friend 'hikari'
  _return = await ArcApiFriendAdd(arc_account, BOTARCAPI_ARCAPI_ATOMICUSER.user_code);
  if (_return.success) {

    // update to latest friend list
    _return_template.arc_friendlist = _return.arc_friendlist;

    // make sure 'hikari' in friend list
    _return_template.success =
      Utils.ArcFriendUserIdExist(_return.arc_friendlist, BOTARCAPI_ARCAPI_ATOMICUSER.user_id);

  }

  return _return_template;
}