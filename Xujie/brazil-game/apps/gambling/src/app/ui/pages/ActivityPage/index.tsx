import queryString from "query-string";
import {HallPage} from "./HallPage";
import {DailyCashbackPage} from "./DailyCashbackPage";
import {LossBenefitPage} from "./LossBenefitPage";
import {RecordPage} from "./RecordPage";
import {InitialChargePage} from "../InitialChargePage";
import {RechargeActivityPage} from "../RechargeActivityPage";
import {DailySignInPage} from "../DailySignInPage";
import {LuckyWheel} from './LuckyWheel'
import {IActivityFontConfig, useActivityFontConfig} from "./hooks/useActivityFontConfig";
import {BoxPage} from "./BoxPage";
import React from "react";
import {InvitePage} from "../InvitePage";

export enum ActivityPageRouter {
  HALL = "hall",
  LOSS_RELIEF = "loss_reward",
  DAILY_CASHBACK = "bet_reward",
  BOX_INVITE_REWARD = "box_invite_reward",
  RECORD = "record",
  LUCKY_WHEEL = "lucky_wheel_reward",

  // 固定的活動
  INVITE= "invite",
  CHECK_IN = "checkin",
  INITIAL_CHARGE = "initialcharge",
  RECHARGE = "recharge",
}

export interface IActivityPage {
    fontConfig?: IActivityFontConfig;
}

type ActivityPageRouterEnumValues = typeof ActivityPageRouter[keyof typeof ActivityPageRouter];
export const ActivityPage = () => {
    const {fontConfig} = useActivityFontConfig();

    const category = queryString.parse(window.location.search)?.category || 'hall';
    const isRouterInEnum = (router: string | (string | null)[]): router is ActivityPageRouterEnumValues => {
        return Object.values(ActivityPageRouter).includes(router as ActivityPageRouterEnumValues);
    };
    const renderComponentBasedOnCategory = (category: string | (string | null)[]) => {
        if (!isRouterInEnum(category)) {
            return <HallPage fontConfig={fontConfig}/>;
        }
        switch (category) {
            case  ActivityPageRouter.HALL:
                return <HallPage fontConfig={fontConfig}/>;
            case  ActivityPageRouter.LOSS_RELIEF:
                return <LossBenefitPage fontConfig={fontConfig}/>;
            case  ActivityPageRouter.DAILY_CASHBACK:
                return <DailyCashbackPage fontConfig={fontConfig}/>;
            case  ActivityPageRouter.BOX_INVITE_REWARD:
                return <BoxPage fontConfig={fontConfig} isFromActivity={true}/>;
            case  ActivityPageRouter.RECORD:
                return <RecordPage/>;
            case  ActivityPageRouter.LUCKY_WHEEL:
                return <LuckyWheel />;
            case  ActivityPageRouter.INVITE:
                return <InvitePage
                    isFromActivity={true}/>;
            case  ActivityPageRouter.CHECK_IN:
                return <DailySignInPage
                    isFromActivity={true}/>;
            case  ActivityPageRouter.INITIAL_CHARGE:
                return <InitialChargePage
                    isFromActivity={true}/>;
            case  ActivityPageRouter.RECHARGE:
                return <RechargeActivityPage
                    isFromActivity={true}/>;
        }
    };

    return (<div>
        {renderComponentBasedOnCategory(category)}
    </div>)
}