import { POST_WHEEL_CONFIG_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  allRechargeWheelLevels,
  rechargeWheelLevelMapping,
  RechargeWheelLevelType,
} from '@mode2/@types/rechargeWheelLevelTypes';

interface RewardResponse {
  id?: number;
  amount?: number; //  金額 或 spin 次數
  category?: number; // [1, 2]
  icon?: number;
  level?: number; // [1,2,3,4]
  name?: string; // 用不到
}

interface RoadmapResponse {
  amount?: number;
  level?: number; // [1,2,3,4 ]
  threshold?: number;
}

interface WheelLevelResponse {
  level?: number;
  rewards?: RewardResponse[];
  roadmaps?: RoadmapResponse[];
}

interface WheelConfigResponse {
  levels?: WheelLevelResponse[];
}

export enum WheelSegmentCategoryResult {
  AMOUNT = 'AMOUNT', // 1
  SPIN = 'SPIN', // 2
}

const wheelSegmentCategoryMapping: Record<number, WheelSegmentCategoryResult> =
  {
    [1]: WheelSegmentCategoryResult.AMOUNT,
    [2]: WheelSegmentCategoryResult.SPIN,
  };

export interface WheelSegmentResult {
  id: number;
  icon: number;
  wheelLevel: RechargeWheelLevelType; // 獎勵等級 WheelLevelResult.TIER_GOLD,
  category: WheelSegmentCategoryResult; // 獎勵類型
  value: number | number[]; // amount or spin value
}

export interface LevelConfigResult {
  wheelLevel: RechargeWheelLevelType; // 轉盤等級
  maxReward: number; // 最大獎金
  wheelSegments: WheelSegmentResult[]; // 每個轉盤獎勵資訊 & 流水
}

export interface AnchorPointResult {
  requiredReward: number; // 所需獎勵
  receiveSpin: number; // 得到的spin數量
}

export interface ProgressConfigResult {
  wheelLevel: RechargeWheelLevelType; // 轉盤等級
  maxRequiredReward: number; // 最大所需獎勵
  anchorPointList: AnchorPointResult[]; // 錨點資訊
}

export interface WheelConfigResult {
  rechargeWheelMaxReward: number; // 所有輪盤最大獎勵
  levelConfigs: LevelConfigResult[]; // 4個階級的輪盤資訊
  progressConfigs: ProgressConfigResult[]; // ４個階級的進度資訊
}

// 以下為防呆資料作業  Start =======
const index0AnchorPoint = {
  requiredReward: 0,
  receiveSpin: 0,
};

const defaultWheelSegments: WheelSegmentResult[] = [0, 1, 2, 3, 4, 5, 6, 7].map(
  (item) => ({
    id: item,
    icon: item,
    wheelLevel: RechargeWheelLevelType.TIER_SILVER,
    category: WheelSegmentCategoryResult.AMOUNT,
    value: 0,
  })
);

const defaultAnchorPointList: AnchorPointResult[] = [
  index0AnchorPoint,
  {
    requiredReward: 10,
    receiveSpin: 0,
  },
];

// 生成 LevelConfig 防呆資訊
const generateLevelConfigResult = (
  level: RechargeWheelLevelType
): LevelConfigResult => {
  return {
    wheelLevel: level,
    maxReward: 0,
    wheelSegments: defaultWheelSegments,
  };
};

// 生成 ProgressConfig 防呆資訊
const generateProgressConfigResult = (
  level: RechargeWheelLevelType
): ProgressConfigResult => {
  return {
    wheelLevel: level,
    maxRequiredReward: 10,
    anchorPointList: defaultAnchorPointList,
  };
};

// 補齊缺失資料
const fullLevelConfigs = (
  levelConfigs: LevelConfigResult[]
): LevelConfigResult[] => {
  // 去除 levelConfigs 中重複的 wheelLevel
  const uniqueLevelConfigs = levelConfigs.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.wheelLevel === value.wheelLevel)
  );

  // 排查缺失的 WheelLevelResult
  const missingLevels = allRechargeWheelLevels.filter(
    (level) => !uniqueLevelConfigs.some((config) => config.wheelLevel === level)
  );

  // 透過 generateLevelConfigResult 生成預設資訊
  const missingConfigs: LevelConfigResult[] = missingLevels.map((level) =>
    generateLevelConfigResult(level)
  );

  // 合併現有資料與預設資料
  const completeLevelConfigs = [...uniqueLevelConfigs, ...missingConfigs];

  // 按照 WheelLevelResult 排序資料
  return completeLevelConfigs.sort((a, b) => a.wheelLevel - b.wheelLevel);
};

