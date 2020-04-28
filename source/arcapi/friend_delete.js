// filename : arcapi/friend_delete.js
// author   : TheSnowfield
// date     : 04/12/2020
// comment  : delete friend

const TAG = 'arcapi/friend_delete.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, userid) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', 'friend/me/delete', {
        usertoken: account.token,
        data: new URLSearchParams({ 'friend_id': userid })
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.value.friends); })
      .catch((e) => {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);
      })
  });
}