// filename : /v1/_arcapi_account_unlock.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// commit   : unlock and arc account atomically

import ArcApiFriendDelete from './_arcapi_friend_delete';

export default async function (arc_account) {

    let _success = false;

    // try delete friend 'hikari'
    const _arc_friendlist = await ArcApiFriendDelete(arc_account, '1000001');

    // check result
    if (_arc_friendlist) {

        _success = true;

        // make sure friend has deleted
        _arc_friendlist.some(friend => {
            if (friend.user_id == '1000001')
                _success = false;
        })
    }

    return _success;
}