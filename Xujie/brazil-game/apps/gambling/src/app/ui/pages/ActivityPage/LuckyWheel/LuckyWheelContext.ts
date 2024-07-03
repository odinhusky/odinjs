import { Dispatch, SetStateAction } from "react";
import { IsAnimatingObjInterface } from "./luckyWheelTypes";
import { createCtx } from "../../../utils/createCtx";

export interface LuckyWheelContextInterface {
  isAnimatingObj: IsAnimatingObjInterface
  setIsAnimatingObj: Dispatch<SetStateAction<IsAnimatingObjInterface>>;
};

const [useCtx, Provider] = createCtx<LuckyWheelContextInterface>();

export const useLuckyWheelCtx = useCtx;
export const LuckyWheelCtxProvider = Provider;