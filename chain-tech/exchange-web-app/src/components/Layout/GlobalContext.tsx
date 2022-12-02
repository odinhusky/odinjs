import { createCtx } from '@/common/methods';
import { FiatRate } from '@/constants/type';

interface GlobalContextInterface {
  isLogin: boolean;
  setIsLogin: Function;
  currencyUnit: string;
  handleCurrencyUnitChange: (currency: string) => void;
  nowRate: number;
  rateObj: FiatRate | {};
  handleAPIErr: (err: object | any) => void;
  setIsOpenCurrency: Function;
  currentLang: string;
  setIsOpenLangModal: Function;
  setIsOpenNotice: Function;
}

const [useCtx, Provider] = createCtx<GlobalContextInterface>();

export const useGlobalCtx = useCtx;
export const GlobalCtxProvider = Provider;