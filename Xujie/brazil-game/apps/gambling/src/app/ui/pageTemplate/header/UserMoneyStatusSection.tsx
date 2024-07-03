import React from "react";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {UserMoneyStatusSection as PUserMoneyStatusSection} from "./env/p1/UserMoneyStatusSection";
import {UserMoneyStatusSection as CUserMoneyStatusSection} from "./env/u1/UserMoneyStatusSection";
import {UserMoneyStatusSection as RUserMoneyStatusSection} from "./env/u2/UserMoneyStatusSection";
import {UserMoneyStatusSection as U5UserMoneyStatusSection} from "./env/u5/UserMoneyStatusSection";
import {UserMoneyStatusSection as U6UserMoneyStatusSection} from "./env/u6/UserMoneyStatusSection";
import {UserMoneyStatusSection as U7UserMoneyStatusSection} from "./env/u7/UserMoneyStatusSection";

export type IProps = {
  className?: string;
  textClassName?:string;
}
export const UserMoneyStatusSection = (props: IProps) => {
  return renderByUVersion({
    "p1": (
      <PUserMoneyStatusSection/>
    ),
    "u1": (
      <CUserMoneyStatusSection/>
    ),
    "u2": (
      <RUserMoneyStatusSection/>
    ),
    "u5": (
      <U5UserMoneyStatusSection />
    ),
    "u6": (
      <U6UserMoneyStatusSection {...props}/>
    ),
    "u7": (
      <U7UserMoneyStatusSection {...props}/>
    )
  }, <CUserMoneyStatusSection/>)
}
