export interface RenderProps<DataType> {
  isAchieve: boolean;
  data: DataType;
  index: number;
  isLast: boolean;
}

export interface AnchorObj<DataType> {
  dataList: DataType[];
  render: (props: RenderProps<DataType>) => React.ReactNode;
  classNameObj?: {
    itemClass?: string;
    otherItemClass?: string;
    firstItemClass?: string;
    lastItemClass?: string;
  };
}

export interface ProgressAnchorsObj<
  TopDataType = undefined,
  BottomDataType = undefined
> {
  totalAnchorList: number[]; // 0~100 的數字
  top?: AnchorObj<TopDataType>;
  bottom?: AnchorObj<BottomDataType>;
}

export interface ProgressAnchorsProps<
  TopDataType = undefined,
  BottomDataType = undefined
> {
  percent: number; // 0~100 的數字
  size?: number; // px 為單位
  progressStrokeColor?: string;
  progressTrailColor?: string;
  anchors: ProgressAnchorsObj<TopDataType, BottomDataType>; // 錨點資料
  baseProgressClassObj?: {
    trailClass?: string;
    strokeClass?: string;
    containerClass?: string;
  };
  anchorListClassObj?: {
    unAchieveAnchorClass?: string;
    achieveAnchorClass?: string;
    className?: string;
    firstAnchorClass?: string;
    lastAnchorClass?: string;
    otherAnchorClass?: string;
  };
  customAnchorNode?: (isAchieve: boolean) => React.ReactNode;
  isShowZeroAnchor?: boolean;
}
