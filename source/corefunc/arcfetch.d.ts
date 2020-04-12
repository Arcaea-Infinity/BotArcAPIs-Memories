// filename : /corefunc/arcfetch.d.ts
// author   : CirnoBakaBOT
// date     : 04/12/2020
'use strict'

import btoa from 'btoa';
import fetch from 'node-fetch';
import arcapi_errcode from '../arcapi/_arcapi_errcode';

export type ArcRestUrl = string;
export type ArcAPIMethod = 'GET' | 'POST';
export type RequestInfo = ArcAPIRequest;

export class ArcAPIRequest extends Request {
  constructor(method: ArcAPIMethod, resturl: ArcRestUrl, init: ArcAPIExtra);
}

export interface ArcAPIExtra {
  // will send authorization headers
  username?: string,
  userpwd?: string,
  usertoken?: string,

  // will send deviceid
  deviceid?: string,

  // POST only
  body?: BodyInit
}

declare function arcfetch(request: ArcAPIRequest): Promise<string>;

export default arcfetch;
export class { ArcAPIRequest };