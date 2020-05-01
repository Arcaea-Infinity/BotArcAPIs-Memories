declare interface ArcResponseUserMe {
  friends: Array<ArcFriend>,
  user_id: number,
  name: string,
  user_code: string,
  display_name: string,
  character: number,
  is_skill_sealed: boolean,
  recent_score: Array<ArcScore>,
  max_friend: number,
  rating: number,
  id: null,
  join_date: number
}