const fullProgressConfigs = (
  progressConfigs: ProgressConfigResult[]
): ProgressConfigResult[] => {
  // 去除 progressConfigs 中重複的 wheelLevel
  const uniqueProgressConfigs = progressConfigs.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.wheelLevel === value.wheelLevel)
  );

  // 排查缺失的 WheelLevelResult
  const missingLevels = allRechargeWheelLevels.filter(
    (level) =>
      !uniqueProgressConfigs.some((config) => config.wheelLevel === level)
  );

  // 透過 generateProgressConfigResult 生成預設資訊
  const missingConfigs: ProgressConfigResult[] = missingLevels.map((level) =>
    generateProgressConfigResult(level)
  );

  // 合併現有資料與預設資料
  const completeProgressConfigs = [...uniqueProgressConfigs, ...missingConfigs];
  // 按照 WheelLevelResult 排序資料
  return completeProgressConfigs.sort((a, b) => a.wheelLevel - b.wheelLevel);
};

const fullWheelSegments = (
  wheelSegments: WheelSegmentResult[]
): WheelSegmentResult[] => {
  // 处理逻辑：先截取前 8 个，后补足不足的部分
  const result = wheelSegments.slice(0, 8); // 截取最多 8 个数据
  while (result.length < 8) {
    // 如果不足 8 个，则添加默认数据
    result.push(...defaultWheelSegments);
  }

  return result.slice(0, 8);
};

// 以下為防呆資料作業  End =======

// Evan done
/**
 * 充值輪盤設定
 * @param builder
 * @constructor
 */
export const PostWheelConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WheelConfigResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WHEEL_CONFIG_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelConfigResponse>
): WheelConfigResult => {
  const resp = response?.Body;

  const levelConfigs: LevelConfigResult[] =
    resp?.levels?.flatMap((item) => {
      const level =
        rechargeWheelLevelMapping[item.level || 0] ||
        RechargeWheelLevelType.TIER_SILVER;

      // up to
      const maxReward =
        item.rewards?.reduce((max, item) => {
          const category =
            wheelSegmentCategoryMapping[item.category || 0] ||
            WheelSegmentCategoryResult.SPIN;
          const amount =
            category === WheelSegmentCategoryResult.AMOUNT
              ? item.amount || 0
              : 0;
          return Math.max(max, amount);
        }, 0) || 0;

      const wheelSegments: WheelSegmentResult[] =
        item.rewards?.map((item) => {
          const wheelLevel =
            rechargeWheelLevelMapping[item.level || 0] ||
            RechargeWheelLevelType.TIER_SILVER;
          const category =
            wheelSegmentCategoryMapping[item.category || 0] ||
            WheelSegmentCategoryResult.AMOUNT;
          return {
            id: item.id || 0,
            icon: item.icon || 0,
            wheelLevel: wheelLevel,
            category: category,
            value: item.amount || 0,
          };
        }) || [];
      const completeWheelSegments = fullWheelSegments(wheelSegments);
      return {
        wheelLevel: level,
        maxReward: maxReward,
        wheelSegments: completeWheelSegments,
      };
    }) || [];

  const progressConfigs: ProgressConfigResult[] =
    resp?.levels?.flatMap((item) => {
      const level =
        rechargeWheelLevelMapping[item.level || 0] ||
        RechargeWheelLevelType.TIER_SILVER;
      const maxRequiredReward =
        item.roadmaps?.reduce(
          (max, item) => Math.max(max, item.threshold || 0),
          0
        ) || 0;
      const anchorPointList: AnchorPointResult[] =
        item.roadmaps?.map((item) => {
          return {
            requiredReward: item.threshold || 0,
            receiveSpin: item.amount || 0,
          };
        }) || [];

      return {
        wheelLevel: level,
        maxRequiredReward: maxRequiredReward,
        anchorPointList: [index0AnchorPoint, ...anchorPointList],
      };
    }) || [];

  // 防呆處理
  const completeLevelConfigs = fullLevelConfigs(levelConfigs);
  const completeProgressConfigs = fullProgressConfigs(progressConfigs);
  const rechargeWheelMaxReward = completeLevelConfigs.reduce(
    (max, item) => Math.max(max, item.maxReward || 0),
    0
  );
  return {
    rechargeWheelMaxReward: rechargeWheelMaxReward,
    levelConfigs: completeLevelConfigs,
    progressConfigs: completeProgressConfigs,
  };
};

export default PostWheelConfigEndpoint;
