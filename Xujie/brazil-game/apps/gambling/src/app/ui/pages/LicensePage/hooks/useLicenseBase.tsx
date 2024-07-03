import t from "../lang";
import {useMemo} from "react";
import {environment} from "../../../../../environments/environment";
import {usePageNavigate} from "../../../router/hooks/usePageNavigate";


type ILicenseState = {
    title: string;
    subTitle: string;
    depiction: string;
}

const initializationState = {
    title: t['title'],
    subTitle: t['sub_title'](environment.platformName),
    depiction: t['depiction'](environment.platformName),
}

export enum ClickEvent {
    TO_INDEX
}
export const useLicenseBase = () => {
    const {onClickToIndex} = usePageNavigate()

    const uiState: ILicenseState = useMemo(() => {
        return initializationState;
    }, [])

    const handleClick = (event: ClickEvent) => {
        switch (event) {
            case ClickEvent.TO_INDEX:
                onClickToIndex();
                break;
        }
    }

    return {
        uiState,
        handleClick
    }
}