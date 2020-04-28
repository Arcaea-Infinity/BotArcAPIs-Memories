// filename : __loader__.js
// author   : TheSnowfield
// date     : 02/09/2020
// comment  : loader handles api requests and map to require files
//            it's also a global access point

const TAG = 'source/__loader__.js';

const Utils = require('./corefunc/utils');

const handler_request_notfound = async (response, message = '') => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
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
    return handler_request_notfound(response);
  }

  // send result to client
  response.statusCode = _http_status;
  response.setHeader('Content-Type', _http_content_type);
  response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
  response.end(_http_body);
  syslog.v(TAG, 'Send response back');
}


const specific_routine = {
  '/v1/arc/forward': /^\/v1\/arc\/forward\//
};
const handler_request_publicapi =
  async (response, argument, method, path, header, databody) => {

    let _http_body = null;
    let _http_status = null;
    let _http_content_type = null;

    try {

      let _api_entry = null;

      // try match the specific routine
      for (const v in specific_routine) {
        if (new RegExp(specific_routine[v]).test(path)) {
          _api_entry = require(`./publicapi/${v}`);
          path = path.replace(specific_routine[v], '');
          break;
        }
      }

      // require directly if no match
      if (!_api_entry)
        _api_entry = require(`./publicapi/${path}`);

      // try invoke method
      const _api_result = {};
      await _api_entry(argument, method, path, header, databody)
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
      return handler_request_notfound(response, 'request path notfound =(:3) z)_');
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

  // user-agent and client-agent
  let _client_sign = request.headers['client-agent'];
  if (!_client_sign) _client_sign = request.headers['user-agent'];

  // match useragent
  if (!Utils.httpMatchUserAgent(_client_sign)) {
    syslog.w(TAG, `Invalid user agent => ${_client_sign}`);
    return handler_request_notfound(response);
  }

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_headers = request.headers;
  const _api_arguments = Object.fromEntries(_api_url.searchParams);
  syslog.i(TAG,
    `Accept ${_client_sign} ` +
    `request => ${request.method} ` +
    `${_api_path} ${JSON.stringify(_api_arguments)}`
  );

  let _rawdata = '';
  request.on('data', (data) => { _rawdata += data; });
  request.on('end', () => {

    // handle favicon request
    if (request.method == 'GET') {
      // handle favicon request
      if (_api_path == '/favicon.ico')
        return handler_request_favicon(response);
    }

    // receive the body data for post requests
    let _api_bodydata = null;
    if (request.method == 'POST')
      _api_bodydata = _rawdata;

    // handle public api request
    return handler_request_publicapi(
      response, _api_arguments, request.method, _api_path,
      _api_headers, _api_bodydata
    );

  });
}

module.exports = routine;
