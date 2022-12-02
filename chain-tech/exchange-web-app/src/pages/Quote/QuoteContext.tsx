import { createCtx } from '@/common/methods';

interface QuoteContextInterface {
  favoritesListSearchText: string;
  setFavoritesListSearchText: Function;
  fundFuturesSearchText: string;
  setFundFuturesSearchText: Function;
}

const [useCtx, Provider] = createCtx<QuoteContextInterface>();

export const useQuoteCtx = useCtx;
export const QuoteCtxProvider = Provider;