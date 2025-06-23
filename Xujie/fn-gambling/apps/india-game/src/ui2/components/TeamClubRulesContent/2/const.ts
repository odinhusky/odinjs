import { I18NContent } from '@libs/mode2/@types/i18nType';

// = classes & styles

// - Table
export const teamClubLevelToText: Record<number, I18NContent> = {
  1: { i18nKey: 'earn_rules_club_level_1' },
  2: { i18nKey: 'earn_rules_club_level_2' },
  3: { i18nKey: 'earn_rules_club_level_3' },
  4: { i18nKey: 'earn_rules_club_level_4' },
};

// $ Data
export const estimateIncomeList = [
  {
    id: 'income-1',
    order: 1,
    totalBet: 200000,
    upTo: 20000,
  },
  {
    id: 'income-2',
    order: 2,
    totalBet: 2000000,
    upTo: 300000,
  },
  {
    id: 'income-3',
    order: 3,
    totalBet: 20000000,
    upTo: 3000000,
    upToSuffix: '+',
  },
];
