// filename : arcapi/_arcapi_account_release.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// common   : release an arc account

module.exports = function (arc_account) {
  const _return_template = {
    success: false
  };

  // push an account back to queue
  // ** pretend to be a queue =(:3) z)_ **
  if (typeof ARCACCOUNT != 'undefined' || typeof arc_account != 'undefined') {
    ARCACCOUNT.push(arc_account);
    _return_template.success = true;
  }

  return _return_template;
}