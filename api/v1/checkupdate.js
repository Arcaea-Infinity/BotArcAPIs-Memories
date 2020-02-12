// filename : /v1/checkupdate.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : checkupdate

import Utils from 'Utils';

export default async function (argument) {

    // initialize response data
    let _response_code = 200;
    let _response_data_template = {
        'version': null,
        'download_link': null
    };

    // build http request
    const _remote_request_object =
        new Request('https://www.fantasyroom.cn/api/v1/arcver.php', {
            method: 'GET',
            headers: {
                'User-Agent': 'BotArcAPI'
            }
        });
    const _remote_response_data = await fetch(_remote_request_object);
    const _json_root = await _remote_response_data.json();

    // fill the data template
    if (_json_root instanceof Object) {
        if (_json_root.res == 'success') {
            _response_data_template.version = _json_root.contents.android.version;
            _response_data_template.download_link = _json_root.contents.android.apk_dl_link;

        } else _response_code = 503;

    } else _response_code = 502;

    // make response
    return Utils.MakeApiObject(_response_code, _response_data_template);
};

