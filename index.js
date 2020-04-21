// filename : index.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : main entry

const TAG = 'index.js';

const http = require('http');
const config = require('./source/corefunc/config');
const syslog = require('./source/corefunc/syslog');
const database = require('./source/corefunc/database');
const __loader__ = require('./source/__loader__');

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
  console.info('** Stop Service **');

  // stop http server
  service.close();
  console.info('Stop http server');

  // close databases
  database.close();
  console.info('Stop all database access');

  // stop syslog
  console.info('Stop logging');
  syslog.stop();
});

process.on('SIGINT', () => {
  console.warn(`You pressed ctrl + c`);
  process.exit(0);
});

process.on('warning', (w) => {
  console.warn(`warning => ${w.message}`);
});

process.on('uncaughtException', (e, origin) => {
  console.assert(`uncaughtException => ${e.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.assert(`unhandledRejection => ${reason}`);
  process.exit(1);
});
