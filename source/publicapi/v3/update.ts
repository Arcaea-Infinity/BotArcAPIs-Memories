const TAG: string = 'v3/update.ts\t';

import fetch from 'node-fetch';
import syslog from '../../modules/syslog/syslog';
import APIError from '../../modules/apierror/apierror';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {
    try {

      // request remote api
      await fetch("https://webapi.lowiro.com/webapi/serve/static/bin/arcaea/apk")
        .then((response) => response.text())
        .then((rawdata) => {
          try {
            return JSON.parse(rawdata);
          } catch (e) { throw new APIError(-1, 'service unavailable'); }
        })

        .then((root) => {

          if (root.success != true)
            throw new APIError(-2, "fetch latest release failed");

          resolve({
            "url": root.value.url,
            "version": root.value.version
          });

        })

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
  
}
