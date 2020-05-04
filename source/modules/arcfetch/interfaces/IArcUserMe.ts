import IArcScore from "./IArcScore";
import IArcPlayer from "./IArcPlayer";

export interface IArcUserMe {
  friends: Array<IArcPlayer>,
  user_id: number,
  name: string,
  user_code: string,
  display_name: string,
  character: number,
  is_skill_sealed: boolean,
  recent_score: Array<IArcScore>,
  max_friend: number,
  rating: number,
  id: null,
  join_date: number
}
