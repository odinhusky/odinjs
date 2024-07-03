import t from '../lang';
import {useMemo} from 'react';
import {environment} from '../../../../../environments/environment';
import {usePageNavigate} from '../../../router/hooks/usePageNavigate';

type IMilestone = {
    year: string;
    milestoneTitle: string;
    milestoneContent: string;
}
type ICompanyProfileState = {
    title: string;
    subTitle: string;
    milestones: IMilestone[];
    licensingTitle: string;
    licensingContents: string[];
}

const initializationState = {
    title: t['title'],
    subTitle: t['sub_title'],
    milestones: [
        {
            year: t['milestone_1_year'],
            milestoneTitle: t['milestone_1_title'],
            milestoneContent: t['milestone_1_content']
        },
        {
            year: t['milestone_2_year'],
            milestoneTitle: t['milestone_2_title'],
            milestoneContent: t['milestone_2_content']
        },
        {
            year: t['milestone_3_year'],
            milestoneTitle: t['milestone_3_title'],
            milestoneContent: t['milestone_3_content']
        },
        {
            year: t['milestone_4_year'],
            milestoneTitle: t['milestone_4_title'],
            milestoneContent: t['milestone_4_content']
        },
        {
            year: t['milestone_5_year'],
            milestoneTitle: t['milestone_5_title'],
            milestoneContent: t['milestone_5_content']
        },
    ],
    licensingTitle: t['licensing_title'],
    licensingContents: [
        t['licensing_content_1'](environment.platformName),
        t['licensing_content_2'](environment.platformName),
    ]
}

export enum ClickEvent {
    TO_INDEX
}

export const useCompanyProfileBase = () => {
    const {onClickToWallet, onClickToActivity, onClickToIndex} = usePageNavigate();
    const uiState: ICompanyProfileState = useMemo(() => {
        return {
            ...initializationState,
        };
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