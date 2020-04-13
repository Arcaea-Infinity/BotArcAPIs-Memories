// filename : arcapi/_arcapi_account_release.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// common   : release an arc account

const TAG = 'arcapi/_arcapi_account_release.js';

module.exports = function (account) {
  const _return_template = {
    success: false
  };

  // push an account back to queue
  // ** pretend to be a queue =(:3) z)_ **
  if (typeof ARCACCOUNT != 'undefined' || typeof account != 'undefined') {
    ARCACCOUNT.push(account);
    _return_template.success = true;
    syslog.i(TAG, `Released arc account => ${account.name} ${account.token}`);
  }

  return _return_template;
}