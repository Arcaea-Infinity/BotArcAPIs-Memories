// filename : arcapi/login.js
// author   : TheSnowfield
// date     : 04/12/2020
// comment  : login

const TAG = 'arcapi/login.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (name, password, deviceid) => {
  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', `auth/login`, {
        username: name,
        userpwd: password,
        deviceid: deviceid,
        postdata: new URLSearchParams({ 'grant_type': 'client_credentials' })
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.access_token); })
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
