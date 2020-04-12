// filename : corefunc/arcfetch.js
// author   : CirnoBakaBOT
// date     : 04/12/2020
// comment  : all arcapi requests will goes to here
'use strict'

const btoa = require('btoa');
const fetch = require('node-fetch');
const Request = fetch.Request;
const arcapi_errcode = require('../arcapi/_arcapi_errcode');

class ArcAPIRequest extends Request {
  constructor(method, resturl, init) {
    if (method != 'GET' && method != 'POST')
      throw new TypeError('request method only be GET and POST');
    if (!resturl)
      throw new TypeError('resturl cannot be null');
    if (!init)
      throw new TypeError('init cannot be null');

    // standard http headers
    let _request_headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'AppVersion': ARCAPI_APPVERSION,
      'User-Agent': ARCAPI_USERAGENT,
      'Host': 'arcapi.lowiro.com',
      'Connection': 'Keep-Alive'
    }

    // extra identity header
    if (init.usertoken) {
      _request_headers['Accept-Encoding'] = 'identity';
      _request_headers['Authorization'] = `Basic ${init.usertoken}`;
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
    let _request_body =
      (method === 'POST') ? init.body : null;

    super(resturl, {
      method: method,
      headers: _request_headers,
      body: _request_body
    });
  }
}

/**
 * fetch wrapper for arcapis
 * @param {ArcAPIRequest} request
 */
function arcfetch(request) {
  return new Promise((resolve, reject) => {

    // request origin arcapi
    fetch(request)
      .then((response) => {
        return response.text();
      })

      // try parse json
      // print rawdata when failing
      .then((rawdata) => {
        try {
          return JSON.parse(rawdata);
        } catch (e) {
          return reject(new Error(`Arcapi currently unavailable. \n${rawdata}`));
        }
      })

      // this is a json
      .then((root) => {
        if (root.success)
          return resolve(root);
        else
          return reject(new Error(`Response from arcapi => ${arcapi_errcode(root.error_code)}`));
      })

      // any errors
      .catch((e) => {
        return reject(e);
      });
  });
}

// exports
module.exports = exports = arcfetch;
exports.default = exports;
exports.ArcAPIRequest = ArcAPIRequest;
