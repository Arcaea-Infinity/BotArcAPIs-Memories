declare type ArcFetchRestUrl = string;

declare enum ArcFetchMethod {
  'GET' = 'GET',
  'POST' = 'POST'
}

declare class ArcFetchRequest extends Request {
  constructor(method: ArcFetchMethod, resturl: ArcFetchRestUrl, init: ArcFetchExtra);
}

declare interface ArcFetchExtra {
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

declare interface ArcFetchHeaders { [key: string]: string; }
