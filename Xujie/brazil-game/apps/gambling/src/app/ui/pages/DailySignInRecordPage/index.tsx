import {renderByUVersion} from "../../utils/renderByUVersion";
import { DailySignInRecordPage as CDailySignInRecordPage } from "./env/u1/"
import { DailySignInRecordPage as RioDailySignInRecordPage } from "./env/u2"
import { DailySignInRecordPage as U5DailySignInRecordPage } from "./env/u5"
import { DailySignInRecordPage as U6DailySignInRecordPage } from "./env/u6"
import { DailySignInRecordPage as U7DailySignInRecordPage } from "./env/u7"


export const DailySignInRecordPage = () => {

  return renderByUVersion({
    "u2": <RioDailySignInRecordPage />,
    "u5": <U5DailySignInRecordPage />,
    "u6": <U6DailySignInRecordPage />,
    "u7": <U7DailySignInRecordPage />,
  }, <CDailySignInRecordPage />);
}



