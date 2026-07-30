export interface PromotionResponseDetail {
  promotion_id: number
  lang: string
  title: string
  content: string
  image: string
}

export interface PromotionResponseItem {
  id: number
  type: number
  category: number
  image: string
  details: PromotionResponseDetail[]
  updated_time: number
}

export type PromotionResponseList = PromotionResponseItem[]
