// filename : /v1/_debug_clear_all_friends.js
// author   : TheSnowfield
// date     : 02/14/2020
// comment  : delete all friends (debug only)

import Utils from 'Utils';
import ArcApiUserMe from './_arcapi_userme';
import ArcApiFriendClear from './_arcapi_friend_clear';

export default async function (argument) {

    // initialize response data
    let _return = null;
    let _response_status = 200;
    const _response_data_template = {
        'clear_count': null,
        'friend_list': null
    };

    const _arc_account_names = await KVARCACCOUNT.list();
    if (_arc_account_names.list_complete) {

        // enum account names
        _arc_account_names.keys.forEach(async key => {

            // get account by username from KV database
            const _arc_account_data = await KVARCACCOUNT.get(key);
            const _arc_account = JSON.parse(_arc_account_data);

            let _arc_account_info = null;

            // query origin arcapi
            _return = await ArcApiUserMe(_arc_account);
            if (_return.success) {
                _arc_account_info = _return.arc_account_info;

                console.log(_arc_account, _arc_account_info);

                // fill the template
                _response_data_template.clear_count = _arc_account_info.friends.length;
                _response_data_template.friend_list = _arc_account_info.friends;

                // clear friend
                await ArcApiFriendClear(_arc_account, _arc_account_info.friends);

            } else _response_status = 502;
        });
    }

    // return data
    return Utils.MakeApiObject(_response_status, _response_data_template);
}