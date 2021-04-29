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
      if (_endpoints.length > BOTARCAPI_BATCH_ENDPOINTS_MAX)
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

        try {
          _endret = await do_single_operation
            (_endpoints[i], _vm_vartable, _vm_reftable, _vm_resultbox);
        } catch (e) {
          if (e instanceof APIError)
            _endret = { status: e.status, message: e.notify }
          else {
            _endret = { status: -233, message: 'unknown error occurred in endpoint' };
            syslog.e(e.stack);
          }

        }

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

const do_single_operation =
  async (endpoint: any, vartable: any, reftable: any, resultbox: any) => {

    // apply the variable for this endpoint
    const regexp = /=(\$\S*?)&/g;
    let donext = false;
    let result: any = {};

    do {
      result = regexp.exec(endpoint.endpoint + '&');
      donext = !(!result);

      if (donext) {

        if (result.length != 2)
          continue;

        const varname = result[1];
        const varexpr = vartable[varname];
        let val = {};

        // eval the value
        try {
          val = safeEval(varexpr, resultbox[reftable[varname]]);
        } catch (e) { throw new APIError(-1, 'run expression failed'); }

        // replace the variable
        endpoint.endpoint = endpoint.endpoint.replace(varname, val);
      }
    } while (donext)

    // teardown params
    const _url = new URL(`http://example.com/${endpoint.endpoint}`);
    let _path = _url.pathname;
    const _arguments = Utils.httpGetAllParams(_url.searchParams);

    let _entry: any = {};
    let _return: any = {};

    // refuse request batch endpoint
    if (_path == 'batch')
      throw new APIError(-2, 'batch api cannot include another batch endpoint');

    // load api endpoint
    try {

      // supports forward api
      // batch api only supported GET method
      if (new RegExp(/^\/forward\/forward\//).test(_path)) {
        _path = _path.replace('/forward/forward/', '');
        _entry = await import(`./forward/forward`);
      } else _entry = await import(`./${_path}.js`);

      _entry = _entry.default;

    } catch (e) { throw new APIError(-3, 'endpoint not found'); }

    // invoke method
    await _entry(_arguments, 'GET', _path)
      .then((result: any) => {
        _return.status = 0;
        _return.content = result;

        // apply this result box
        resultbox[`result${endpoint.id}`] = _return.content;
      })
      .catch((error: APIError) => {
        _return.status = error.status;
        _return.message = error.notify;
      });

    return _return;
  }
