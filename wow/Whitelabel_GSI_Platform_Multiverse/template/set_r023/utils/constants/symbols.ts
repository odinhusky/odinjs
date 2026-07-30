import type { Ref, ComputedRef, InjectionKey } from "vue"
import type { GAME_TAG_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type tagItem = {
  label: string
  value: GAME_TAG_TYPE.Enums
  icon: string
  iconName: string
}

export interface SearchGame {
  gameTagList: ComputedRef<tagItem[]>
  gameSearchType: Ref<GAME_TAG_TYPE.Enums, GAME_TAG_TYPE.Enums>
  searchKeyword: Ref<string, string>
  showGameList: ComputedRef<Response.GameList>
  productList: ComputedRef<Response.ProductList>
  selectedProductCode: ComputedRef<number | null>
  selectProductCode: (code: number) => void
  isGameFavorited: (game: Response.GameItem) => boolean
  addFavorite: (game: Response.GameItem, pup?: boolean) => Promise<void>
  removeFavorite: (game: Response.GameItem, pup?: boolean) => Promise<void>
  gameType: ComputedRef<number>
}

export const SearchGameKey: InjectionKey<SearchGame> = Symbol("SearchGame")
