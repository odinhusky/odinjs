import t from "../lang";
import {useMemo} from "react";
import {environment} from "../../../../../environments/environment";


type ITerms = {
    title: string;
    contents: string[];
}
type ITermsOfServiceState = {
    title: string;
    termsItems: ITerms[];
}

const initializationState = {
    title: t['title'],
    termsItems: [
        {
            title: '',
            contents: [
                t['terms_1_content_1'](environment.platformName),
                t['terms_1_content_2'](environment.platformName),
                t['terms_1_content_3'](environment.platformName),
                t['terms_1_content_4'](environment.platformName),
                t['terms_1_content_5'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_2_content_1'],
                t['terms_2_content_2'](environment.platformName),
                t['terms_2_content_3'](environment.platformName),
                t['terms_2_content_4'],
                t['terms_2_content_5'],
                t['terms_2_content_6'],
                t['terms_2_content_7'],
                t['terms_2_content_8'],
                t['terms_2_content_9'],
                t['terms_2_content_10'](environment.platformName),
                t['terms_2_content_11'],
                t['terms_2_content_12'](environment.platformName),
                t['terms_2_content_13'](environment.platformName),
                t['terms_2_content_14'],
                t['terms_2_content_15'],
                t['terms_2_content_16'](environment.platformName),
                t['terms_2_content_17'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_3_content_1'],
                t['terms_3_content_2'](environment.platformName),
                t['terms_3_content_3'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_4_content_1'],
                t['terms_4_content_2'](environment.platformName),
                t['terms_4_content_3'](environment.platformName),
                t['terms_4_content_4'],
                t['terms_4_content_5'],
                t['terms_4_content_6'](environment.platformName),
                t['terms_4_content_7'](environment.platformName),
                t['terms_4_content_8'],
                t['terms_4_content_9'],
                t['terms_4_content_10'](environment.platformName),
                t['terms_4_content_11'](environment.platformName),
                t['terms_4_content_12'](environment.platformName),
                t['terms_4_content_13'](environment.platformName),
                t['terms_4_content_14'](environment.platformName),
                t['terms_4_content_15'](environment.platformName),
                t['terms_4_content_16'],
                t['terms_4_content_17'](environment.platformName),
                t['terms_4_content_18'](environment.platformName),
                t['terms_4_content_19'],
                t['terms_4_content_20'](environment.platformName),
                t['terms_4_content_21'](environment.platformName),
                t['terms_4_content_22'](environment.platformName),
                t['terms_4_content_23'](environment.platformName),
                t['terms_4_content_24'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_5_content_1'](environment.platformName),
                t['terms_5_content_2'](environment.platformName),
                t['terms_5_content_3'](environment.platformName),
                t['terms_5_content_4'],
                t['terms_5_content_5'],
                t['terms_5_content_6'],
                t['terms_5_content_7'],
                t['terms_5_content_8'],
                t['terms_5_content_9'](environment.platformName),
                t['terms_5_content_10'],
                t['terms_5_content_11'],
                t['terms_5_content_12'],
                t['terms_5_content_13'],
                t['terms_5_content_14'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_6_content_1'](environment.platformName),
                t['terms_6_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_7_content_1'](environment.platformName),
                t['terms_7_content_2'](environment.platformName),
                t['terms_7_content_3'](environment.platformName),
                t['terms_7_content_4'](environment.platformName),
                t['terms_7_content_5'](environment.platformName),
                t['terms_7_content_6'],
                t['terms_7_content_7'](environment.platformName),
                t['terms_7_content_8'](environment.platformName),
                t['terms_7_content_9'](environment.platformName),
                t['terms_7_content_10'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_8_content_1'],
                t['terms_8_content_2'](environment.platformName),
                t['terms_8_content_3'],
                t['terms_8_content_4'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_9_content_1'],
                t['terms_9_content_2'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_10_content_1'],
                t['terms_10_content_2'](environment.platformName),
                t['terms_10_content_3'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_11_content_1'],
                t['terms_11_content_2'](environment.platformName),
                t['terms_11_content_3'],
                t['terms_11_content_4'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_12_content_1'],
                t['terms_12_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_13_content_1'],
                t['terms_13_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_14_content_1'],
                t['terms_14_content_2'](environment.platformName),
                t['terms_14_content_3'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_15_content_1'](environment.platformName),
                t['terms_15_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_16_content_1'],
                t['terms_16_content_2'],
                t['terms_16_content_3'](environment.platformName),
                t['terms_16_content_4'],
                t['terms_16_content_5'](environment.platformName),
                t['terms_16_content_6'](environment.platformName),
                t['terms_16_content_7'](environment.platformName),
                t['terms_16_content_8'](environment.platformName),
                t['terms_16_content_9'](environment.platformName),
                t['terms_16_content_10'](environment.platformName),
                t['terms_16_content_11'](environment.platformName),
                t['terms_16_content_12'],
                t['terms_16_content_13'],
                t['terms_16_content_14'],
                t['terms_16_content_15'](environment.platformName),
                t['terms_16_content_16'],
                t['terms_16_content_17'](environment.platformName),
                t['terms_16_content_18'],
                t['terms_16_content_19'](environment.platformName),
                t['terms_16_content_20'],
                t['terms_16_content_21'],
                t['terms_16_content_22'],
                t['terms_16_content_23'](environment.platformName),
                t['terms_16_content_24'],
                t['terms_16_content_25'],
                t['terms_16_content_26'](environment.platformName),
                t['terms_16_content_27'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_17_content_1'],
                t['terms_17_content_2'](environment.platformName),
                t['terms_17_content_3'](environment.platformName),
                t['terms_17_content_4'](environment.platformName),
                t['terms_17_content_5'](environment.platformName),
                t['terms_17_content_6'](environment.platformName),
                t['terms_17_content_7'](environment.platformName),
                t['terms_17_content_8'],
                t['terms_17_content_9'],
                t['terms_17_content_10'],
                t['terms_17_content_11'],
                t['terms_17_content_12'],
                t['terms_17_content_13'],
                t['terms_17_content_14'],
                t['terms_17_content_15'],
                t['terms_17_content_16'](environment.platformName),
                t['terms_17_content_17'](environment.platformName),
                t['terms_17_content_18'],
                t['terms_17_content_19'],
                t['terms_17_content_20'],
                t['terms_17_content_21'],
                t['terms_17_content_22'](environment.platformName),
                t['terms_17_content_23'](environment.platformName),
                t['terms_17_content_24'](environment.platformName),
                t['terms_17_content_25'],
                t['terms_17_content_26'](environment.platformName),
                t['terms_17_content_27'](environment.platformName),
                t['terms_17_content_28'](environment.platformName),
                t['terms_17_content_29'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_18_content_1'](environment.platformName),
                t['terms_18_content_2'](environment.platformName),
                t['terms_18_content_3'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_19_content_1'],
                t['terms_19_content_2'](environment.platformName),
                t['terms_19_content_3'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_20_content_1'],
                t['terms_20_content_2'](environment.platformName),
                t['terms_20_content_3'](environment.platformName),
                t['terms_20_content_4'](environment.platformName),
                t['terms_20_content_5'](environment.platformName),
                t['terms_20_content_6'](environment.platformName),
                t['terms_20_content_7'](environment.platformName),
                t['terms_20_content_8'],
                t['terms_20_content_9'],
                t['terms_20_content_10'],
                t['terms_20_content_11'],
                t['terms_20_content_12'],
                t['terms_20_content_13'],
                t['terms_20_content_14'](environment.platformName),
                t['terms_20_content_15'](environment.platformName),
                t['terms_20_content_16'],
                t['terms_20_content_17'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_21_content_1'],
                t['terms_21_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_22_content_1'],
                t['terms_22_content_2'](environment.platformName),
                t['terms_22_content_3'](environment.platformName),
                t['terms_22_content_4'](environment.platformName),
                t['terms_22_content_5'](environment.platformName),
                t['terms_22_content_6'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_23_content_1'],
                t['terms_23_content_2'](environment.platformName),
                t['terms_23_content_3'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_24_content_1'],
                t['terms_24_content_2'](environment.platformName),
                t['terms_24_content_3'](environment.platformName),
                t['terms_24_content_4'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_25_content_1'](environment.platformName),
                t['terms_25_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_26_content_1'],
                t['terms_26_content_2'](environment.platformName),
                t['terms_26_content_3'](environment.platformName),
                t['terms_26_content_4'](environment.platformName),
                t['terms_26_content_5'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_27_content_1'],
                t['terms_27_content_2'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_28_content_1'],
                t['terms_28_content_2'](environment.platformName),
                t['terms_28_content_3'](environment.platformName),
                t['terms_28_content_4'](environment.platformName),
                t['terms_28_content_5'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_29_content_1'],
                t['terms_29_content_2'](environment.platformName),
                t['terms_29_content_3'](environment.platformName),
                t['terms_29_content_4'](environment.platformName),
                t['terms_29_content_5'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_30_content_1'],
                t['terms_30_content_2'](environment.platformName),
                t['terms_30_content_3'],
                t['terms_30_content_4'],
                t['terms_30_content_5'](environment.platformName),
                t['terms_30_content_6'](environment.platformName),
                t['terms_30_content_7'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_31_content_1'](environment.platformName),
                t['terms_31_content_2'],
                t['terms_31_content_3'],
                t['terms_31_content_4'],
                t['terms_31_content_5'](environment.platformName),
                t['terms_31_content_6'](environment.platformName),
                t['terms_31_content_7'](environment.platformName),
                t['terms_31_content_8'],
                t['terms_31_content_9'],
                t['terms_31_content_10'](environment.platformName),
                t['terms_31_content_11'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['terms_32_content_1'],
                t['terms_32_content_2'],
                t['terms_32_content_3'],
                t['terms_32_content_4'],
                t['terms_32_content_5'],
                t['terms_32_content_6'],
                t['terms_32_content_7'](environment.platformName),
                t['terms_32_content_8'](environment.platformName),
                t['terms_32_content_9'](environment.platformName),
                t['terms_32_content_10'],
                t['terms_32_content_11'](environment.platformName),
                t['terms_32_content_12'],
                t['terms_32_content_13'],
            ]
        },
        {
            title: '',
            contents: [
                t['terms_33_content_1'](environment.platformName),
                t['terms_33_content_2'],
                t['terms_33_content_3'],
                t['terms_33_content_4'](environment.platformName),
                t['terms_33_content_5'](environment.platformName),
                t['terms_33_content_6'](environment.platformName),
                t['terms_33_content_7'],
                t['terms_33_content_8'](environment.platformName),
                t['terms_33_content_9'],
            ]
        },
    ]
}

export enum ClickEvent {
    TO_INDEX
}

export const useTermsOfServiceBase = () => {
    const uiState: ITermsOfServiceState = useMemo(() => {
        return initializationState;
    }, [])

    const handleClick = (event: ClickEvent) => {

    }

    return {
        uiState,
        handleClick
    }
}