// filename : __loader__.js
// author   : TheSnowfield
// date     : 02/09/2020
// comment  : loader handles api requests and map to require files
//            it's also a global access point

const TAG = 'source/__loader__.js';

const handler_request_notfound = async (response, message='') => {
  response.statusCode = 404;
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(message);
  syslog.v(TAG, 'Send response back');
}

const handler_request_favicon = async (response) => {

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
    return handler_request_notfound(request);
  }

  // send result to client
  response.statusCode = _http_status;
  response.setHeader('Content-Type', _http_content_type);
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(_http_body);
  syslog.v(TAG, 'Send response back');
}

const handler_request_publicapi = async (response, path, header, argument, databody) => {

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
    return handler_request_notfound('request path notfound =(:3) z)_');
  }

  // send result to client
  response.statusCode = _http_status;
  response.setHeader('Content-Type', _http_content_type);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
  response.end(_http_body);

  syslog.v(TAG, 'Send response back');
}

const routine = async (request, response) => {

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_headers = request.headers;
  const _api_arguments = Object.fromEntries(_api_url.searchParams);
  syslog.i(TAG, `Accept ${request.method} request at => ${_api_path} ${JSON.stringify(_api_arguments)}`);

  let _rawdata = '';
  request.on('data', (data) => { _rawdata += data; });
  request.on('end', () => {
    if (request.method == 'GET') {
      // handle favicon request
      if (_api_path == '/favicon.ico')
        return handler_request_favicon(response);
    }

    // receive the body data for post requests
    let _api_bodydata = null;
    try { _api_bodydata = JSON.parse(_rawdata); }
    catch (e) { syslog.e(e.stack); return handler_request_notfound(request); }

    // handle general api request
    return handler_request_publicapi(
      response, _api_path, _api_headers, _api_arguments,
      request.method == 'POST' ? _api_bodydata : null,
    );

  });
}

module.exports = routine;