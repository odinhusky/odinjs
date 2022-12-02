import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

// # API
import { getBianceLimitedDepth } from 'api';

// % context
import { useGlobalCtx } from '@/components/Layout/GlobalContext';

// ? Self-packed Components || Functions
// import { COLORS } from '@/constants/colors';
import { SwitchOrderDrawer } from '@/pages/Deal/components/SwitchOrderDrawer';
import { DealPriceAsks } from '@/pages/Deal/components/DealPriceAsks';
import { DealPriceBids } from '@/pages/Deal/components/DealPriceBids';
import { DealPriceAndRemarkPrice } from '@/pages/Deal/components/DealPriceAndRemarkPrice';
import { DealPriceFoot } from '@/pages/Deal/components/DealPriceFoot';

// ^ Plugins
import { isEmpty } from 'lodash';

// = Styled Component
import {
  DealPriceContainer
} from '@/styled-components/deal';

interface DealPriceZoneProps {
  symbol: string;
  price: string;
  remarkPrice: string;
}
/**
 * @author odin
 * @level Layout/Deal/DealPriceZone
 * @description 交易頁面中間右半部 價格 vs 數量，包含最新價以及預訂價格
*/
export const DealPriceZone = ({
  symbol,
  price,
  remarkPrice
}: DealPriceZoneProps) => {

  // % context
  // 當前選擇的幣別
  const {
    handleAPIErr
  } = useGlobalCtx();

  // # states

  // 綠色
  const [bidsArray, setBidsArray] = useState([]);

  // 紅色
  const [asksArray, setAsksArray] = useState([]);

  // 當前交易對 標記價格
  const [isOpenOrderDrawer, setIsOpenOrderDrawer] = useState<boolean>(false);

  // 切換交易順序的狀態
  // - 0 => default: 兩者都有，價格在中間
  // - 1 => buy order: 價格在上，再來才是綠色的 bidsArray
  // - 2 => sell order: 紅色的 asksArray，再來才是價格
  const [switchStatus, setSwitchStatus] = useState<number>(0);

  // - methods
  /**
   * @author odin
   * @description 改變選定的 order 順序並且關閉 Drawer
  */
  const handleSwitchOrder = (status: number) => {
    setSwitchStatus(status);
    setIsOpenOrderDrawer(false);
  };

  /**
   * @author odin
   * @description 處理 API 的資料
  */
  const handleDepthData = useCallback((depthRes: any) => {
    // console.log('depthRes', depthRes);
    if(isEmpty(depthRes) || isEmpty(depthRes.data)) return;

    const { asks, bids } = depthRes.data;

    switch(switchStatus) {
      case 0:
        setBidsArray(bids.slice(0, 8));
        setAsksArray(asks.slice(0, 8));
        break;
      case 1:
        setBidsArray(bids);
        break;
      case 2:
        setAsksArray(asks);
        break;
    }
  }, [switchStatus]);

  /**
   * @author odin
   * @description 取得碧安 API 的資料
  */
  const handleGetDepth = useCallback(async (symbol: string) => {
    try {
      const depthRes = await getBianceLimitedDepth(symbol, 16);

      handleDepthData(depthRes);

    } catch (e) {
      console.log(e);
      handleAPIErr(e);
    }
  }, [handleAPIErr, handleDepthData]);

  /**
   * @author odin
   * @description 依照 switchStatus 來決定畫面要呈現怎麼樣的排版
  */
  const renderTemplate = () => {
    switch (switchStatus) {
      case 0:
        return (
          <>
            <DealPriceAsks
              asksArray={asksArray}
            />

            <DealPriceAndRemarkPrice
              price={price}
              remarkPrice={remarkPrice}
            />

            <DealPriceBids
              bidsArray={bidsArray}
            />
          </>
        );
      case 1:
        return (
          <>
            <DealPriceAndRemarkPrice
              price={price}
              remarkPrice={remarkPrice}
            />

            <DealPriceBids
              bidsArray={bidsArray}
            />
          </>
        );
      case 2:
        return (
          <>
            <DealPriceAsks
              asksArray={asksArray}
            />

            <DealPriceAndRemarkPrice
              price={price}
              remarkPrice={remarkPrice}
            />
          </>
        );
    }
  };

  // * hooks
  /**
   * @author odin
   * @description 一開始取得資料，且每三秒更新一次
  */
  useEffect(() => {
    handleGetDepth(symbol);

    const getDepthInterval = setInterval(() => {
      handleGetDepth(symbol);
    }, 3000);

    return function cleanUp () {
      clearInterval(getDepthInterval);
    }
  }, [symbol, handleGetDepth]);

  return (
    <>
      <DealPriceContainer>
        { renderTemplate() }

        <DealPriceFoot
          switchStatus={switchStatus}
          setIsOpenOrderDrawer={setIsOpenOrderDrawer}
        />
      </DealPriceContainer>

      {/* 改變交易對順序的 Drawer */}
      <SwitchOrderDrawer
        isOpen={isOpenOrderDrawer}
        onClose={() => { setIsOpenOrderDrawer(false) }}
        status={switchStatus}
        handleSwitchOrder={handleSwitchOrder}
      />
    </>
  )
};

export default DealPriceZone;
