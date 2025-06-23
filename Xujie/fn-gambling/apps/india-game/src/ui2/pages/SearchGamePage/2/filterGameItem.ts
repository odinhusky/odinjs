import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';

/**
 * 搜索遊戲列表條件
 */
export enum SearchCondition {
  Fuzzy,
  AdvancedFuzzy,
  Precise,
  FuzzyPrecise,
}

export const FilterAllTag = 'ALL';

export const PassInputLength = 2;

const fuzzyMatch = (inputArr: string[], disPlayName: string) => {
  // 去空格，去重複
  const inputItems = [
    ...new Set(
      inputArr.flatMap((c) => {
        return c === ' ' ? [] : [c];
      })
    ),
  ];
  let currentIndex = 0;
  for (let i = 0; i < inputItems.length; i++) {
    const char = inputItems[i].toLowerCase();
    currentIndex = disPlayName.toLowerCase().includes(char) ? 1 : -1;
    if (currentIndex === -1) {
      return false;
    }
    currentIndex++; // move to next position
  }
  return true;
};

const fuzzyPreciseMatch = (input: string, disPlayName: string): boolean => {
  const sortedInput = input
    .trim()
    .replace(/\s+/g, '') // 移除空格
    .split('') // 拆成字元陣列
    .join('')
    .toLowerCase();

  const sortedDisPlayName = disPlayName
    .trim()
    .replace(/\s+/g, '') // 移除空格
    .split('') // 拆成字元陣列
    .join('')
    .toLowerCase();

  return sortedDisPlayName.includes(sortedInput);
};

export const filterGameByName = (
  metadata: GameListItemResult[],
  input: string,
  level: SearchCondition | SearchCondition[]
): GameListItemResult[] => {
  // 只允許英文字母 數字 以及中間有空格
  if (!/^[A-Za-z0-9 ]+$/.test(input)) {
    return [];
  }
  // 輸入長度限制
  if (input.replace(' ', '').trim().length < PassInputLength) {
    return [];
  }

  if (input === FilterAllTag) {
    return metadata;
  }

  const levels = Array.isArray(level) ? level : [level];

  return metadata.filter((item) => {
    const name = item.name || '';
    const platform = item.platform || '';
    const gameName = item.gameName || '';
    const displayName = name || platform || gameName;

    return levels.some((lv) => {
      switch (lv) {
        case SearchCondition.Fuzzy:
          return (
            fuzzyMatch(input.split(''), displayName) ||
            fuzzyMatch(input.split(''), platform)
          );
        case SearchCondition.AdvancedFuzzy:
          return (
            fuzzyMatch(input.split(''), displayName) ||
            fuzzyMatch(displayName.split(''), input) ||
            fuzzyMatch(input.split(''), platform) ||
            fuzzyMatch(platform.split(''), input)
          );
        case SearchCondition.Precise:
          return displayName === input;
        case SearchCondition.FuzzyPrecise:
          return fuzzyPreciseMatch(input, displayName);
        default:
          return false;
      }
    });
  });
};
