import {renderByUVersion} from "../../utils/renderByUVersion";
import {ToolButton as WToolButton} from "../../components-bs/Buttons/env/wild/ToolButton";
import {ToolButton as PToolButton} from "../../components-bs/Buttons/env/p1/ToolButton";
import {ToolButton as CToolButton} from "../../components-bs/Buttons/env/u1/ToolButton";
import {ToolButton as RToolButton} from "../../components-bs/Buttons/env/u2/ToolButton";

export const ToolButton = renderByUVersion({
  "wild777bet": WToolButton,
  "p1": PToolButton,
  "u1": CToolButton,
  "u2": RToolButton,
}, CToolButton)
