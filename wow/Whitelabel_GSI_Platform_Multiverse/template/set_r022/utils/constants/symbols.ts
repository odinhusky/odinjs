import type { Ref, ComputedRef, InjectionKey } from "vue"
import type { GAME_TAG_TYPE, GAME_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type tagItem = {
  label: string
  value: GAME_TAG_TYPE.Enums
  icon: string
  iconName: string
}

export interface SearchGame {
  gameTagList: ComputedRef<tagItem[]>
  searchKeyword: Ref<string>
  showGameList: ComputedRef<Response.GameList>
  productList: ComputedRef<Response.ProductList>
  selectedProductCode: ComputedRef<number | null>
  selectProductCode: (code: number) => void
  gameSearchType: Ref<GAME_TAG_TYPE.Enums>
  isGameFavorited: (game: Response.GameItem) => boolean
  addFavorite: (game: Response.GameItem, pup?: boolean) => Promise<void>
  removeFavorite: (game: Response.GameItem, pup?: boolean) => Promise<void>
  gameType: ComputedRef<GAME_TYPE.Enums>
}

export const SearchGameKey: InjectionKey<SearchGame> = Symbol("SearchGame")
