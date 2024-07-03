import { useEffect, useMemo } from "react";
import { useGetGameListQuery } from "../../index";

type GroupGame = {
  label: string; // 群組標籤
  items: Game[]; // 節點資料
  subNodes?: GroupGame[]; // 子節點
};

export type Game = {
  id: number; // 遊戲ID
  name: string; // 遊戲名稱
  level: string; // TODO
  provide: string; // 遊戲廠商
  gameType: string; // 遊戲類型
  order: number; // TODO
  isLock: boolean; // 是否禁止使用
};

enum AssemblyType {
  PROVIDE,
  GAME_TYPE,
}

type GameListResult = {
  gameTypes: string[]; // 條列遊戲類型
  provideList: string[]; // 條列遊戲供應商
  gameTypeGroup: GroupGame[]; // 依照類型分類
  provideGroup: GroupGame[]; // 依照供應商 分類
  flatGameList: Game[]; // 扁平所有遊戲
};

export type GameTypeResponse = {
  [key: string]: GameResponse[] | undefined;
};

export type GameResponse = {
  gameId?: number;
  name?: string;
  level?: string;
  label?: string;
  type?: string;
  order?: number;
  lock?: boolean;
};

const defResult: GameListResult = {
  gameTypes: [],
  provideList: [],
  gameTypeGroup: [],
  provideGroup: [],
  flatGameList: [],
};

const useGameListTransform = () => {
  const { data: userGameList, ...rest } = useGetGameListQuery(
    { id: 100 },
    {
      pollingInterval: 0,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
    }
  );

  /**
   * 群組資料結構
   * @param gameList
   * @param type
   */
  const groupByTypHelper = (gameList: Game[], type: AssemblyType) => {
    return gameList.reduce((acc: GroupGame[], curr: Game) => {
      const declare =
        type === AssemblyType.GAME_TYPE ? curr.gameType : curr.provide;
      const existingGroup = acc.find((group) => group.label === declare);
      if (existingGroup) {
        existingGroup.items.push(curr);
      } else {
        acc.push({
          label: declare,
          items: [curr],
        });
      }
      return acc;
    }, []);
  };

  const result: GameListResult = useMemo(() => {
    if (!userGameList?.data) return defResult;

    const resp = userGameList.data;

    /**
     * 遊戲類型列表
     * 合併可能遺漏的資訊
     */
    const typeLabels = resp.type ? Object.keys(resp.type) : [];
    const labels = resp.label ? resp.label : [];
    const gameTypes: string[] = Array.from(new Set([...typeLabels, ...labels]));

    /**
     * 遊戲廠商列表
     * 避免重複，做去重
     */
    const provideList: string[] = resp.type
      ? [
          // ...new Set(Object.values(resp.type).flatMap((values) => (values ? values : []))),
          ...new Set(
            Object.entries(resp.type).flatMap(([key, value]) => {
              return value.map((item) => {
                return item.replace(`-${key}`, "");
              });
            })
          ),
        ]
      : [];

    /**
     * 扁平遊戲列表
     * 適用：搜索遊戲，By Case
     */
    const flatGameList: Game[] = Object.entries(resp)
      .filter(([key, value]) => key !== "label" && key !== "type")
      .flatMap(([key, value]) => {
        const gameTypeResponse: GameTypeResponse | undefined =
          value instanceof Object ? (value as GameTypeResponse) : undefined;
        return gameTypeResponse
          ? Object.values(gameTypeResponse).flatMap((item) => {
              return item
                ? item
                    .filter(
                      (item) =>
                        item.gameId !== undefined && item.name !== undefined
                    )
                    .map((item) => {
                      const provide = item.type?.replace(`-${item.label}`, "");
                      return {
                        id: item.gameId || 0,
                        name: item.name || "",
                        level: item.level || "",
                        provide: provide || "",
                        gameType: item.label || "",
                        order: item.order || 0,
                        isLock: item.lock || false,
                      };
                    })
                : [];
            })
          : [];
      });

    /**
     * 主層：依照遊戲類型
     * 子層：依照主層結果，分類遊戲廠商
     * 適用：目前首頁先分類遊戲類型
     */
    const gameTypeGroup: GroupGame[] = flatGameList
      ? groupByTypHelper(flatGameList, AssemblyType.GAME_TYPE).map((item) => {
          return {
            label: item.label,
            items: item.items,
            subNodes: groupByTypHelper(item.items, AssemblyType.PROVIDE),
          };
        })
      : [];

    /**
     * 主層：依照遊戲廠商分類
     * 子層：依照主層結果，分類遊戲類型
     */
    const provideGroup: GroupGame[] = flatGameList
      ? groupByTypHelper(flatGameList, AssemblyType.PROVIDE).map((item) => {
          return {
            label: item.label,
            items: item.items,
            subNodes: groupByTypHelper(item.items, AssemblyType.GAME_TYPE),
          };
        })
      : [];

    return {
      gameTypes: gameTypes,
      provideList: provideList,
      gameTypeGroup: gameTypeGroup,
      provideGroup: provideGroup,
      flatGameList: flatGameList,
    };
  }, [userGameList]);

  return {
    ...result,
    ...rest,
  };
};

export default useGameListTransform;
