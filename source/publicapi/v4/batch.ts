const TAG: string = 'v4/batch.ts\t';

import syslog from '../../modules/syslog/syslog';
import Utils from '../../corefunc/utils';
import APIError from '../../modules/apierror/apierror';
import safeEval from 'safe-eval';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    // /batch?calls=
    // [
    //    {
    //      id: 0,
    //      bind: {"$sid": "recent_score[0].song_id"}
    //      endpoint: "user/info?usercode=000000001"
    //    },
    //    {
    //      id: 1,
    //      endpoint: "user/song/info?songname=$sid"
    //    },
    //    {
    //      id: 2,
    //      endpoint: "user/song/alias?songid=$sid"
    //    }
    // ]

    try {

      // validate request arguments
      if (typeof argument.calls == 'undefined' || argument.calls == '')
        throw new APIError(-1, 'invalid endpoints');

      // try parse endpoints
      let _endpoints: any = {};
      let _return: any = [];
      let _vm_vartable: any = {};
      let _vm_reftable: any = {};
      let _vm_resultbox: any = {};

      try {
        _endpoints = JSON.parse(argument.calls);
      } catch (e) { syslog.e(e.stack); throw new APIError(-2, 'invalid endpoints'); }

      // check if endpoints is an array
      if (!(_endpoints instanceof Array))
        throw new APIError(-3, 'invalid endpoints');

      // check limitation
      if (_endpoints.length > BOTARCAPI_BATCH_MAX_ENDPOINTS)
        throw new APIError(-4, 'too many endpoints requested');

      // collect bind variables
      _endpoints.forEach((element) => {

        if (!element.bind)
          return;

        // check statement
        if (!Utils.checkBindStatement(element.bind))
          throw new APIError(-5, 'invalid bind variables');

        // initialize variables
        Object.keys(element.bind).forEach(varname => {

          // check variables
          if (!varname.startsWith('$'))
            throw new APIError(-6, 'bind variables must start with character $');

          _vm_vartable = { ..._vm_vartable, ...element.bind };
          _vm_reftable = { ..._vm_reftable, ...{ [varname]: `result${element.id}` } };

        });
      });

      // execute the batch operations
      for (let i = 0; i < _endpoints.length; ++i) {

        let _endret: any = {};


        // apply the variable for this endpoint
        const regexp = /=(\$\S*?)&/g;
        let donext = false;
        let result: any = {};

        do {
          result = regexp.exec(_endpoints[i].endpoint + '&');
          donext = !(!result);

          if (donext) {

            if (result.length != 2)
              continue;

            const varname = result[1];
            const varexpr = _vm_vartable[varname];

            // eval the value
            const val = safeEval(varexpr, _vm_resultbox[_vm_reftable[varname]]);

            // replace the variable
            _endpoints[i].endpoint = _endpoints[i].endpoint.replace(varname, val);
          }

        } while (donext)

        // teardown params
        const _url = new URL(`http://example.com/${_endpoints[i].endpoint}`);
        const _path = _url.pathname;
        const _arguments = Utils.httpGetAllParams(_url.searchParams);

        // load api endpoint
        let _entry = await import(`./${_path}`);
        _entry = _entry.default;

        // invoke method
        await _entry(_arguments)
          .then((result: any) => {
            _endret.status = 0;
            _endret.content = result;

            // apply this result box
            _vm_resultbox[`result${_endpoints[i].id}`] = _endret.content;
          })
          .catch((error: APIError) => {
            _endret.status = error.status;
            _endret.message = error.notify;
          });

        // build results
        _return.push({
          id: _endpoints[i].id,
          result: _endret
        });
      }

      resolve(_return);

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });
};
