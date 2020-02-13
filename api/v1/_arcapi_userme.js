// filename : _arcapi_userme.js
// author   : CirnoBakaBOT
// date     : 02/13/2020

export default async function (arc_account) {

    // request origin arcapi
    const _remote_request =
        new Request(`https://arcapi.lowiro.com/${BOTARCAPI_ARCAPI_VERSION}/user/me`, {
            method: 'POST',
            headers: {
                'Accept-Encoding': 'identity',
                'DeviceId': arc_account.deviceid,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': `Bearer ${arc_account.token}`,
                'AppVersion': BOTARCAPI_ARCAPI_APPVERSION,
                'User-Agent': BOTARCAPI_ARCAPI_USERAGENT,
                'Host': 'arcapi.lowiro.com',
                'Connection': 'Keep-Alive'
            }
        });
    const _remote_response_data = await fetch(_remote_request);
    const _json_root = await _remote_response_data.json();

    // check for origin arcapi data
    if (!_json_root instanceof Object)
        return null;
    if (!_json_root.success)
        return null;

    return _json_root.value;
}

