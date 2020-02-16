// filename : /v1/_arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// common   : request an arc account atomically

import Utils from 'Utils';
import ArcApiUserMe from './_arcapi_userme';
import ArcApiAccountLock from './_arcapi_account_lock';

export default async function () {

  const TAG = '_arcapi_account_alloc.js';

  let _isfound = false;
  let _retry_count = 0;
  let _arc_account = null;
  let _arc_account_info = null;

  let _return = null;
  const _return_template = {
    success: false,
    arc_account: null,
    arc_account_info: null
  };

  do {
    // request an arc account
    _return = await Utils.ArcRequestAccount();
    if (_return.success) {
      _arc_account = _return.arc_account;
      console.log(TAG, 'ArcRequestAccount() success', _arc_account.token);

      // request origin arcapi
      _return = await ArcApiUserMe(_arc_account);
      if (_return.success) {
        _arc_account_info = _return.arc_account_info;
        console.log(TAG, 'ArcApiUserMe() success', _arc_account_info);

        // try lock it
        _return = await ArcApiAccountLock(_arc_account, _arc_account_info);

        // update friend list
        _arc_account_info.friends = _return.arc_friendlist;

        // lock success?
        _isfound = _return.success;
        if (_isfound) break;

      }
    }

    if (++_retry_count >= 3) break;
    console.log(TAG, 'Account alloc failing, retry', _retry_count);

  } while (!_isfound)

  // fill template
  _return_template.success = _isfound;
  _return_template.arc_account = _isfound ? _arc_account : null;
  _return_template.arc_account_info = _isfound ? _arc_account_info : null;

  return _return_template;
}