// filename : __loader__.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : autoloader can handle api request and map to class methods,
//            make api maintaining easily it's also global access entry

// this is a hack to load config macros
// and persistent sqlite link in global space
require('./config');
require('./database/init');
const Http = require('http');

const TAG = '__loader__.js';

// handle http request
async function handleRequest(request, response) {

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
  console.log(TAG, _api_path, _api_arguments);

  // try invoke method
  try {
    const _api_entry = require(`./publicapi/${_api_path}`);
    const _api_result = await _api_entry(_api_arguments);

    // fill result
    _response_template.status = _api_result.status;
    _response_template.content = _api_result.content;

  } catch (e) { console.log(e); _response_status = 404; }

  // make response body
  let _http_body = null;

  if (_response_status == 404) {
    _http_body = 'request path notfound =(:3) z)_';
  }
  else {

    // if any errors occurred
    // should delete content field
    if (_response_template.status < 0)
      delete _response_template.content;
    else
      delete _response_template.message;

    _http_body = JSON.stringify(_response_template);
  }

  // send json result to client
  response.statusCode = _response_status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Server', `BotArcAPI ${BOTARCAPI_VERSTR}`);
  response.end(_http_body);
}

// create a simple http server
const server = Http.createServer(handleRequest);
server.listen(SERVER_PORT);
