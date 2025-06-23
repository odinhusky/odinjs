import { useEffect, useMemo } from 'react';
import { useDeepEffect } from '@commonUtils/hooks';
import {
  useMode2InvitePageStaticsStore,
  useMode2InvitePageTeamStore,
} from '@mode2/zustand/page/invitePageStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { handleInvitePageStaticsQAClick } from '@mode2/action/actionTypes';
import { usePostAgentWeekRewardConfigMutation } from '@mode2API/index';
import sdkUtils from '@libs/mode2/utils/sdk';

export const useMode2InvitePageStatics = () => {
  const { handleInvitePageClick } = useInvitePageActions();

  const [triggerFetchStatics, { data: staticsData }] =
    usePostAgentWeekRewardConfigMutation();

  // - Statistics Header List ========================

  const statisticsHeaderList = [
    {
      title: 'statics_1',
      desc: {
        i18nKey: 'earn_money_statistics_invite_more_invite_more_friends',
      },
      url: getImgUrl(EResourceLevel.V, 'statistics_step_1'),
    },
    {
      title: 'statics_2',
      desc: {
        i18nKey: 'earn_money_statistics_invite_more_we_advocate_benefits',
      },
      url: getImgUrl(EResourceLevel.V, 'statistics_step_2'),
    },
  ];

  const setStatisticsHeaderList = useMode2InvitePageStaticsStore(
    (state) => state.setStatisticsHeaderList
  );

  useDeepEffect(() => {
    setStatisticsHeaderList(statisticsHeaderList);
  }, [statisticsHeaderList]);

  // - Statistics Data List ========================

  const setStatisticsLevelExampleData = useMode2InvitePageStaticsStore(
    (state) => state.setStatisticsLevelExampleData
  );

  const rateInfo = useMode2InvitePageTeamStore((state) => state.rateInfo);

  useDeepEffect(() => {
    const exampleData = {
      level1: { name: 'A', betting: 10000000, percentage: rateInfo.level1 },
      level2: { name: 'A1', betting: 5000000, percentage: rateInfo.level2 },
      level3: { name: 'A2', betting: 3000000, percentage: rateInfo.level2 },
      exampleDataSource: [],
      rateResult:
        10000000 * rateInfo.level1 +
        5000000 * rateInfo.level2 +
        3000000 * rateInfo.level2,
    };
    setStatisticsLevelExampleData({
      ...exampleData,
      exampleDataSource: [
        exampleData.level1,
        exampleData.level2,
        exampleData.level3,
      ],
    });
  }, [rateInfo]);

  // - Weekly Data ========================
  // - Reward Data ========================
  const setWeeklyData = useMode2InvitePageStaticsStore(
    (state) => state.setWeeklyData
  );
  const setRewardDataList = useMode2InvitePageStaticsStore(
    (state) => state.setRewardDataList
  );

  useDeepEffect(() => {
    if (staticsData) {
      setWeeklyData([staticsData.weeklyRewardInfo]);
      setRewardDataList(staticsData.levelRewardInfoList);
    }
  }, [staticsData]);

  // - QA List ========================
  const setQaList = useMode2InvitePageStaticsStore((state) => state.setQaList);

  const qaDataList = useMemo(
    () => [
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_earn_commission_title_how_to_earn',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_earn_commission_content_send_your',
          },
          {
            className: 'text-lv',
            content: {
              i18nKey:
                'earn_money_statistics_accordion_earn_commission_content_lv1',
              i18nOption: {
                lv1Percentage: rateInfo.level1,
                lv2Percentage: rateInfo.level2,
              },
            },
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_earn_commission_content_the_winnings',
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_invite_friends_title_how_to_invite_friends',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_invite_friends_content_share_the_game',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_invite_friends_content_friends_must_click',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_invite_friends_content_registration_must_be',
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_weekly_salary_title_what_is_the_weekly',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_content_established_to_allow',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_content_the_higher',
            i18nOption: { Amount: '560,000' },
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_weekly_salary_agency_title_weekly_salary_agency',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_agency_content_we_have_divided',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_agency_content_upgrade_conditions',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_agency_accordion_content_weekly_salary_rewards',
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_improve_weekly_salary_title_how_to_improve',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_improve_weekly_salary_content_the_more_members',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_improve_weekly_salary_accordion_content_if_you_have_excellent',
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_convert_friends_title_how_to_convert_friends',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_convert_friends_content_log_in_to',
            i18nOption: { productName: sdkUtils.productName() },
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_convert_friends_content_indirect_members',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_convert_friends_content_when_your_direct',
          },
        ],
      },
      {
        question: {
          i18nKey:
            'earn_money_statistics_accordion_weekly_salary_rules_title_what_are_the_weekly_salary',
        },
        answer: [
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_active_users',
            i18nOption: { Amount: '2,000' },
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_your_reward',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_refer_as_many_friends',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_earn_lifetime',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_settlement',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_content_special_note',
          },
          {
            i18nKey:
              'earn_money_statistics_accordion_weekly_salary_rules_accordion_content_for_example',
            i18nOption: {
              aAmount: '2,000',
              bAmount: '2,000',
              abAmount: '2,000',
            },
          },
        ],
      },
    ],
    [rateInfo]
  );

  useDeepEffect(() => {
    const qaList = qaDataList.map((item, index) => ({
      ...item,
      action: () => {
        handleInvitePageClick({
          actionName: handleInvitePageStaticsQAClick,
          payload: {
            qaIndex: index,
          },
        });
      },
    }));
    setQaList(qaList);
  }, [qaDataList]);

  useEffect(() => {
    triggerFetchStatics();
  }, []);
};

export default useMode2InvitePageStatics;
