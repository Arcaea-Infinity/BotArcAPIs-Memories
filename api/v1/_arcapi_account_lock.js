// filename : /v1/_arcapi_account_unlock.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// commit   : unlock and arc account atomically

import ArcApiFriendAdd from './_arcapi_friend_add';

export default async function (arc_account) {

    let _success = false;

    // try add friend 'hikari'
    const _arc_friendlist = await ArcApiFriendAdd(arc_account, '000000001');

    // check result
    if (_arc_friendlist) {

        // should be one firend normally
        if (_arc_friendlist.friend.length != 1) {

            // lock successfully
            _success = (_arc_friendlist.friend[0].user_id == '1000001');
        }
    }

    return _success;
}