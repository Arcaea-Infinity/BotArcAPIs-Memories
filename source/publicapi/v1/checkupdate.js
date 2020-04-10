// filename : /v1/checkupdate.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : checkupdate

const TAG = 'v1/checkupdate.js';

const fetch = require('node-fetch');
const Request = require('node-fetch').Request;
const APIError = require('../../error');

module.exports = async function (argument) {
  const _return_template = {
    'status': 0,
    'message': null,
    'content': {
      'version': null,
      'download_link': null
    }
  };

  // build http request
  const _remote_request =
    new Request('https://www.fantasyroom.cn/api/v1/arcver.php', {
      method: 'GET',
      headers: {
        'User-Agent': 'BotArcAPI'
      }
    });

  try {
    let _remote_response = null;
    let _json_root = null;

    // try to request origin service
    try {
      _remote_response = await fetch(_remote_request);
      _json_root = await _remote_response.json();
    } catch (e) {
      throw new APIError(-1, 'remote service unavaliable');
    }

    // fill the data template
    if (_json_root.res != 'success')
      throw new APIError(-2, 'fetch latest version failed');
    _return_template.content.version = _json_root.contents.android.version;
    _return_template.content.download_link = _json_root.contents.android.apk_dl_link;

  } catch (e) {
    // return errcode and errmessage
    _return_template.status = e.status;
    _return_template.message = e.notify;
  }

  return _return_template;
};
