// filename : autoloader.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : autoloader can handle api request and map to class methods,
//            make api maintaining easily it's also global access entry

import Utils from 'Utils';
import BotArcAPI from 'BotArcAPI';

// fetch listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// handle request
async function handleRequest(request) {

  // process request url, example below:
  // https://example.com/v(_api_version)/(_api_method)[?(_api_arguments)]
  const _regexp_result = request.url.match(/https:\/\/.*?\/v(\d)\/(.*)/);
  if (!_regexp_result)
    return Utils.MakeHttpResponse(404);

  // split method and arguments
  const _split_result = _regexp_result[2].split('?');

  // prepare data
  const _api = new BotArcAPI();
  const _api_version = _regexp_result[1];
  const _api_method = _split_result[0];
  const _api_arguments = Utils.UrlArgumentToObject(_split_result[1]);
  console.log(_api_arguments);

  // check for api version
  if (_api_version != BOTARCAPI_MAJOR)
    return Utils.MakeHttpResponse(404);

  // try invoke method
  try {
    const _api_result = await _api[_api_method](_api_arguments);
    return Utils.MakeHttpResponse(200, JSON.stringify(_api_result));

  } catch (e) { return Utils.MakeHttpResponse(404); }

}
