// filename : /v1/_arcapi_errcode.js
// author   : CirnoBakaBOT
// date     : 02/16/2020
// comment  : arcapi errcode definitions

export default function (errcode) {

  const _errcode_table = {
    002: 'Server is under maintenance.',
    005: 'Incorrect app version.',
    100: 'Registrations from this IP address are restricted.',
    101: 'This username is already in use.',
    102: 'This email address is already in use.',
    103: 'An account has already been made from this device.',
    104: 'Username or password incorrect.',
    105: 'You\'ve logged into over 2 devices in 24 hours.',
    106: 'This account is locked.',
    107: 'You do not have enough stamina.',
    112: 'World map not unlocked.',
    113: 'This event map has ended and is no longer available.',
    120: 'WARNING! You are using a modified version of Arcaea.',
    121: 'This account is locked.',
    122: 'A temporary hold has been placed on your account.',
    401: 'Server access denied.',
    501: 'This item is currently unavailable to purchase.',
    502: 'This item is currently unavailable to purchase.',
    504: 'Invalid Code',
    503: 'An unknown error has occured.',
    505: 'This code has already been claimed.',
    506: 'You already own this item.',
    602: 'This user is already your friend.',
    604: 'You can\'t be friends with yourself ;-;',
    905: 'Download too much, please wait another 24 hours.'
  };

  if (typeof _errcode_table[errcode] == 'undefined')
    return `An unknown error has occured. ${errcode}`;

  return _errcode_table[errcode];
}

