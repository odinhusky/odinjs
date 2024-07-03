import {useGetGlobalConfigQuery} from "../../../../external";
import {useMemo} from "react";
import {usePageNavigate} from "../../../router/hooks/usePageNavigate";
import t from "../lang";


type IRechargeActivityState = {
    bannerTitle: string;
    depiction: string;
    warnTitle: string;
    warnContent: string;
    buttonText: string;
}

const initializationState = {
    bannerTitle: t['banner_title'](''),
    depiction: t['depiction'](''),
    warnTitle: t['warn_title'],
    warnContent: t['warn_content'],
    buttonText: t['recharge_button_text'],
}

export enum ClickEvent {
    TO_WALLET,
    TO_ACTIVITY,
    TO_INDEX
}

export const useRechargeActivityBase = () => {
    const {data} = useGetGlobalConfigQuery(null);
    const {onClickToWallet, onClickToActivity, onClickToIndex} = usePageNavigate();
    const uiState: IRechargeActivityState = useMemo(() => {
            if (!data) return initializationState;
            let resp = data.data;
            const rechargeCashbackRate = resp.recharge_cashback_rate;
            return {
                ...initializationState,
                bannerTitle: t['banner_title'](rechargeCashbackRate),
                depiction: t['depiction'](rechargeCashbackRate),
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