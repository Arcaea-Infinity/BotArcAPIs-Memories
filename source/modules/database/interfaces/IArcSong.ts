export default interface IArcSong {
  id: string,
  title_localized: {
    en: string,
    ja?: string
  },
  artist: string,
  bpm: string,
  bpm_base: number,
  set: string,
  purchase?: string,
  audioPreview?: number,
  audioPreviewEnd?: number,
  side: number,
  world_unlock?: boolean,
  bg?: string,
  remote_dl?: boolean,
  source_localized?: {
    en: string
  },
  date: number,
  version?: string,
  difficulties: [
    {
      ratingClass: number,
      chartDesigner: string,
      jacketDesigner: string,
      jacketOverride?: boolean,
      rating: number,
      plusFingers?: boolean,
      ratingPlus?: boolean,
      totalNotes?: number
    },
    {
      ratingClass: number,
      chartDesigner: string,
      jacketDesigner: string,
      jacketOverride?: boolean,
      rating: number,
      plusFingers?: boolean,
      ratingPlus?: boolean
      totalNotes?: number
    },
    {
      ratingClass: number,
      chartDesigner: string,
      jacketDesigner: string,
      jacketOverride?: boolean,
      rating: number,
      plusFingers?: boolean,
      ratingPlus?: boolean
      totalNotes?: number
    },
    {
      ratingClass: number,
      chartDesigner: string,
      jacketDesigner: string,
      jacketOverride?: boolean,
      rating: number,
      plusFingers?: boolean,
      ratingPlus?: boolean
      totalNotes?: number
    }
  ]
}
