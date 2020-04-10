// filename : __loader__.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : autoloader can handle api request and map to class methods,
//            make api maintaining easily it's also global access entry

const TAG = 'source/__loader__.js';

module.exports = async (request, response) => {
  let _response_status = 200;
  const _response_template = {
    status: null,
    content: null,
    message: null
  };

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_arguments = Object.fromEntries(_api_url.searchParams);
  syslog.v(TAG, `Accept request at => ${_api_path}`);
  syslog.v(TAG, `Accept request at => ${response}`);

  try {
    // try invoke method
    const _api_entry = require(`./publicapi/${_api_path}`);
    const _api_result = await _api_entry(_api_arguments);

    _response_template.status = _api_result.status;
    if (_api_result.status < 0) {
      // if failed delete content field
      delete _response_template.content;
      _response_template.message = _api_result.message;
    }
    else {
      // if success delete message field
      delete _response_template.message;
      _response_template.content = _api_result.content;
    }
  }
  catch (e) {
    _response_status = 404;
    syslog.e(TAG, e.toString());
  }

  // make response body
  let _http_body = null;

  if (_response_status == 404)
    _http_body = 'request path notfound =(:3) z)_';
  else
    _http_body = JSON.stringify(_response_template);

  // send json result to client
  response.statusCode = _response_status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(_http_body);

  syslog.v(TAG, 'Send response back');
}
