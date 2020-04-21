// filename : arcapi/_arcapi_friend_delete.js
// author   : TheSnowfield
// date     : 04/12/2020
// comment  : delete friend

const TAG = 'arcapi/_arcapi_friend_delete.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, userid) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', 'friend/me/delete', {
        usertoken: account.token,
        postdata: new URLSearchParams({ 'friend_id': userid })
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { return resolve(root.value.friends); })
      .catch((e) => { return reject(e); })
  });
}