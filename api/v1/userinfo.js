// filename : /v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : api for user information

import Utils from 'Utils';

export default async function (argument) {

    // initialize response data
    let _response_status = 200;
    let _response_data_template = {
        'name': null,
        'rating': null,
        'user_id': null,
        'join_date': null,
        'character': null,
        'is_skill_sealed': null,
        'is_char_uncapped': null
    };

    // request origin arcapi
    const _arc_account = await Utils.RequestArcAccount();
    if (_arc_account instanceof Object) {
        const _remote_request =
            new Request(`https://arcapi.lowiro.com/${BOTARCAPI_ARCAPI_VERSION}/user/me`, {
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'identity',
                    'DeviceId': _arc_account.deviceid,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': `Bearer ${_arc_account.token}`,
                    'AppVersion': BOTARCAPI_ARCAPI_APPVERSION,
                    'User-Agent': BOTARCAPI_ARCAPI_USERAGENT,
                    'Host': 'arcapi.lowiro.com',
                    'Connection': 'Keep-Alive'
                }
            });
        const _remote_response_data = await fetch(_remote_request);
        const _json_root = await _remote_response_data.json();

        // fill the data template
        if (_json_root instanceof Object) {
            console.log(_json_root);
            if (_json_root.success) {
                _response_data_template.name = _json_root.value.friends[0].name;
                _response_data_template.rating = _json_root.value.friends[0].rating;
                _response_data_template.user_id = _json_root.value.friends[0].user_id;
                _response_data_template.join_date = _json_root.value.friends[0].join_date;
                _response_data_template.character = _json_root.value.friends[0].character;
                _response_data_template.is_skill_sealed = _json_root.value.friends[0].is_skill_sealed;
                _response_data_template.is_char_uncapped = _json_root.value.friends[0].is_char_uncapped;

            } else _response_status = 503;

        } else _response_status = 502;

    } else _response_status = 502;

    // make response
    return Utils.MakeApiObject(_response_status, _response_data_template);
};