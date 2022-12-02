import React, {
  useState,
  useEffect,
  useMemo
} from "react";

// # API
import api from "@/common/api";

// % context
import { useGlobalCtx } from '@/components/Layout/GlobalContext';

// ? Self-packed Components || Functions
import Footer from "@/components/footer/HomeFooter";

// content
import FundContent from '@/pages/fund/components/FundContent';
import Spot from "@/pages/fund/components/Spot";
import Contract from "@/pages/fund/components/Contract";
import Fiat from "@/pages/fund/components/Fiat";

// ^ Plugins
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isEmpty } from 'lodash';

// = Styled Component
import {
  PageContainer,
  Header,
  HeaderButton
} from '@/styled-components/fund';

/**
 * @author odin
 * @level Layout/Fund
 * @description 資金頁面
*/
export const Fund = () => {

  // $ init data
  const { t } = useTranslation();
  const location = useLocation().pathname;

  // % context
  const { isLogin, nowRate, currencyUnit } = useGlobalCtx();

  // # states
  const [type, setType] = useState(0);
  const [total, setTotal] = useState(0);

  // const [futures, setFutures] = useState(0);
  // const [spot, setSpot] = useState(0);
  // const [profitAndLoss,setProfitAndLoss] = useState(0)
  // const [fiat, setFiat] = useState(0);

  // - methods
  function getFund(){
    api.get("/investor/property").then(x=>{
      if(x.status !== 400){
        console.log('/investor/property x', x);
        setTotal(x.data.spot.equityValue+x.data.futures.balance)
        // setFutures(x.data.futures.balance)
        // setSpot(x.data.spot.equityValue)
      }
    })
    // let user = JSON.parse(localStorage.getItem("user")!)
  //   api.get("/otc/api/user/"+user.account).then( x=>{
  //     if(x.status !== 400){
  //       for(let i =0;i<x.wallet.coins.length;i++){
  //         if(x.wallet.coins[i].symbol === "USDT"){
  //           setFiat(x.wallet.coins[i].balance)
  //         }
  //       }
  //     }
  //   })
  };

  // const getPosition = () => {
  //   api.get("/investor/position").then((x) => {
  //     if(x.status !== 400){
  //       if(x.data.length !== 0){
  //         setProfitAndLoss(x.data[0].profitAndLoss)
  //       }
  //     }
  //   })
  // };

  // & handled data
  const headerBtns = useMemo(() => [
    // 總攬
    {
      key: 0,
      text: t("fundOverview"),
      isActive: type === 0,
      onClick: () => { setType(0) }
    },
    // 現貨
    {
      key: 1,
      text: t("fundSpot"),
      isActive: type === 1,
      onClick: () => { setType(1) }
    },
    // 合約
    {
      key: 2,
      text: t("futuresList"),
      isActive: type === 2,
      onClick: () => { setType(2) }
    },
    // 法幣
    {
      key: 3,
      text: t("fundFiat"),
      isActive: type === 3,
      onClick: () => { setType(3) }
    }
  ], [type, t]);

  // * hooks
  useEffect(()=>{
    if(isLogin){
      getFund();
    }
  },[isLogin]);

  return (
    <PageContainer>
      <div>
        <Header>
          {
            !isEmpty(headerBtns) && (
              headerBtns.map(({ key, text, isActive, onClick } : any) => (
                <HeaderButton
                  key={key}
                  isActive={isActive}
                  onClick={onClick}
                >
                  { text }
                </HeaderButton>
              ))
            )
          }
        </Header>
        {type === 0 && (
          <FundContent
            total={total}
            setType={setType} />
        )}
        {type === 1 && (
          <Spot
            isLogin={isLogin}
            nowRate={nowRate}
            currencyUnit={currencyUnit} />
        )}
        {type === 2 && (
          <Contract
            isLogin={isLogin}
            nowRate={nowRate}
            currencyUnit={currencyUnit} />
        )}
        {type === 3 && (
          <Fiat
            isLogin={isLogin}
            nowRate={nowRate}
            currencyUnit={currencyUnit} />
        )}
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default Fund;