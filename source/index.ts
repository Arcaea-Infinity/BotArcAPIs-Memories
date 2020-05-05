const TAG: string = 'source/index.ts';

import http from 'http';
import config from './corefunc/config';
import syslog from './modules/syslog/syslog';
import database from './corefunc/database';
import __loader__ from './__loader__';

(function main(): void {

  // initialize config first
  config.loadConfigs();
  process.title = `${BOTARCAPI_VERSTR}`;

  // initialize system log
  syslog.startLogging();

  // print configs
  config.printConfigs();

  // initialize database
  database.initDataBases();

  // goto main entry ヾ(^▽^*)))
  const service = http.createServer(__loader__).listen(SERVER_PORT);
  syslog.i(`Http server started at 0.0.0.0:${SERVER_PORT}`);

  // nodejs event handlers
  process.on('exit', (code) => {
    syslog.i(TAG, '** Stop Service **');
    // stop http server
    service.close();
    syslog.i(TAG, 'Stop http server');
    // close databases
    database.close();
    syslog.i(TAG, 'Stop all database access');
    // stop syslog
    syslog.i(TAG, 'Stop logging');
    syslog.stop();
  });
  process.on('SIGINT', () => {
    syslog.w(`You pressed ctrl + c`);
    process.exit(0);
  });
  process.on('warning', (w) => {
    syslog.w(`warning => ${w.message}`);
  });
  process.on('uncaughtException', (reason) => {
    syslog.f(`unhandledRejection => ${(<any>reason)?.stack ?? 'unknown'}`);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason, promise) => {
    syslog.f(`unhandledRejection => ${(<any>reason)?.stack ?? 'unknown'}`);
    process.exit(1);
  });

})();
