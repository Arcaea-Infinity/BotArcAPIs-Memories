// filename : /v1/_arcapi_userme.js
// author   : CirnoBakaBOT
// date     : 02/13/2020

export default async function (arc_account) {

  const TAG = '_arcapi_userme.js';

  const _return_template = {
    success: false,
    arc_account_info: null
  };

  // request origin arcapi
  const _remote_request =
    new Request(`https://arcapi.lowiro.com/${BOTARCAPI_ARCAPI_VERSION}/user/me`, {
      method: 'GET',
      headers: {
        'Accept-Encoding': 'identity',
        'DeviceId': arc_account.device_id,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': `Bearer ${arc_account.token}`,
        'AppVersion': BOTARCAPI_ARCAPI_APPVERSION,
        'User-Agent': BOTARCAPI_ARCAPI_USERAGENT,
        'Host': 'arcapi.lowiro.com',
        'Connection': 'Keep-Alive'
      }
    });
  const _remote_response_data = await fetch(_remote_request);

  // check for origin arcapi data
  try {
    const _json_root = await _remote_response_data.json();
    console.log(TAG, _json_root);
    
    if (_json_root.success) {
      _return_template.success = true;
      _return_template.arc_account_info = _json_root.value;
    }
  } catch (e) { console.log(TAG, e); }

  return _return_template;
}

