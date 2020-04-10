// filename : /v1/checkupdate.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : checkupdate

const TAG = 'v1/checkupdate.js';
const fetch = require('node-fetch');

module.exports = async function (argument) {
  const _response_template = {
    'status': null,
    'message': null,
    'content': {
      'version': null,
      'download_link': null
    }
  };

  // build http request
  const _remote_request =
    new fetch.Request('https://www.fantasyroom.cn/api/v1/arcver.php', {
      method: 'GET',
      headers: {
        'User-Agent': 'BotArcAPI'
      }
    });
  const _remote_response = await fetch(_remote_request);
  const _json_root = await _remote_response.json();

  try {

    // fill the data template
    if (_json_root.res == 'success') {
      _response_template.status = 0;
      _response_template.content.version = _json_root.contents.android.version;
      _response_template.content.download_link = _json_root.contents.android.apk_dl_link;

    } else {
      _response_template.status = -2;
      _response_template.message = 'fetch latest version failed';
    }
  } catch (e) {
    _response_template.status = -1;
    _response_template.message = 'remote service unavaliable';
  }

  return _response_template;
};

