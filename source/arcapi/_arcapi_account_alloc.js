// filename : arcapi/_arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 04/14/2020
// common   : request an arc account

const TAG = 'arcapi/_arcapi_account_alloc.js';

module.exports = () => {
  return new Promise((reslove, reject) => {
    // request an arc account from global ARCACCOUNT
    // ** pretend to be a queue =(:3) z)_ **

    if (typeof ARCACCOUNT == 'undefined') { syslog.e(''); return reject(); }
    if (!ARCACCOUNT.length)
      return reject();

    // grab an account from queue
    const _element = ARCACCOUNT.shift(1);
    if (typeof _element == 'undefined')
      return reject();

    reslove(_element);
    syslog.i(TAG, `Allocated arc account => ${_element.name} ${_element.token}`);
  })
}




