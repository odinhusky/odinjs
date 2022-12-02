export interface MarketUnit {
  e: string;      // 事件類型
  E: number;      // 事件時間
  s: string;      // 交易對
  p: string;      // 24小時價格變化
  P: string;      // 24小時價格變化(百分比)
  w: string;      // 平均價格
  c: string;      // 最新成交價格
  v: string;      // 24小時內成交量
  m: string;      // 標記價格
};
export interface PriceUnit {
  P: string;      // 24小時價格變化(百分比)
  c: string;      // 最新成交價格
  m: string;      // 標記價格
  p: string;      // 24小時價格變化
  s: string;      // 交易對
  v: string;      // 24小時內成交量
  w: string;      // 平均價格
};

export interface HotShowData {
  key: number;
  name: string;
  lastPrice: string;
  percentageIn24H: string | number;
}
export interface QuoteUnit {
  key: number;
  name: string;
  lastPrice: string;
  percentageIn24H: string | number;
  isFav: boolean;
}

export interface MarketObjType {
  [propName: string]: MarketUnit | any;
}

export interface FavObj {
  [propName: string]: string | number | boolean;
}

export interface PriceCtxValueTypes {
  marketArr: Array<MarketUnit> | Array<PriceUnit>;
  marketObj: MarketObjType;
}
export interface FiatRate {
  twd: number;
  usd: number;
  cny: number;
  jpy: number;
  vnd: number;
  rub: number;
  eur: number;
  try: number;
  idr: number;
  php: number;
}