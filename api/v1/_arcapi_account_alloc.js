// filename : _arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// common   : request an arc account atomically

import Utils from 'Utils';
import ArcApiUserMe from './_arcapi_userme';
import ArcApiAccountLock from './_arcapi_account_lock';

export default async function () {

    let _exit = false;
    let _count = 0;
    let _arc_account = null;

    do {
        // request an arc account
        _arc_account = await Utils.RequestArcAccount();
        if (_arc_account instanceof Object) {

            // request origin arcapi
            const _arc_account_info = await ArcApiUserMe(_arc_account);

            // check data valid
            if (_arc_account_info) {

                // account is in use?
                if (_arc_account_info.friends.length == 0) {

                    // unused, lock it
                    _exit = await ArcApiAccountLock(_arc_account);
                }
            }
        }

        if (_count++ > 3) _exit = true;

    } while (!_exit)

    // return account when success
    return _arc_account;
}