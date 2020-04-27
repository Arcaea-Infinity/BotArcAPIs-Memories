// filename : arcapi/friend_add.js
// author   : TheSnowfield
// date     : 04/10/2020
// commont  : add friend

const TAG = 'arcapi/friend_add.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, usercode) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', 'friend/me/add', {
        usertoken: account.token,
        postdata: new URLSearchParams({ 'friend_code': usercode })
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
