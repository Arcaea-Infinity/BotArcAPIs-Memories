// filename : /source/publicapi/_arcapi_account_alloc.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// common   : request an arc account

module.exports = async function () {
  const _arcapi_userme = require('./_arcapi_userme');

  const TAG = '_arcapi_account_alloc.js';
  let _return = null;
  const _return_template = {
    success: false,
    arc_account: null,
    arc_account_info: null
  };


  return _return_template;
}