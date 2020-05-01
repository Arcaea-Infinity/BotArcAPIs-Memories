declare interface IArcBest30Result {
  best30_avg: number;
  recent10_avg: number;
  best30_list: Array<ArcScore>;
}

declare interface IDatabaseArcBest30 {
  best30_avg: number;
  recent10_avg: number;
  best30_list: string;
}
