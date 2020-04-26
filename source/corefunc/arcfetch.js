// filename : corefunc/arcfetch.js
// author   : TheSnowfield
// date     : 04/12/2020
// comment  : all arcapi requests will goes here
'use strict'

const TAG = 'corefunc/arcfetch.js';

const btoa = require('abab').btoa;
const fetch = require('node-fetch');
const Request = fetch.Request;

class ArcAPIRequest extends Request {
  constructor(method, resturl, init) {
    if (method != 'GET' && method != 'POST')
      throw new TypeError('request method only be GET and POST');
    if (!resturl)
      throw new TypeError('resturl cannot be null');
    if (!init)
      throw new TypeError('init cannot be null');

    // request url
    const _request_url = `https://arcapi.lowiro.com/${ARCAPI_VERSION}/${resturl}`;

    // standard http headers
    const _request_headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'AppVersion': ARCAPI_APPVERSION,
      'User-Agent': ARCAPI_USERAGENT,
      'Host': 'arcapi.lowiro.com',
      'Connection': 'Keep-Alive'
    }

    // extra identity header
    if (init.usertoken) {
      _request_headers['Accept-Encoding'] = 'identity';
      _request_headers['Authorization'] = `Bearer ${init.usertoken}`;
    }
    else if (init.username && init.userpwd) {
      _request_headers['Accept-Encoding'] = 'identity';
      _request_headers['Authorization'] = `Basic ${btoa(`${init.username}:${init.userpwd}`)}`;
    }

    // extra device header
    if (init.deviceid) {
      _request_headers['DeviceId'] = init.deviceid;
    }

    // for POST forms
    if (init.postdata && method == 'GET')
      throw new TypeError('GET method not supported post data');
    const _request_body = init.postdata;

    super(_request_url, {
      method: method,
      headers: _request_headers,
      body: _request_body
    });
  }
}

function do_fetch(request) {
  return new Promise(async (resolve, reject) => {

    // request origin arcapi
    return await fetch(request)
      .then((response) => {
        return response.text();
      })

      // try parse json
      // print rawdata when failing
      .then((rawdata) => {
        try {
          return JSON.parse(rawdata);
        } catch (e) {
          syslog.e(TAG, 'Arcapi currently unavailable');
          syslog.e(TAG, rawdata);

          // The Arcaea network is currently under maintenance.
          return reject(9);
        }
      })

      // ensure it's a json
      .then((root) => {
        if (root.success)
          return resolve(root);
        else {
          const _errcode =
            root.error_code != undefined ? root.error_code : root.code;

          syslog.e(TAG, `Arcapi returns an error => ${_errcode}`);
          syslog.e(TAG, JSON.stringify(root));
          return reject(_errcode);
        }
      })

      // any errors
      .catch((e) => {
        return reject(e);
      });
  });
}

/**
 * fetch wrapper for arcapis
 * @param {ArcAPIRequest} request
 */
const arcfetch = async (request) => {
  syslog.v(TAG, `Arcfetch => ${request.url}`);

  let _retry = 0;
  while (true) {

    try {
      return await do_fetch(request);
    }
    catch (e) {
      _retry += 1;
      syslog.w(TAG, `Failed... retrying ${_retry}/${ARCAPI_RETRY}`);

      if (e instanceof Error)
        syslog.e(TAG, e.stack);

      // do not retry when some error occurred
      // like has been banned or service not available or etc.
      // only do retry when like request timed out or etc.
      else if (typeof e == 'number' || e == 'UnauthorizedError') {
        _retry = ARCAPI_RETRY;
        syslog.w(TAG, `Retry canceled => errcode ${e}`);
      }

      if (_retry >= ARCAPI_RETRY) throw e;
    }
  }
}

// exports
module.exports = exports = arcfetch;
exports.default = exports;
exports.ArcAPIRequest = ArcAPIRequest;
