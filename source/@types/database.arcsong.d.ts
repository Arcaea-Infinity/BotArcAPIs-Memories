declare interface IDatabaseArcSong {
  sid: string,
  name_en: string,
  name_jp: string,
  bpm: string,
  bpm_base: number,
  pakset: string,
  artist: string,
  time: number,
  side: number,
  date: number,
  world_unlock: 'true' | 'false',
  remote_download: 'true' | 'false',
  difficultly_pst: number,
  difficultly_prs: number,
  difficultly_ftr: number,
  chart_designer_pst: string,
  chart_designer_prs: string,
  chart_designer_ftr: string,
  jacket_designer_pst: string,
  jacket_designer_prs: string,
  jacket_designer_ftr: string
}

declare interface IDatabaseArcSongAlias {
  sid: string,
  alias: string
}

declare interface IDatabaseArcSongChart {
  sid: string,
  rating_class: number,
  difficultly: number,
  rating: number
}
