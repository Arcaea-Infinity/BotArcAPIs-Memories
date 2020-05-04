import IArcScore from "./IArcScore";

export default interface IArcPlayer {
  rating: number,
  join_date: number,
  character: number,
  recent_score: Array<IArcScore>,
  name: string,
  user_id: number,
  code: string
}
