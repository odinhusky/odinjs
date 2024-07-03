import {useMemo} from "react";
import t from "../lang";
import {environment} from "../../../../../environments/environment";


type IPolicy = {
    title: string;
    contents: string[];
}
type IPrivacyAgreementState = {
    title: string;
    policyItems: IPolicy[];
}


const initializationState = {
    title: t['title'],
    policyItems: [
        {
            title: t['policy_1_title'],
            contents: [
                t['policy_1_content'](environment.platformName)
            ]
        },
        {
            title: t['policy_2_title'],
            contents: [
                t['policy_2_content_1'](environment.platformName),
                t['policy_2_content_2']
            ]
        },
        {
            title: '',
            contents: [
                t['policy_3_content_1'],
                t['policy_3_content_2'],
                t['policy_3_content_3'](environment.platformName),
                t['policy_3_content_4'],
                t['policy_3_content_5'],
                t['policy_3_content_6'](environment.platformName),
            ]
        },
        {
            title: '',
            contents: [
                t['policy_4_content_1'],
                t['policy_4_content_2'],
                t['policy_4_content_3'],
                t['policy_4_content_4'],
                t['policy_4_content_5'],
                t['policy_4_content_6'],
                t['policy_4_content_7'],
                t['policy_4_content_8'],
                t['policy_4_content_9'],
            ]
        },
        {
            title: '',
            contents: [
                t['policy_5_content_1'](environment.platformName),
                t['policy_5_content_2'],
                t['policy_5_content_3'],
                t['policy_5_content_4'],
                t['policy_5_content_5'],
                t['policy_5_content_6'],
                t['policy_5_content_7'],
                t['policy_5_content_8'],
                t['policy_5_content_9'],
                t['policy_5_content_10'](environment.platformName),
                t['policy_5_content_11'](environment.platformName),
                t['policy_5_content_12'](environment.platformName),
                t['policy_5_content_13'](environment.platformName),
                t['policy_5_content_14'],
                t['policy_5_content_15'],
                t['policy_5_content_16'],
                t['policy_5_content_17'],
                t['policy_5_content_18'],
                t['policy_5_content_19'](environment.platformName),
                t['policy_5_content_20'],
                t['policy_5_content_21'](environment.platformName),
                t['policy_5_content_22'],
                t['policy_5_content_23'](environment.platformName),
                t['policy_5_content_24'](environment.platformName),
                t['policy_5_content_25'](environment.platformName),
                t['policy_5_content_26'],
                t['policy_5_content_27'](environment.platformName),
                t['policy_5_content_28'](environment.platformName),
                t['policy_5_content_29'],
                t['policy_5_content_30'],
                t['policy_5_content_31'],
                t['policy_5_content_32'](environment.platformName),
                t['policy_5_content_33'],
                t['policy_5_content_34'],
                t['policy_5_content_35'](environment.platformName),
                t['policy_5_content_36'](environment.platformName),
                t['policy_5_content_37'](environment.platformName),
                t['policy_5_content_38'],
                t['policy_5_content_39'](environment.platformName),
                t['policy_5_content_40'],
                t['policy_5_content_41'],
                t['policy_5_content_42'],
                t['policy_5_content_43'],
                t['policy_5_content_44'],
                t['policy_5_content_45'],
                t['policy_5_content_46'],
                t['policy_5_content_47'],
                t['policy_5_content_48'],
                t['policy_5_content_49'],
                t['policy_5_content_50'],
                t['policy_5_content_51'],
                t['policy_5_content_52'](environment.platformName),
                t['policy_5_content_53'],
                t['policy_5_content_54'](environment.platformName),
                t['policy_5_content_55'],
                t['policy_5_content_56'],
                t['policy_5_content_57'](environment.platformName),
                t['policy_5_content_58'](environment.platformName),
                t['policy_5_content_59'](environment.platformName),
                t['policy_5_content_60'],
                t['policy_5_content_61'],
                t['policy_5_content_62'],
                t['policy_5_content_63'],
                t['policy_5_content_64'],
                t['policy_5_content_65'](environment.platformName),
                t['policy_5_content_66'],
                t['policy_5_content_67'],
                t['policy_5_content_68'],
                t['policy_5_content_69'],
                t['policy_5_content_70'](environment.platformName),
                t['policy_5_content_71'],
                t['policy_5_content_72'],
                t['policy_5_content_73'],
                t['policy_5_content_74'],
                t['policy_5_content_75'](environment.platformName),
                t['policy_5_content_76'],
                t['policy_5_content_77'],
                t['policy_5_content_78'],
                t['policy_5_content_79'],
                t['policy_5_content_80'](environment.platformName),
                t['policy_5_content_81'],
                t['policy_5_content_82'],
                t['policy_5_content_83'],
                t['policy_5_content_84'],
                t['policy_5_content_85'],
                t['policy_5_content_86'],
                t['policy_5_content_87'],
                t['policy_5_content_88'],
                t['policy_5_content_89'],
                t['policy_5_content_90'],
                t['policy_5_content_91'](environment.platformName),
                t['policy_5_content_92'],
                t['policy_5_content_93'],
                t['policy_5_content_94'],
                t['policy_5_content_95'],
                t['policy_5_content_96'],
                t['policy_5_content_97'],
                t['policy_5_content_98'],
                t['policy_5_content_99'](environment.platformName),
                t['policy_5_content_100'],
                t['policy_5_content_101'](environment.platformName),
                t['policy_5_content_102'],
                t['policy_5_content_103'](environment.platformName),
                t['policy_5_content_104'],
                t['policy_5_content_105'],
                t['policy_5_content_106'](environment.platformName),
                t['policy_5_content_107'](environment.platformName),
                t['policy_5_content_108'],
                t['policy_5_content_109'](environment.platformName),
                t['policy_5_content_110'](environment.platformName),
                t['policy_5_content_111'](environment.platformName),
                t['policy_5_content_112'],
                t['policy_5_content_113'],
                t['policy_5_content_114'],
                t['policy_5_content_115'],
                t['policy_5_content_116'](environment.platformName),
                t['policy_5_content_117'],
                t['policy_5_content_118'](environment.platformName),
                t['policy_5_content_119'],
                t['policy_5_content_120'](environment.platformName),
                t['policy_5_content_121'](environment.platformName),
                t['policy_5_content_122'],
                t['policy_5_content_123'],
                t['policy_5_content_124'],
                t['policy_5_content_125'],
                t['policy_5_content_126'],
                t['policy_5_content_127'],
                t['policy_5_content_128'](environment.platformName),
                t['policy_5_content_129'],
                t['policy_5_content_130'](environment.platformName),
                t['policy_5_content_131'],
                t['policy_5_content_132'],
                t['policy_5_content_133'],
                t['policy_5_content_134'],
                t['policy_5_content_135'],
                t['policy_5_content_136'](environment.platformName),
                t['policy_5_content_137'](environment.platformName),
                t['policy_5_content_138'](environment.platformName),
                t['policy_5_content_139'],
                t['policy_5_content_140'],
                t['policy_5_content_141'],
                t['policy_5_content_142'],
                t['policy_5_content_143'],
                t['policy_5_content_144'],
                t['policy_5_content_145'](environment.platformName),
                t['policy_5_content_146'],
                t['policy_5_content_147'],
                t['policy_5_content_148'],
                t['policy_5_content_149'],
                t['policy_5_content_150'],
                t['policy_5_content_151'],
                t['policy_5_content_152'],
                t['policy_5_content_153'],
                t['policy_5_content_154'],
                t['policy_5_content_155'](environment.platformName),
                t['policy_5_content_156'],
                t['policy_5_content_157'],
                t['policy_5_content_158'],
                t['policy_5_content_159'],
                t['policy_5_content_160'](environment.platformName),
                t['policy_5_content_161'],
                t['policy_5_content_162'](environment.platformName),
                t['policy_5_content_163'],
                t['policy_5_content_164'],
                t['policy_5_content_165'](environment.platformName),
                t['policy_5_content_166'],
                t['policy_5_content_167'],
                t['policy_5_content_168'],
                t['policy_5_content_169'](environment.platformName),

            ]
        }
    ]
}

export enum ClickEvent {
    TO_INDEX
}

export const usePrivacyAgreementBase = () => {
    const uiState: IPrivacyAgreementState = useMemo(() => {
        return initializationState;
    }, [])

    const handleClick = (event: ClickEvent) => {

    }

    return {
        uiState,
        handleClick
    }
}