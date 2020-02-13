// filename : /v1/_arcapi_friend_clear.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// comment  : delete all friends from arc account

import ArcApiUserMe from './_arcapi_userme';
import ArcApiFriendDelete from './_arcapi_friend_delete';

export default async function (arc_account, arc_friendlist = []) {

    // if no friend list pass in, we must request the origin arcapi
    if (!arc_friendlist) {
        const _arc_account_info = await ArcApiUserMe(_arc_account);

        // check data valid
        if (_arc_account_info) {

            // f r i e n d l i s t !
            arc_friendlist = _arc_account_info.friends;
        }
    }

    // here we go
    arc_friendlist.forEach(friend => {
        ArcApiFriendDelete(arc_account, friend.user_id);
    });

}