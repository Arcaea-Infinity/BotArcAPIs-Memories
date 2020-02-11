// filename : utils.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : some utility functions here

export default class {
    static MakeResponse(httpcode, message = '') {
        let _response_type = 'application/json; charset=utf-8';
        let _response_botapiver= `${BOTARCAPI_MAJOR}.${BOTARCAPI_MINOR}.${BOTARCAPI_VERSION}`;

        return new Response(message, {
            status: httpcode,
            headers: {
                'content-type': _response_type,
                'botarcapi-version': _response_botapiver
            }
        });
    }

}