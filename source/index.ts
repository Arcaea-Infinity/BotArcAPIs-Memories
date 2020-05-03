import http from 'http';
import syslog from './corefunc/syslog';
import config from './corefunc/config';
import database from './corefunc/database';
import __loader__ from './__loader__';

const TAG: string = 'source/index.ts';
const main = ((): void => {

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
  console.info(`Http server started at 0.0.0.0:${SERVER_PORT}`);

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
  process.on('unhandledRejection', (reason, promise) => {
    syslog.f(`unhandledRejection => ${reason}`);
    process.exit(1);
  });

})();
