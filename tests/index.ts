const TAG: string = 'tests/index.ts';

import config from '../source/corefunc/config';
import syslog from '../source/modules/syslog/syslog';
import database from '../source/corefunc/database';
import __loader__ from '../source/__loader__';
import databaseArcsongAllcharts from '../source/modules/database/database.arcsong.allcharts';
import IDatabaseArcSongChart from '../source/modules/database/interfaces/IDatabaseArcSongChart';

(function main() {

  // initialize config first
  config.loadConfigs();
  process.title = `${BOTARCAPI_VERSTR}`;

  // initialize system log
  syslog.startLogging();

  // print configs
  config.printConfigs();

  // initialize database
  database.initDataBases();

  setTimeout(async () => {
    const charts: Array<IDatabaseArcSongChart> = await databaseArcsongAllcharts();
    console.log(JSON.stringify(charts[0]));
  }, 500);


})();
