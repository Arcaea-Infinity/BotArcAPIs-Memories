import IArcScore from "../../arcfetch/interfaces/IArcScore";

export default interface IArcBest30Result {
  last_played: number,
  best30_avg: number,
  recent10_avg: number,
  best30_list: Array<IArcScore>
}
