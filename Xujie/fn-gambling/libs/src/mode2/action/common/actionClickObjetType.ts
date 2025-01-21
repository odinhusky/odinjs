export type ActionClickObjType<PayLoadMap> = {
  [K in keyof PayLoadMap]: PayLoadMap[K] extends void
    ? () => void // 如果參數是 void 或 undefined，函數不需要參數
    : (arg: PayLoadMap[K]) => void;
};
