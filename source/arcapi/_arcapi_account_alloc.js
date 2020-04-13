// filename : arcapi/_arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// common   : request an arc account

const TAG = 'arcapi/_arcapi_account_alloc.js';

module.exports = function () {
  const _return_template = {
    success: false,
    account: null,
  };

  // request an arc account from global ARCACCOUNT
  // ** pretend to be a queue =(:3) z)_ **
  if (typeof ARCACCOUNT != 'undefined') {

    // grab an account from queue
    const _element = ARCACCOUNT.shift(1);
    if (typeof _element != 'undefined') {
      _return_template.success = true;
      _return_template.account = _element;
      syslog.i(TAG, `Allocated arc account => ${_element.name} ${_element.token}`);
    }
  }

  return _return_template;
}
