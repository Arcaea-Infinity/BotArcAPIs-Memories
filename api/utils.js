// filename : utils.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : some utility functions here

export default class {

    // make http response
    // default content-type is application/json;
    static MakeHttpResponse(http_code, message = '') {
        return new Response(message, {
            status: http_code,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'botarcapi-version': `${BOTARCAPI_MAJOR}.${BOTARCAPI_MINOR}.${BOTARCAPI_VERSION}`
            }
        });
    }

    // make http request
    static MakeHttpRequest(http_method, http_url, http_headers = {}) {
        return new Request(http_url, {
            method: http_method,
            headers: http_headers
        });
    }

    // construct the json from api results
    static MakeApiObject(code, message, template) {
        let _object = {};

        // default response format
        _object.code = code;
        _object.message = message;

        // if successful then return data entity
        if (code === 200)
            _object.contents = template;

        return _object;
    }

    // convert http arguments string to
    // javascript object like this
    // foo=1&bar=2  =>  {foo:"1", bar:"2"}
    static UrlArgumentToObject(http_arguments) {
        let _url_params = new URLSearchParams(http_arguments);
        return Object.fromEntries(_url_params);
    }

}