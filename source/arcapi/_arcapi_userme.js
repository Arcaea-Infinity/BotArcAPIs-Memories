// filename : arcapi/_arcapi_userme.js
// author   : CirnoBakaBOT
// date     : 04/12/2020

const TAG = 'arcapi/_arcapi_userme.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async (account) => {
  const _return_template = {
    success: false,
    info: null
  };

  try {
    // construct remote request
    const _remote_request =
      new ArcAPIRequest('GET', 'user/me', {
        deviceid: account.deviceid,
        usertoken: account.token
      });

    // send request
    await arcfetch(_remote_request)
      .then((root) => {
        _return_template.success = true;
        _return_template.info = root.value;
      })
      .catch((e) => { throw e; })

  } catch (e) { syslog.e(TAG, e); }

  return _return_template;
}
