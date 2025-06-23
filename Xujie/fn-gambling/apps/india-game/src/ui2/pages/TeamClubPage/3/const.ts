import { I18NContent } from '@libs/mode2/@types/i18nType';

// = classes & styles
// - Table
export const teamClubLevelToText: Record<number, I18NContent> = {
  1: { i18nKey: 'earn_rules_club_level_1' },
  2: { i18nKey: 'earn_rules_club_level_2' },
  3: { i18nKey: 'earn_rules_club_level_3' },
  4: { i18nKey: 'earn_rules_club_level_4' },
};
export const clubLevelTable: Record<
  number,
  {
    levelText: string;
    mainThemeVariableName: string;
    mainThemeClass: string;
    subThemeClass: string;
    borderThemeClass: string;
    src: string;
  }
> = {
  1: {
    levelText: 'Bronze Club',
    // mainThemeVariableName: '--base-2-variant4',
    mainThemeVariableName: '--base-2-variant3',
    mainThemeClass: 'bgi-[var(--base-1-main)]',
    subThemeClass: 'bgi-[var(--base-1-50)]',
    borderThemeClass: 'bgi-border-[var(--base-1-light)]',
    src: 'club_leve_1',
  },
  2: {
    levelText: 'Silver Club',
    // mainThemeVariableName: '--base-2-variant4',
    mainThemeVariableName: '--base-2-variant3',
    mainThemeClass: 'bgi-[var(--base-3-main)]',
    subThemeClass: 'bgi-[var(--base-3-50)]',
    borderThemeClass: 'bgi-border-[var(--base-3-light)]',
    src: 'club_leve_2',
  },
  3: {
    levelText: 'Gold Club',
    // mainThemeVariableName: '--base-2-variant4',
    mainThemeVariableName: '--base-2-variant3',
    mainThemeClass: 'bgi-[var(--game-2-main)]',
    subThemeClass: 'bgi-[var(--game-2-50)]',
    borderThemeClass: 'bgi-border-[var(--game-2-light)]',
    src: 'club_leve_3',
  },
  4: {
    levelText: 'Diamond Club',
    // mainThemeVariableName: '--base-2-variant4',
    mainThemeVariableName: '--base-2-variant3',
    mainThemeClass: 'bgi-[var(--game-3-main)]',
    subThemeClass: 'bgi-[var(--game-3-50)]',
    borderThemeClass: 'bgi-border-[var(--game-3-light)]',
    src: 'club_leve_4',
  },
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
    upTo: 6000000,
    upToSuffix: '+',
  },
];
