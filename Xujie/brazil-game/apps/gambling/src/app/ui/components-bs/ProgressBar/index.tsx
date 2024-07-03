import { renderByUVersion } from "../../utils/renderByUVersion";

import { ProgressBar as CocoProgressBar } from './env/u1'
import { ProgressBar as RioProgressBar } from './env/u2'
import { ProgressBar as U5ProgressBar } from './env/u5'
import { ProgressBar as U6ProgressBar } from './env/u6'
import { ProgressBar as U7ProgressBar } from './env/u7'
import { ProgressBar as U9ProgressBar } from './env/u9'

export const ProgressBar = renderByUVersion({
  "u1": CocoProgressBar,
  "u2": RioProgressBar,
  "u5": U5ProgressBar,
  "u6": U6ProgressBar,
  "u7": U7ProgressBar,
  "u9": U9ProgressBar,
}, CocoProgressBar)
