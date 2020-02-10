// filename : autoloader.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : autoloader can handle api request and map to class methods,
//            make api maintaining easily it's also global access entry

import BotArcAPI from 'BotArcAPI';

// fetch listener
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

// handle request
async function handleRequest(request) {
    let api = await new BotArcAPI();
    return new Response(api.test(), { status: 200 })
}
