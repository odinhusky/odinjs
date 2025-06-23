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
    mainThemeVariableName: '--base-2-variant4',
    mainThemeClass: 'bgi-[var(--base-1-main)]',
    subThemeClass: 'bgi-[var(--base-1-50)]',
    borderThemeClass: 'bgi-border-[var(--base-1-light)]',
    src: 'club_leve_1',
  },
  2: {
    levelText: 'Silver Club',
    mainThemeVariableName: '--base-2-variant4',
    mainThemeClass: 'bgi-[var(--base-3-main)]',
    subThemeClass: 'bgi-[var(--base-3-50)]',
    borderThemeClass: 'bgi-border-[var(--base-3-light)]',
    src: 'club_leve_2',
  },
  3: {
    levelText: 'Gold Club',
    mainThemeVariableName: '--base-2-variant4',
    mainThemeClass: 'bgi-[var(--game-2-main)]',
    subThemeClass: 'bgi-[var(--game-2-50)]',
    borderThemeClass: 'bgi-border-[var(--game-2-light)]',
    src: 'club_leve_3',
  },
  4: {
    levelText: 'Diamond Club',
    mainThemeVariableName: '--base-2-variant4',
    mainThemeClass: 'bgi-[var(--game-3-main)]',
    subThemeClass: 'bgi-[var(--game-3-50)]',
    borderThemeClass: 'bgi-border-[var(--game-3-light)]',
    src: 'club_leve_4',
  },
};
