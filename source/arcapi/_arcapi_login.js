// filename : /arcapi/_arcapi_login.js
// author   : CirnoBakaBOT
// date     : 04/12/2020
// comment  : login

const TAG = 'arcapi/_arcapi_login.js';

const btoa = require('btoa');
const fetch = require('node-fetch');
const Request = fetch.Request;

module.exports = async (name, password, deviceid) => {
  const _return_template = {
    success: false,
    access_token: null
  };

  try {

    // construct remote request
    const _promise_remote =
      new Request(`https://arcapi.lowiro.com/${ARCAPI_VERSION}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept-Encoding': 'identity',
          'Authorization': `Basic ${btoa(`${name}:${password}`)}`,
          'DeviceId': deviceid,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'AppVersion': ARCAPI_APPVERSION,
          'User-Agent': ARCAPI_USERAGENT,
          'Host': 'arcapi.lowiro.com',
          'Connection': 'Keep-Alive'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials'
        })
      });

    // request origin arcapi
    await fetch(_promise_remote)
      .then((response) => {
        // parse json if success
        if (response.status === 200)
          return response.json();
        throw new Error('arcapi now is unavailable');
      })
      .then((jsonroot) => {
        // check result if success
        if (jsonroot.success) {
          _return_template.success = true;
          _return_template.access_token = jsonroot.access_token;
        }
        else throw new Error('request origin arcapi failed');
      });

  } catch (e) {
    syslog.e(TAG, e);
  }

  return _return_template;
}