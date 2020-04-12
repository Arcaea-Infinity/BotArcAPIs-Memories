// filename : /arcapi/_arcapi_login.js
// author   : CirnoBakaBOT
// date     : 04/12/2020
// comment  : login

const TAG = 'arcapi/_arcapi_login.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async (name, password, deviceid) => {
  const _return_template = {
    success: false,
    access_token: null
  };

  try {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', `auth/login`, {
        username: name,
        userpwd: password,
        deviceid: deviceid,
        postdata: new URLSearchParams({ 'grant_type': 'client_credentials' })
      });

    // send request
    await arcfetch(_remote_request)
      .then((root) => {
        _return_template.success = true;
        _return_template.access_token = root.access_token;
      })
      .catch((e) => { throw e; })

  } catch (e) { syslog.e(TAG, e); }

  return _return_template;
}
