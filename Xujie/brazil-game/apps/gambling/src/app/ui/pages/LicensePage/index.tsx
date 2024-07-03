import { LicensePage as RioLicensePage } from './env/u2'
import { LicensePage as CocoLicensePage } from './env/u1'
import { LicensePage as U5LicensePage } from './env/u5'
import { LicensePage as U6LicensePage } from './env/u6'
import { LicensePage as U7LicensePage } from './env/u7'
import { renderByUVersion } from "../../utils/renderByUVersion";

export const LicensePage = () => {
  return renderByUVersion({
    "u1": <CocoLicensePage />,
    "u2": <RioLicensePage />,
    "u5": <U5LicensePage />,
    "u6": <U6LicensePage />,
    "u7": <U7LicensePage />
  }, <RioLicensePage />)
}
