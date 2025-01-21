import {
  fillGameListItemMissingValues,
  GameListItemResult,
} from '@mode2/zustand/page/hallPageStore';

export const generateGameList = (
  count: number,
  enterGameType: number = 1
): GameListItemResult[] => {
  return Array.from({ length: count }, (_, index) =>
    fillGameListItemMissingValues({
      coverImageSrc: '',
      enterGameType,
      gameId: index + 1,
      gameName: '',
      isFavorite: false,
      isHotGame: true,
      manufacturer: 'EVOLUTION',
      manufacturerLogoUrl: '',
      name: `Test${index + 1}`,
      platform: '',
      platformId: index + 1,
      type: 1,
    })
  );
};
