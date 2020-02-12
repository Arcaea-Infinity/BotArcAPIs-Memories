// filename : /v1/test.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : test api

import Utils from 'Utils';

export default async function (argument) {

    // initialize response data
    let _response_status = 200;
    let _response_data_template = {
        'test': null
    };

    // fill the template
    _response_data_template.test = '(｡･∀･)ﾉﾞ嗨';

    // make response
    return Utils.MakeApiObject(_response_status, _response_data_template);
};

