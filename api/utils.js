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
    static MakeApiObject(status, template, message = '') {

        // this is part of http status code
        const _message_table = {
            '200': 'OK',
            '400': 'Bad Request',
            '401': 'Unauthorized',
            '403': 'Forbidden',
            '404': 'Not Found',
            '405': 'Method Not Allowed',
            '408': 'Request Timeout',
            '418': 'I\'m a teapot',
            '500': 'Internal Server Error',
            '501': 'Not Implemented',
            '502': 'Bad Gateway',
            '503': 'Service Unavailable',
            '504': 'Gateway Timeout'
        }

        let _object_body = {};

        // check status is valid
        if (typeof _message_table[status] != 'string') {
            status = 501;
            message = _message_table[_object_body.status];
        }
        _object_body.status = status;
        _object_body.message = (message == '' ? _message_table[status] : message);

        // if successful then return data entity
        if (status == 200)
            _object_body.contents = template;

        return _object_body;
    }


    // convert http arguments string to
    // javascript object like this
    // foo=1&bar=2  =>  {foo:"1", bar:"2"}
    static UrlArgumentToObject(http_arguments) {
        let _url_params = new URLSearchParams(http_arguments);
        return Object.fromEntries(_url_params);
    }


    // request an arc account from cloudflare KV
    static async RequestArcAccount() {
        let _account = null;

        // query database for account name
        const _account_list = await KVARCACCOUNT.list();
        if (_account_list.list_complete) {
            if (_account_list.keys.length) {

                // random account selecting
                const _account_index = parseInt(Math.random() * (_account_list.keys.length - 1));
                const _account_name = _account_list.keys[_account_index].name;

                // query database for account info
                const _account_data = await KVARCACCOUNT.get(_account_name);
                console.log(_account_data);
                _account = JSON.parse(_account_data);
            }
        }

        // return result, null when failing
        return _account;
    }
}