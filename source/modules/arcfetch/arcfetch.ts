const TAG: string = 'corefunc/arcfetch.ts';

import { btoa } from 'abab';
import syslog from '../syslog/syslog';
import fetch, { Request } from 'node-fetch';
import { archash } from 'archash4all';

export interface ArcFetchHeaders { [key: string]: string; }

export type ArcFetchRestUrl = string;

export enum ArcFetchMethod {
  'GET' = 'GET',
  'POST' = 'POST'
}

export interface ArcFetchExtra {
  // will send authorization headers
  userName?: string,
  userPasswd?: string,
  userToken?: string,

  // will send deviceid headers
  deviceId?: string,

  // GET method will convert URLSearchParams
  // and append after the request url
  submitData?: BodyInit | URLSearchParams
}

export class ArcFetchRequest extends Request {

  constructor(method: ArcFetchMethod, resturl: ArcFetchRestUrl, init: ArcFetchExtra) {

    // request url
    let _request_url: ArcFetchRestUrl =
      `${do_selectnode()}/${ARCAPI_URL_CODENAME}/${ARCAPI_VERSION}/${resturl}`;

    // http headers
    const _request_headers: ArcFetchHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'AppVersion': ARCAPI_APPVERSION,
      'User-Agent': ARCAPI_USERAGENT,
      'Platform': 'android',
      'Host': 'arcapi.lowiro.com',
      'Connection': 'Keep-Alive'
    }

    // extra identity header
    if (init.userToken) {
      _request_headers['Accept-Encoding'] = 'identity';
      _request_headers['Authorization'] = `Bearer ${init.userToken}`;
    }
    else if (init.userName && init.userPasswd) {
      _request_headers['Accept-Encoding'] = 'identity';
      _request_headers['Authorization'] = `Basic ${btoa(`${init.userName}:${init.userPasswd}`)}`;
    }

    // extra device header
    if (init.deviceId) {
      _request_headers['DeviceId'] = init.deviceId;
    }

    // challenge code
    let _hash_body = "";
    if (method == 'POST' && init.submitData) {
      _hash_body = init.submitData.toString();
    }

    _request_headers['X-Random-Challenge'] = archash(_hash_body);

    // append init.submitData after url if method is GET
    // otherwise it's post data
    let _request_body: any = null;
    if (init.submitData) {
      if (method == 'GET' && init.submitData instanceof URLSearchParams) {
        _request_url += '?' + init.submitData;
      }
      else if (method == 'POST') {
        _request_body = init.submitData;
      }
    }

    super(_request_url, {
      method: method,
      headers: _request_headers,
      body: _request_body
    });

  }

}

const do_selectnode = (): string => {

  if (!BOTARCAPI_FRONTPROXY_NODES.length
    || BOTARCAPI_FRONTPROXY_NODES.length == 0) {
    return ARCAPI_URL;
  }

  let _enabled = [];
  let _weight_sum = 0;

  // filter the nodes
  for (let i = 0; i < BOTARCAPI_FRONTPROXY_NODES.length; ++i) {
    if (BOTARCAPI_FRONTPROXY_NODES[i].enabled) {
      _enabled.push(BOTARCAPI_FRONTPROXY_NODES[i]);
      _weight_sum += BOTARCAPI_FRONTPROXY_NODES[i].weight;
    }
  }

  // roll a number select node by weight
  let roll = Math.random() * _weight_sum;
  _weight_sum = 0;

  // select a node
  for (let i = 0; i < _enabled.length; ++i) {
    _weight_sum += _enabled[i].weight;
    if (_weight_sum >= roll) return _enabled[i].url;
  }

  return _enabled[_enabled.length - 1].url;
}

const do_fetch = (request: ArcFetchRequest): Promise<any> => {

  // request origin arcapi
  return fetch(request)
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
        return Promise.reject(9);
      }
    })

    // ensure it's a json
    .then((root) => {
      if (root.success)
        return root;
      else {

        const _errcode =
          root.error_code != undefined ? root.error_code : root.code;

        syslog.e(TAG, `Arcapi returns an error => ${_errcode}`);
        syslog.e(TAG, JSON.stringify(root));

        return Promise.reject(_errcode);
      }
    });

}

/**
 * fetch wrapper for arcapis
 * @param {ArcFetchRequest} request
 */
const arcfetch = async (request: ArcFetchRequest): Promise<any> => {

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

export default arcfetch;
