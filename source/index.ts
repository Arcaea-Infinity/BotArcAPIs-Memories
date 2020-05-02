import http from 'http';
import config from './corefunc/config';
import database from './corefunc/database';
import __loader__ from './__loader__';

const main = ((): void => {

  // initialize config first
  config.loadConfigs();
  process.title = `${BOTARCAPI_VERSTR}`;

  // initialize system log
  SystemLog.startLogging();

  // print configs
  config.printConfigs();

  // initialize database
  database.initDataBases();

  // goto main entry ヾ(^▽^*)))
  const service = http.createServer(__loader__).listen(SERVER_PORT);
  console.info(`Http server started at 0.0.0.0:${SERVER_PORT}`);


  // nodejs event handlers
  process.on('exit', (code) => {
    console.info('** Stop Service **');
    // stop http server
    service.close();
    console.info('Stop http server');
    // close databases
    database.close();
    console.info('Stop all database access');
    // stop syslog
    console.info('Stop logging');
    SystemLog.stop();
  });
  process.on('SIGINT', () => {
    console.warn(`You pressed ctrl + c`);
    process.exit(0);
  });
  process.on('warning', (w) => {
    console.warn(`warning => ${w.message}`);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.assert(`unhandledRejection => ${reason}`);
    process.exit(1);
  });

})();
