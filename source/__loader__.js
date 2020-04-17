// filename : __loader__.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : autoloader can handle api request and map to class methods,
//            make api maintaining easily it's also global access entry

const TAG = 'source/__loader__.js';

module.exports = async (request, response) => {

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_arguments = Object.fromEntries(_api_url.searchParams);
  syslog.i(TAG, `Accept request at => ${_api_path} ${JSON.stringify(_api_arguments)}`);

  // make response body
  let _http_body = null;
  let _http_status = null;

  try {
    // try invoke method
    const _api_entry = require(`./publicapi/${_api_path}`);
    const _api_result = {};
    await _api_entry(_api_arguments)
      .then((result) => {
        _api_result.status = 0;
        _api_result.content = result;
      })
      .catch((error) => {
        _api_result.status = error.status;
        _api_result.message = error.notify;
      })

    _http_body = JSON.stringify(_api_result);
    _http_status = 200;
  }
  catch (e) {
    syslog.e(TAG, e.toString());
    syslog.e(TAG, e.stack);

    _http_body = 'request path notfound =(:3) z)_';
    _http_status = 404;
  }

  // send json result to client
  response.statusCode = _http_status;
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(_http_body);

  syslog.v(TAG, 'Send response back');
}
