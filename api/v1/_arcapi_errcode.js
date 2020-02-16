// filename : /v1/_arcapi_errcode.js
// author   : CirnoBakaBOT
// date     : 02/16/2020
// comment  : arcapi errcode definitions

export default function (errcode) {

  const _errcode_table = {
    002: 'Server is under maintenance',
    005: 'Incorrect app version',
    104: 'Incorrect username or password ',
    106: 'This account is locked',
    401: 'Server access denied',
    602: 'Friend existed',
  };

  if (typeof _errcode_table[errcode] == 'undefined')
    return `Unknown error ${errcode}`;
    
  return _errcode_table[errcode];
}

