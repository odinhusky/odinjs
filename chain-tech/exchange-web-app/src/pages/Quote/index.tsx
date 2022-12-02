import {
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';

// # API
import {
  getFavoriteList,
  getAllDealList,
  addFavorite,
  removeFavorite
} from 'api';

// % context
import { PriceContext } from '@/store/select-context';
import { useGlobalCtx } from '@/components/Layout/GlobalContext';
import { QuoteCtxProvider } from './QuoteContext';

// ^ Types
import {
  MarketObjType,
  HotShowData,
  QuoteUnit,
  FavObj
} from '@/constants/type'

// ? Self-packed Components || Functions
import { CtrlBar, CtrlBarBtn } from '@/styled-components';
import Footer from '@/components/footer/HomeFooter';
import FavoritesListContent from './FavoritesListContent';
import FundFuturesContent from './FundFuturesContent';
import { handleLastPrice } from '@/common/methods';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import {
  useLocation
} from 'react-router-dom';
import { isEmpty, isNil, get } from 'lodash';

/**
 * @author odin
 * @level Layout/Quote
 * @description 行情頁面
*/
const Quote = () => {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation().pathname;

  // % context
  const { handleAPIErr, isLogin } = useGlobalCtx();
  const { marketObj } : MarketObjType = useContext(PriceContext);

  // # state
  // 目前 active 的是誰(favoritesList: 自選 | fundFutures: 合約)
  const [activeName, setActiveName] = useState<string>('favoritesList');

  // 自選 - 我的最愛列表
  const [favoriteList, setFavoriteList] = useState<string[] | []>([]);

  // 自選 - 我的最愛列表 - 跟 marketObj 處理後的資料
  const [favMarketList, setFavMarketList] = useState<Array<QuoteUnit> |any>([]);

  // 自選要顯示的列表
  const [favShowList, setFavShowList] = useState<Array<QuoteUnit> |any>([]);

  // 自選搜尋文字
  const [favoritesListSearchText, setFavoritesListSearchText] = useState<string>('');

  const [favObj, setFavObj] = useState<FavObj>({})

  // 合約 - 所有交易對列表
  const [fundList, setFundList] = useState<string[]>(['']);

  // 合約 - 跟 marketObj 處理後的資料
  const [fundMarketList, setFundMarketList] = useState<Array<HotShowData> |any>([]);

  // 合約 - 搜尋文字
  const [fundFuturesSearchText, setFundFuturesSearchText] = useState<string>('');

  // 合約 - 要顯示的列表
  const [fundShowList, setFundShowList] = useState<Array<HotShowData> |any>([]);

  // - methods
  /**
   * @author odin
   * @description 取得我的最愛列表並且 setState
  */
  const handleGetFavoriteList = useCallback(async () => {
    try {
      const res: any = await getFavoriteList();
      // console.log('getFavoriteList res', res);

      setFavoriteList(res);
    } catch (e) {
      // console.log('getFavoriteList Error', e);
      handleAPIErr(e);
    }
  }, [handleAPIErr]);

  /**
   * @author odin
   * @description 取得我的最愛列表並且 setState
  */
  const handleGetFundList = useCallback(async () => {
    try {
      const res: any = await getAllDealList();
      // console.log('getFundList res', res);

      setFundList(res);
    } catch (e) {
      console.log('getFundList Error', e);
      handleAPIErr(e);
    }
  }, [handleAPIErr]);

  /**
   * @author odin
   * @description 取得兩邊的資料更新
  */
  const getQuoteData = useCallback(() => {
    if(isLogin) handleGetFavoriteList();
    handleGetFundList();
  }, [handleGetFavoriteList, handleGetFundList, isLogin]);

  /**
   * @author odin
   * @param {string} dealName - 交易對的名稱
   * @description 加入我的最愛
  */
  const handleAddFav = useCallback(async (dealName: string) => {
    try {
      await addFavorite(dealName);

      getQuoteData();
    } catch (e) {
      console.log('e', e);
      handleAPIErr(e);
    }
  }, [handleAPIErr, getQuoteData]);

  /**
   * @author odin
   * @param {string} dealName - 交易對的名稱
   * @description 移除我的最愛
  */
  const handleRemoveFav = useCallback(async (dealName: string) => {
    try {
      await removeFavorite(dealName);

      getQuoteData();
    } catch (e) {
      console.log('e', e);
      handleAPIErr(e);
    }
  }, [handleAPIErr, getQuoteData]);

  /**
   * @author odin
   * @description 決定目前是要顯示哪一個 Tab Content
   * @return {ReactNode} 要輸出的 Component
  */
  const renderQuoteContent = () => {
    switch(activeName) {
      case 'favoritesList':
        return <FavoritesListContent
                  showList={favShowList}
                  handleRemoveFav={handleRemoveFav}
                  isLogin={isLogin}
                />;

      case 'fundFutures':
        return <FundFuturesContent
                showList={fundShowList}
                handleAddFav={handleAddFav}
                handleRemoveFav={handleRemoveFav}
              />;
    }
  };

  // & handled data
  // 控制 Bar 的按鈕
  const ctrlBarBtns = [
    {
      key: 0,
      name: 'favoritesList',
      text: t('favoritesList'),
      onClick: () => {
        setActiveName('favoritesList')
      }
    },
    {
      key: 1,
      name: 'fundFutures',
      text: t('fundFutures'),
      onClick: () => {
        setActiveName('fundFutures')
      }
    },
  ];

  // & handled data
  const quoteContextValue = {
    favoritesListSearchText,
    setFavoritesListSearchText,
    fundFuturesSearchText,
    setFundFuturesSearchText
  };

  // * hooks
  /**
   * @author odin
   * @description Quote Init
  */
  useEffect(() => {
    getQuoteData();
  }, [getQuoteData]);

  /**
   * @author odin
   * @description 根據 market 的資料重組需要的資料格式
  */
  useEffect(() => {
    // ! test
    if(isEmpty(marketObj)) return;

    // const favMarketResult : Array<QuoteUnit> = ['AAVE-USDT', 'AAV2-USDT'].map((name, index) => {
    const favMarketResult : Array<QuoteUnit> | any = favoriteList.map((name, index) => {

      const pairObj = marketObj[name];
      const isExist = !isNil(pairObj) && !isEmpty(pairObj);

      // console.log('name', name);
      // console.log('pairObj', pairObj);

      return {
        key: index,
        name: name,
        lastPrice: isExist ? handleLastPrice(pairObj.c) : '0',
        percentageIn24H: isExist ? pairObj.P : '0',
        isFav: true
      }
    });

    // console.log('favMarketResult', favMarketResult);

    const favObjResult: FavObj = favMarketResult.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: true
      }
    }, {});

    // console.log('favObjResult', favObjResult);

    setFavMarketList(favMarketResult);
    setFavObj(favObjResult);
  }, [favoriteList, marketObj]);

  /**
   * @author odin
   * @description 過濾 - 自選要顯示的列表
  */
  useEffect(() => {
    const result : Array<HotShowData> | any = favMarketList.filter(({ name }: any) => {
      return name.includes(favoritesListSearchText);
    });

    setFavShowList(result);
  }, [favMarketList, favoritesListSearchText]);

  /**
   * @author odin
   * @description 根據 market 的資料重組需要的資料格式
  */
  useEffect(() => {
    if(isEmpty(fundList) || isEmpty(marketObj)) return;

    const fundMarketResult : Array<HotShowData> | any = fundList.map((name, index) => {
      const pairObj = marketObj[name];
      const isExist = !isNil(pairObj) && !isEmpty(pairObj);
      return {
        key: index,
        name: name,
        lastPrice: isExist ? handleLastPrice(pairObj.c) : '0',
        percentageIn24H: isExist ? pairObj.P : '0',
        isFav: get(favObj, `${name}`, false)
      }
    });

    setFundMarketList(fundMarketResult);
  }, [fundList, marketObj, favObj]);

  /**
   * @author odin
   * @description 做過 - 自選要顯示的列表
  */
  useEffect(() => {
    if(isEmpty(fundMarketList)) return;

    const result : Array<HotShowData> | any = fundMarketList.filter(({ name }: any) => {
      return name.includes(fundFuturesSearchText);
    });

    setFundShowList(result);
  }, [fundMarketList, fundFuturesSearchText]);

  return (
    <QuoteCtxProvider value={quoteContextValue}>
      {/* 控制 Bar */}
      <CtrlBar>
        {
          !isEmpty(ctrlBarBtns) && (
            ctrlBarBtns.map(item => (
              <CtrlBarBtn
                key={item.key}
                active={item.name === activeName}
                onClick={item.onClick}
              >
                { item.text }
              </CtrlBarBtn>
            ))
          )
        }
      </CtrlBar>

      {/* 內容 */}
      { renderQuoteContent() }

      <Footer locationPage={location} />
    </QuoteCtxProvider>
  );
};

export default Quote;
