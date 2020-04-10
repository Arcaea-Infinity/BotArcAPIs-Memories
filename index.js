// filename : index.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : main entry

const http = require('http');
const config = require('./source/corefunc/config');
const syslog = require('./source/corefunc/syslog');
const database = require('./source/corefunc/database');
const __loader__ = require('./source/__loader__');

// initialize config first
config.loadMacros();

// initialize system log
syslog.startLog();

// initialize database
database.initDataBases();

// goto main entry ヾ(^▽^*)))
http.createServer(__loader__).listen(SERVER_PORT);
