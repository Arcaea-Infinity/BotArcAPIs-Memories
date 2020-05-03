export default (): Promise<void> => {

  const _sql: string =
    'CREATE TABLE IF NOT EXISTS `records` (' +
    '`uid` INTEGER NOT NULL,' +
    '`score` INTEGER NOT NULL,' +
    '`health` INTEGER NOT NULL,' +
    '`rating` INTEGER NOT NULL,' +
    '`song_id` TEXT NOT NULL,' +
    '`modifier` INTEGER NOT NULL,' +
    '`difficulty` INTEGER NOT NULL,' +
    '`clear_type` INTEGER NOT NULL,' +
    '`best_clear_type` INTEGER NOT NULL,' +
    '`time_played` INTEGER NOT NULL,' +
    '`near_count` INTEGER NOT NULL,' +
    '`miss_count` INTEGER NOT NULL,' +
    '`perfect_count` INTEGER NOT NULL,' +
    '`shiny_perfect_count` INTEGER NOT NULL, ' +
    'PRIMARY KEY ("uid" ASC, "song_id" ASC, "time_played" ASC));';

  // execute sql
  return DATABASE_ARCRECORD.exec(_sql);
  
}
