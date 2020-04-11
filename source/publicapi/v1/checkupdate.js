// filename : /v1/checkupdate.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : checkupdate

const TAG = 'v1/checkupdate.js';

const fetch = require('node-fetch');
const Request = require('node-fetch').Request;
const APIError = require('../../corefunc/error');

module.exports = async function () {
  const _return_template = {
    'status': 0,
    'message': null,
    'content': {
      'version': null,
      'download_link': null
    }
  };

  try {

    // construct remote request
    const _promise_remote =
      new Request('https://www.fantasyroom.cn/api/v1/arcver.php', {
        method: 'GET',
        headers: {
          'User-Agent': 'BotArcAPI'
        }
      });

    // request remote service
    await fetch(_promise_remote)
      .then((response) => {
        // parse json if success
        if (response.status === 200)
          return response.json();
        throw new APIError(-1, 'remote service now is unavailable');
      })
      .then((jsonroot) => {
        // check result if success
        if (jsonroot.res === 'success') {
          _return_template.content.version = jsonroot.contents.android.version;
          _return_template.content.download_link = jsonroot.contents.android.apk_dl_link;
        }
        else throw new APIError(-2, 'request remote service failed');
      })
      .catch((e) => { throw new APIError(-3, 'request timeout'); });

  } catch (e) {
    syslog.e(TAG, e.notyify);
    _return_template.status = e.status;
    _return_template.message = e.notify;
  }

  return _return_template;
};
