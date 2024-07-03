import { renderByUVersion } from "../../../utils/renderByUVersion";
import { GameTypeHeader as WGameTypeHeader } from "../env/wild/GameTypeHeader"
import { GameTypeHeader as PGameTypeHeader } from "../env/p1/GameTypeHeader"
import { GameTypeHeader as CGameTypeHeader } from "../env/u1/GameTypeHeader"
import { GameTypeHeader as RGameTypeHeader } from "../env/u2/GameTypeHeader"

export const GameTypeHeader = renderByUVersion({
  "wild777bet": WGameTypeHeader,
  "p1": PGameTypeHeader,
  "u1": CGameTypeHeader,
  "u2": RGameTypeHeader
}, CGameTypeHeader)
