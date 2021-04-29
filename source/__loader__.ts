// filename : __loader__.js
// author   : TheSnowfield
// date     : 02/09/2020
// comment  : loader handles api requests and map to require files
//            it's also a global access point

const TAG: string = 'source/__loader__.ts';

import Utils from './corefunc/utils';
import APIError from './modules/apierror/apierror';
import syslog from './modules/syslog/syslog';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';

const handler_request_notfound = async (response: ServerResponse, message = '') => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Server', `${BOTARCAPI_VERSTR}`);
  response.end(message);
  syslog.v(TAG, 'Send response back');
}

const handler_request_favicon = async (response: ServerResponse) => {

  let _http_body: string = '';
  let _http_status: number = 0;
  let _http_content_type: string = '';

  const file = require('fs');
  try {
    await file.promises.readFile('./image/favicon.ico')
      .then((data: any) => {
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

const forward_route: { [key: string]: RegExp } = {
  '/v1/arc/forward': /^\/v1\/arc\/forward\//,
  '/v2/arc/forward': /^\/v2\/arc\/forward\//,
  '/v3/arc/forward': /^\/v3\/arc\/forward\//,
  '/v4/forward/forward': /^\/v4\/forward\/forward\//
};

const handler_request_publicapi =
  async (response: ServerResponse, argument: string,
    method: string, path: string, header: IncomingHttpHeaders, databody: string | null) => {

    let _http_body: string = '';
    let _http_status: number = 0;
    let _http_content_type: string = '';

    try {

      let _api_entry: any;

      // try match the forward route
      for (const v in forward_route) {
        if (new RegExp(forward_route[v]).test(path)) {

          path = path.replace(forward_route[v], '');
          _api_entry = await import(`./publicapi/${v}`);

          break;
        }
      }

      // require directly if no match
      if (!_api_entry)
        _api_entry = await import(`./publicapi/${path}`);

      // try invoke method
      const _api_result: any = {};

      _api_entry = _api_entry.default;
      await _api_entry(argument, method, path, header, databody)
        .then((result: any) => {
          _api_result.status = 0;
          _api_result.content = result;
        })
        .catch((error: APIError) => {
          _api_result.status = error.status;
          _api_result.message = error.notify;
        });

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

const handler = async (request: IncomingMessage, response: ServerResponse) => {

  // user-agent and client-agent
  const _sign_agent: string =
    <string | undefined>request.headers['client-agent'] ??
    <string | undefined>request.headers['user-agent'] ?? '';

  // match useragent
  if (!Utils.httpMatchUserAgent(_sign_agent)) {
    syslog.w(TAG, `Invalid user agent => ${_sign_agent}`);
    return handler_request_notfound(response);
  }

  // process request url
  const _api_url = new URL(`http://0.0.0.0${request.url}`);
  const _api_path = _api_url.pathname;
  const _api_headers = request.headers;
  const _api_arguments = Utils.httpGetAllParams(_api_url.searchParams);
  syslog.i(TAG,
    `Accept ${_sign_agent} ` +
    `request => ${request.method} ` +
    `${_api_path} ${JSON.stringify(_api_arguments)}`
  );

  let _rawdata = '';
  request.on('data', (data) => { _rawdata += data; });
  request.on('end', () => {

    // handle favicon request
    if (request.method == 'GET') {
      if (_api_path == '/favicon.ico')
        return handler_request_favicon(response);
    }

    // receive the body data for post requests
    let _api_bodydata: string | null = null;
    if (request.method == 'POST')
      _api_bodydata = _rawdata;

    // handle public api request
    return handler_request_publicapi(
      response, _api_arguments, request.method ?? '', _api_path,
      _api_headers, _api_bodydata
    );

  });

}

export default handler;
