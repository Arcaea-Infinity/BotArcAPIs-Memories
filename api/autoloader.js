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
    let _regexp_result = request.url.match(/https:\/\/.*?\/v(\d)\/(.*)/);
    if (!_regexp_result)
        return Utils.MakeHttpResponse(404);

    // split method and arguments
    let _split_result = _regexp_result[2].split('?');

    // prepare data
    let _api = new BotArcAPI();
    let _api_version = _regexp_result[1];
    let _api_method = _split_result[0];
    let _api_arguments = Utils.UrlArgumentToObject(_split_result[1]);
    console.log(_api_arguments);

    // check for api version
    if (_api_version != `${BOTARCAPI_MAJOR}`)
        return Utils.MakeHttpResponse(404);

    // check for request method
    if (!(_api[_api_method] instanceof Function))
        return Utils.MakeHttpResponse(404);

    // invoke method
    let _api_result = await _api[_api_method](_api_arguments);

    return Utils.MakeHttpResponse(200, JSON.stringify(_api_result));
}
