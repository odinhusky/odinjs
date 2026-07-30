import * as assert from "assert"

import * as CMS_ENTRANCE_TYPE from "../../utils/constants/cmsEntranceType"
import {
  filterUnsupportedCmsItem,
  filterUnsupportedCmsItems,
  isUnsupportedFreegameEntrance,
} from "./filterUnsupportedCmsEntrance"

const createEntrance = (did: string, linkId = 0) =>
  ({
    lang: {},
    type: CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE,
    sort: 1,
    payload: {
      integration_id: 0,
      did,
      link_id: linkId,
    },
    img_path: "",
    updated_time: 0,
  } as any)

const createCmsItem = (entrances: any[]) =>
  ({
    id: 1,
    url_id: 1,
    Setting: { payload: {} },
    Entrance: entrances,
    Page: [],
  } as any)

assert.strictEqual(isUnsupportedFreegameEntrance(createEntrance("freegame_page", 36)), true)
assert.strictEqual(isUnsupportedFreegameEntrance(createEntrance("deposit", 1)), false)

assert.deepStrictEqual(filterUnsupportedCmsItems([createCmsItem([createEntrance("freegame_page", 36)])]), [])

const retainedEntrance = createEntrance("deposit", 1)
assert.deepStrictEqual(
  filterUnsupportedCmsItem(createCmsItem([createEntrance("freegame_page", 36), retainedEntrance]))?.Entrance,
  [retainedEntrance]
)

const customPageItem = createCmsItem([
  {
    ...createEntrance("component", 0),
    type: 1,
    payload: {
      integration_id: 0,
      nested_entrance: [createEntrance("freegame_page", 36), retainedEntrance],
    },
  },
])

assert.deepStrictEqual((filterUnsupportedCmsItem(customPageItem)?.Entrance[0].payload as any).nested_entrance, [
  retainedEntrance,
])
