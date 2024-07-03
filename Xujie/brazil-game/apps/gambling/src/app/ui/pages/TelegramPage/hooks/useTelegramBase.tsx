import {useMemo} from "react";
import {AppLocalStorage} from "../../../../persistant/localstorage";
import {AppLocalStorageKey} from "../../../../persistant/AppLocalStorageKey";
import t from "../lang";
import {environment} from "../../../../../environments/environment";
import {usePageNavigate} from "../../../router/hooks/usePageNavigate";


type ITelegramState = {
    bannerTitle: string;
    depictionTitle: string;
    depictionStart: string;
    depictions: string[];
    buttonText:string;
}

const initializationState = {
    bannerTitle: t['banner_title'],
    depictionTitle: t['depiction_title']( environment.platformGroup,  environment.platformName),
    depictionStart: t['depiction_start'],
    depictions: [
        t['depiction_1'],
        t['depiction_2'],
        t['depiction_3'],
        t['depiction_4']( environment.platformGroup,  environment.platformName),
        t['depiction_5'],
        t['depiction_6'],
        t['depiction_7'],
        t['depiction_8'],
        t['depiction_9'],
    ],
    buttonText:t['join_button_text'],
}
export enum ClickEvent {
    TO_INDEX,
    OPEN_TELEGRAM
}

export const useTelegramBase = () => {
    const telegramId = AppLocalStorage.getItem(AppLocalStorageKey.telegramGroup);
    const userInfoString = AppLocalStorage.getItem(AppLocalStorageKey.userInfo);
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const user_id = userInfo?.user_id || '';
    const telegramUrl = `https://t.me/${telegramId}?start=${user_id}`

    const {onClickToIndex} = usePageNavigate();

    const uiState: ITelegramState = useMemo(() => {
        return {
            ...initializationState,
        };
    }, [telegramUrl]);


    const handleClick = (event: ClickEvent) => {
        switch (event) {
            case ClickEvent.TO_INDEX:
                onClickToIndex();
                break;
            case ClickEvent.OPEN_TELEGRAM:
                window.open(telegramUrl, '_blank');
                break;
        }
    }

    return {
        uiState,
        handleClick
    }
}