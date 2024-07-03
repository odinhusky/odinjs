import {renderByUVersion} from "../../utils/renderByUVersion";
import {CompanyProfilePage as CCompanyProfilePage} from "./env/u1/index";
import {CompanyProfilePage as RCompanyProfilePage} from "./env/u2/index";
import {CompanyProfilePage as U5CompanyProfilePage} from "./env/u5/index";
import {CompanyProfilePage as U6CompanyProfilePage} from "./env/u6/index";
import {CompanyProfilePage as U7CompanyProfilePage} from "./env/u7/index";

export const CompanyProfilePage = () => {
  return renderByUVersion({
    "u1": (
      <CCompanyProfilePage/>
    ),
    "u2": (
      <RCompanyProfilePage/>
    ),
    "u5": (
      <U5CompanyProfilePage/>
    ),
    "u6": (
      <U6CompanyProfilePage/>
    ),
    "u7":(
        <U7CompanyProfilePage/>
    )
  }, <CCompanyProfilePage/>)
}
