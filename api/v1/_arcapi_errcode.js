// filename : /v1/_arcapi_errcode.js
// author   : CirnoBakaBOT
// date     : 02/16/2020
// comment  : arcapi errcode definitions

export default function (errcode) {

  const _errcode_table = {
    0000: 'An error occurred completing purchases. Please try restarting your device or Arcaea and ensuring that you\'re logged in to.',
    0001: 'This item is currently unavailable to purchase.',
    0002: 'All songs are already downloaded!',
    0003: 'You have been logged out by another device. Please restart Arcaea.',
    0004: 'Could not connect to online server.',
    0005: 'Incorrect app version.',
    0009: 'The Arcaea network is currently under maintenance.',
    0012: 'Please update Arcaea to the latest version.',
    0100: 'Registrations from this IP address are restricted. Try again later or contact support@lowiro.com.',
    0101: 'This username is already in use.',
    0102: 'This email address is already in use.',
    0103: 'An account has already been made from this device.',
    0104: 'Username or password incorrect.',
    0105: 'You\'ve logged into over 2 devices in 24 hours. Please wait before using this new device.',
    0106: 'This account is locked.',
    0107: 'You do not have enough stamina.',
    0112: 'World map not unlocked.',
    0113: 'This event map has ended and is no longer available.',
    0120: 'WARNING! You are using a modified version of Arcaea. Continued use will result in the banning of your account. This is a final warning.',
    0121: 'This account is locked.',
    0122: 'A temporary hold has been placed on your account. Please visit the official website to resolve the issue.',
    0150: 'This feature has been restricted for your account. If you are unsure why, please contact support@lowiro.com',
    0401: 'This user does not exist.',
    0403: 'Could not connect to online server.',
    0501: 'This item is currently unavailable to purchase.',
    0502: 'This item is currently unavailable to purchase.',
    0504: 'Invalid Code',
    0505: 'This code has already been claimed.',
    0506: 'You already own this item.',
    0604: 'You can\'t be friends with yourself ;-;',
    0601: 'Your friends list is full.',
    0602: 'This user is already your friend.',
    0803: 'There was a problem submitting this score online. WARNING!Stamina has already been consumed. Exiting will lose World Mode progress.',
    0903: 'Max downloads exceeded. Please wait 24 hours and try again.',
    0905: 'Download too much, please wait another 24 hours.',
    9801: 'An error occured downloading the song.Please try again.',
    9802: 'There was a problem saving the song.Please check storage.',
    9905: 'No data found to sync.',
    9907: 'A problem occured updating data...',
    9908: 'There is a new version of Arcaea available.Please update.'
  };

  if (typeof _errcode_table[errcode] == 'undefined')
    return `An unknown error has occured. ${errcode}`;

  return _errcode_table[errcode];
}

