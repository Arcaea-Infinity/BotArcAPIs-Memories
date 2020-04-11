// filename : arcapi/_arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// common   : request an arc account

const TAG = 'arcapi/_arcapi_account_alloc.js';

module.exports = function () {
  const _return_template = {
    success: false,
    arc_account: null,
  };

  // request an arc account from global ARCACCOUNT
  // ** pretend to be a queue =(:3) z)_ **
  if (typeof ARCACCOUNT != 'undefined') {

    // grab an account from queue
    const _arc_account = ARCACCOUNT.shift(1);
    if (typeof _arc_account != 'undefined') {
      _return_template.success = true;
      _return_template.arc_account = _arc_account;
    }
  }

  return _return_template;
}
