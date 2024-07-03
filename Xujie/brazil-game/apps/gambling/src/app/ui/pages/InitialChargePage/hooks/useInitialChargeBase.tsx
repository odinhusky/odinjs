import {useMemo} from "react";
import {usePageNavigate} from "../../../router/hooks/usePageNavigate";
import {useGetGlobalConfigQuery} from "../../../../external";
import t from "../lang";
import {environment} from "../../../../../environments/environment";

type IInitialChargeState = {
    bannerTitle: string;
    depictionTitle: string;
    depictions: string[];
    warnContent: string;
    buttonText: string;
    navTextPc: string;
    navText: string;
}

const initializationState = {
    bannerTitle: t['banner_title'](''),
    depictionTitle: t['depiction_title'](''),
    depictions: [
        t['depiction_start'](''),
        t['depiction_1'](0),
        t['depiction_2'],
        t['depiction_3'],
        t['depiction_4'],
        t['depiction_5']('')
    ],
    warnContent: t['warn_content'],
    buttonText: t['recharge_button_text'],
    navTextPc:  t['back_nav_text_pc'],
    navText:  t['back_nav_text'],
}

export enum ClickEvent {
    TO_WALLET,
    TO_ACTIVITY,
    TO_INDEX
}

export const useInitialChargeBase = () => {
    const {data} = useGetGlobalConfigQuery(null);
    const {onClickToWallet, onClickToActivity, onClickToIndex} = usePageNavigate();
    const uiState: IInitialChargeState = useMemo(() => {
            if (!data) return initializationState;
            let resp = data.data;
            const rechargeFirstCashbackRate = resp.recharge_first_cashback_rate;
            const rechargeBonusStart = resp.recharge_bonus_start;
            return {
                ...initializationState,
                bannerTitle: t['banner_title'](rechargeFirstCashbackRate),
                depictionTitle: t['depiction_title'](rechargeFirstCashbackRate),
                depictions: [
                    t['depiction_start'](rechargeFirstCashbackRate),
                    t['depiction_1'](rechargeBonusStart),
                    t['depiction_2'],
                    t['depiction_3'],
                    t['depiction_4'],
                    t['depiction_5'](environment.platformGroup)
                ]
            };
        },
        [data]);
    const handleClick = (event: ClickEvent) => {
        switch (event) {
            case ClickEvent.TO_ACTIVITY:
                onClickToActivity();
                break;
            case ClickEvent.TO_INDEX:
                onClickToIndex();
                break;
            case ClickEvent.TO_WALLET:
                onClickToWallet();
                break;
        }
    }
    return {
        uiState,
        handleClick
    }
}