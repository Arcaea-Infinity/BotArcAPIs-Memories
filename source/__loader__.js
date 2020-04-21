// filename : __loader__.js
// author   : TheSnowfield
// date     : 02/09/2020
// comment  : loader handles api requests and map to require files
//            it's also a global access point

const TAG = 'source/__loader__.js';


const handleMain = async (request, response) => {

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_arguments = Object.fromEntries(_api_url.searchParams);
  syslog.i(TAG, `Accept request at => ${_api_path} ${JSON.stringify(_api_arguments)}`);

  // handle favicon request
  if (_api_path == '/favicon.ico')
    return handleIconRequest(response);

  // handle general api request
  return handleApiRequest(_api_path, _api_arguments, response);
}

const handleIconRequest = async (response) => {

  let _http_body = null;
  let _http_status = null;
  let _http_content_type = null;

  const file = require('fs');
  try {
    await file.promises.readFile('./image/favicon.ico')
      .then((data) => {
        _http_status = 200;
        _http_body = data;
        _http_content_type = 'image/x-icon';
      });
  } catch (e) {
    syslog.e(e.stack);
    _http_status = 404;
    _http_body = '';
    _http_content_type = '';
  }

  // send result to client
  response.statusCode = _http_status;
  response.setHeader('Content-Type', _http_content_type);
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(_http_body);
  syslog.v(TAG, 'Send response back');
}

const handleApiRequest = async (path, argument, response) => {

  let _http_body = null;
  let _http_status = null;
  let _http_content_type = null;

  try {
    // try invoke method
    const _api_entry = require(`./publicapi/${path}`);
    const _api_result = {};
    await _api_entry(argument)
      .then((result) => {
        _api_result.status = 0;
        _api_result.content = result;
      })
      .catch((error) => {
        _api_result.status = error.status;
        _api_result.message = error.notify;
      })

    _http_status = 200;
    _http_body = JSON.stringify(_api_result);
    _http_content_type = 'application/json; charset=utf-8';

  }
  catch (e) {
    syslog.e(TAG, e.stack);

    _http_status = 404;
    _http_body = 'request path notfound =(:3) z)_';
    _http_content_type = 'text/html; charset=utf-8';
  }

  // send result to client
  response.statusCode = _http_status;
  response.setHeader('Content-Type', _http_content_type);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
  response.end(_http_body);

  syslog.v(TAG, 'Send response back');
}

module.exports = handleMain;