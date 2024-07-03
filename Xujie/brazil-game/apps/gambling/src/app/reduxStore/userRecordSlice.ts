import { GameItem } from "../ui/components-bs/GameTypeSection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetGameListResponseData } from "../external/GetGameListEndpoint";
import { AppLocalStorage } from "../persistant/localstorage";
import { AppLocalStorageKey } from "../persistant/AppLocalStorageKey";

interface IUserRecentState {
  currentGameIds: string[];
  userRecentGameList: GameItem[];
  userFavoriteGameIds: number[];
  userFavoriteGameList: GameItem[];
  currentLockData: { [ket: number]: boolean };
}

const initialState: IUserRecentState = {
  currentGameIds: [],
  userRecentGameList: [],
  userFavoriteGameIds: [],
  userFavoriteGameList: [],
  currentLockData: {},
};

const flatGameIds = (data: GetGameListResponseData): number[] => {
  const currentGameIds: number[] =
    data &&
    data?.label?.reduce((acc: any, currentType: string) => {
      const subGamesIds: number[] = data
        ? data.type[currentType]?.reduce((acc: any, currentSubType: string) => {
            const ids = data[currentType][currentSubType].map(
              (payload: { gameId: number }) => payload.gameId
            );
            return [...acc, ...ids];
          }, [])
        : [];
      return [...acc, ...subGamesIds];
    }, []);
  return currentGameIds;
};

const flatLockData = (
  data?: GetGameListResponseData
): { [key: number]: boolean } => {
  if (!data) return {};
  if (!data.label) return {};

  const allGameList = data.label.reduce((acc: any, currentType: string) => {
    const subGamesList = data.type[currentType]?.reduce(
      (acc: any, currentSubType: string) => {
        return [...acc, ...data[currentType][currentSubType]];
      },
      []
    );
    return [...acc, subGamesList];
  }, []);

  const lockData = allGameList.flatMap((items: any) => {
    return items.map((_item: any) => {
      return {
        gameId: _item.gameId,
        lock: _item.lock === true,
      };
    });
  });

  return lockData.reduce(
    (
      acc: { [key: number]: boolean },
      curr: { gameId: number; lock: boolean }
    ) => {
      acc[curr.gameId] = curr.lock;
      return acc;
    },
    {}
  );
};

const transformItemToUserFavorite = (item: GameItem): UserFavorite => ({
  gameId: Number(item.gameId),
  name: item.name || "",
  img: item.imageURL || "",
  label: item.label || "",
  type: item.type || "",
  lock: item.lock || false,
});

interface UserFavorite {
  gameId: number;
  img: string;
  label: string;
  name: string;
  type: string;
  lock: boolean;
}

interface FavoriteLocalArr {
  [key: string]: UserFavorite[];
}

interface UserInfo {
  user_id: number;
}

export const userRecentSlice = createSlice({
  name: "userRecent",
  initialState,
  reducers: {
    setUserRecentGameList: (
      state: IUserRecentState,
      action: PayloadAction<GetGameListResponseData>
    ) => {
      const gameData: GetGameListResponseData = action.payload;
      const currentGameIds: string[] = flatGameIds(gameData).map(
        (id) => `${id}`
      );
      const recentGameList: GameItem[] = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.gameRecentLocal) || "[]"
      );
      const filteredResult: GameItem[] = recentGameList.filter((item) =>
        currentGameIds.includes(`${item.gameId}`)
      );
      state.currentGameIds = currentGameIds;
      state.userRecentGameList = filteredResult;
    },
    findUserFavoriteGameList: (
      state: IUserRecentState,
      action: PayloadAction<GetGameListResponseData>
    ) => {
      const gameData: GetGameListResponseData = action.payload;
      const lockData = flatLockData(gameData);
      state.currentLockData = lockData;
      const currentGameIds: string[] = state.currentGameIds.map(
        (id) => `${id}`
      );
      const userInfo: UserInfo = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "{}"
      );
      const favoriteLocalArr: FavoriteLocalArr = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.favoriteLocalArr) || "{}"
      );
      const userFavoriteArr: UserFavorite[] =
        favoriteLocalArr[userInfo.user_id] || [];
      const filteredResult: GameItem[] = userFavoriteArr
        .filter((item) => currentGameIds.includes(`${item.gameId}`))
        .map((data) => {
          const item: GameItem = {
            ...data,
            // name:data.name,
            imageURL: data.img,
            gameId: `${data.gameId}`,
            lock: lockData[data.gameId] || false,
            // label: data.label,
            // type: data.type
          };
          return item;
        });
      state.userFavoriteGameList = filteredResult;
      state.userFavoriteGameIds = filteredResult.map((result) =>
        Number(result.gameId)
      );
    },
    setUserFavoriteGame: (
      state: IUserRecentState,
      action: PayloadAction<GameItem>
    ) => {
      const item = action.payload;
      if (item.gameId === undefined) return;
      const { currentGameIds } = state;
      const userInfo: UserInfo = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "{}"
      );
      const favoriteLocalArr: FavoriteLocalArr = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.favoriteLocalArr) || "{}"
      );
      const userFavoriteArr: UserFavorite[] =
        favoriteLocalArr[userInfo.user_id] || [];
      const isFavoriteID = userFavoriteArr?.find(
        (favoriteItem) => favoriteItem.gameId === Number(item.gameId)
      )?.gameId;
      const newUserFavoriteArr = isFavoriteID
        ? userFavoriteArr.filter(
            (favoriteItem) => `${favoriteItem.gameId}` !== `${isFavoriteID}`
          )
        : [transformItemToUserFavorite(item), ...userFavoriteArr];
      const newTotalFavoriteLocalArr = {
        ...favoriteLocalArr,
        [userInfo.user_id]: newUserFavoriteArr,
      };
      const lockData = state.currentLockData;
      const filteredResult: GameItem[] = newUserFavoriteArr
        .filter((item) => currentGameIds.includes(`${item.gameId}`))
        .map((data) => {
          const item: GameItem = {
            ...data,
            // name:data.name,
            imageURL: data.img,
            gameId: `${data.gameId}`,
            lock: lockData[data.gameId] || false,
            // label: data.label,
            // type: data.type
          };
          return item;
        });

      AppLocalStorage.setItem(
        AppLocalStorageKey.favoriteLocalArr,
        JSON.stringify(newTotalFavoriteLocalArr)
      );
      state.userFavoriteGameList = filteredResult;
      state.userFavoriteGameIds = filteredResult.map((result) =>
        Number(result.gameId)
      );
    },
  },
});
