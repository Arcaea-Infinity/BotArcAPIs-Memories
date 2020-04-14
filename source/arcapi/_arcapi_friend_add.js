// filename : /source/arcapi/_arcapi_friend_add.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// commont  : add friend

const TAG = 'arcapi/_arcapi_friend_add.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, usercode) => {
  return new Promise((reslove, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', 'friend/me/add', {
        usertoken: account.token,
        postdata: new URLSearchParams({ 'friend_code': usercode })
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { return reslove(root.value.friends); })
      .catch((e) => { return reject(e); })
  });
}