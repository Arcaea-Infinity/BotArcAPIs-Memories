// filename : arcapi/any.js
// author   : TheSnowfield
// date     : 04/10/2020
// commont  : any request

const TAG = 'arcapi/any.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, method, path, databody) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest(method, path, {
        usertoken: account.token,
        data: databody
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root); })
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
