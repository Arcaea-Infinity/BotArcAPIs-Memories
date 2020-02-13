// filename : /v1/test.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : test api

import Utils from 'Utils';

export default async function (argument) {

    // initialize response data
    let _response_status = 418;
    let _response_data_template = {
        'hi': null,
        'i_am_a_teapot': null
    };

    // fill the template
    _response_data_template.hi = '(｡･∀･)ﾉﾞ嗨';
    _response_data_template.i_am_a_teapot = 'I\'m a teapot';

    // make response
    return Utils.MakeApiObject(_response_status, _response_data_template);
};
