// filename : /v1/userinfo.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : api for user information

import Utils from 'Utils';
import ArcApiFriendAdd from './_arcapi_friend_add';
import ArcApiFriendDelete from './_arcapi_friend_delete';
import ArcApiAccountAlloc from './_arcapi_account_alloc';
import ArcApiAccountRelease from './_arcapi_account_release';

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

    // check for arguments
    if (typeof argument.usercode != 'undefined') {

        // request an arc account
        const _arc_account = await ArcApiAccountAlloc();
        if (_arc_account instanceof Object) {

            // add friend for query
            const _arc_friendlist = await ArcApiFriendAdd(_arc_account, argument.usercode);

            if (_arc_friendlist) {

                // delete friend
                ArcApiFriendDelete(_arc_account, argument.usercode);
                
                // release account
                ArcApiAccountRelease(_arc_account);

                // fill the data template
                _response_data_template.name = _arc_friendlist.friends[0].name;
                _response_data_template.rating = _arc_friendlist.friends[0].rating;
                _response_data_template.user_id = _arc_friendlist.friends[0].user_id;
                _response_data_template.join_date = _arc_friendlist.friends[0].join_date;
                _response_data_template.character = _arc_friendlist.friends[0].character;
                _response_data_template.is_skill_sealed = _arc_friendlist.friends[0].is_skill_sealed;
                _response_data_template.is_char_uncapped = _arc_friendlist.friends[0].is_char_uncapped;

            } else _response_status = 502;

        } else _response_status = 502;

    } else _response_status = 400;

    // return data
    return Utils.MakeApiObject(_response_status, _response_data_template);

};
