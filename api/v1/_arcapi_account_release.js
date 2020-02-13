// filename : _arcapi_account_release.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// common   : release an arc account atomically

import ArcApiAccountUnlock from './_arcapi_account_unlock';

export default async function (arc_account) {
    return ArcApiAccountUnlock(arc_account);
}