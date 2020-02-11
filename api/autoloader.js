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
    // process url and check argument
    let _regexp_result = await request.url.match(/https:\/\/.*?\/(.*)\/(.*)/);
    if (_regexp_result == null) return Utils.MakeResponse(404)
    if (_regexp_result.length != 3) return Utils.MakeResponse(404);
    if (_regexp_result[1] != 'v' + `${BOTARCAPI_MAJOR}`) return Utils.MakeResponse(404);

    let _api_method = _regexp_result[2];

    // instantiate api and check argument
    let _api = await new BotArcAPI();
    if (typeof _api[_api_method] != 'function') return Utils.MakeResponse(404);

    // invoke method
    let _api_result = _api[_api_method]();

    return Utils.MakeResponse(200, _api_result);
}
