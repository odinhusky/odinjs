import React, {
  useState,
  useEffect,
  useContext
} from "react";

// # API
import api from "@/common/api";

// % context
import { PositionContext, PriceContext } from "@/store/select-context";

// ? Self-packed Components || Functions
import Footer from "@/components/footer/HomeFooter";
import { COLORS } from "@/constants/colors";
import Modal from "@/components/UI/CoverModal";
import StopLossDrawer from "@/components/fund/StoplossDrawer";
import StopLossStopEarnDrawer from "@/components/fund/StopLossStopEarnDrawer";
import Drawer from "@/components/UI/Drawer";
import CurrentPositionCard from "@/components/UI/CurrentPositionCard";
import CurrentCommissionCard from "@/components/UI/CurrentCommissionCard";
import Slider from "@/components/UI/Slider";
import LeverSlider from "@/components/UI/leverSlider";
import OrderTypeDrawer from "@/components/fund/orderTypeDrawer";
import CounterpartyPriceDrawer from "@/components/fund/CounterpartyPriceDrawer";

import { DealPriceZone } from '@/pages/Deal/components/DealPriceZone';

// ^ Types & Interfaces
import {
  PriceCtxValueTypes
} from '@/constants/type'

// - Images
import search from "@/assets/icon/Deal/search.png";
import chart from "@/assets/icon/Deal/chart.png";
import transfer from "@/assets/icon/Deal/transfer.png";
import arrowDown from "@/assets/icon/Deal/arrowDown.png";
import noItemIcon from "@/assets/icon/illustration.png";
import cancel from "@/assets/icon/cancel.png";
import checkIcon from "@/assets/icon/Deal/check.png";
import minus from "@/assets/icon/Deal/remove.png";
import add from "@/assets/icon/Deal/add.png";
import buyBg from '@/assets/deal/buy_bg.jpg';
import sellBg from '@/assets/deal/sell_bg.jpg';

// ^ Plugins
import { isEmpty, find, get } from "lodash"
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay-ts";

// = Styled Component
import { FlexAlignCenterDiv } from '@/styled-components';
import {
  PageContainer,
  TitleContainer,
  TitleLeftButton,
  TitleRightButton,
  DealPairContainer,
  DealPairChange,
  ContractContainer,
  CurrentContractContainer,
  CurrentContractName,
  CurrentContractImageList,
  CurrentContractImage,
  CurrentContractButtonContainer,
  CurrentContractButton,
  TradeUnitButtonHalf,
  OperateContainer,
  OperateButtonList,
  TradeFunctionContainer,
  TradeFunctionLeftSide,
  OperateCurrencyButton,
  OperateDealBgContainer,
  OperateLeftButton,
  OperateRightButton,
  OperateUnitButton,
  DrawerFullWarehouseTitleContainer,
  DrawerFullWarehouseImage,
  DrawerFullWarehouseTitle,
  DrawerFullWarehouseSelectContainer,
  DrawerFullWarehouseSelectButton,
  DrawerFullWarehouseSelectTitle,
  DrawerFullWarehouseContent,
  DrawerFullWarehouseContentTitle,
  DrawerFullWarehouseContentDescription,
  DrawerFullWarehouseConfirm,
  DrawerLeverButtonContainer,
  DrawerLeverButtonTitle,
  DrawerLeverButtonImg,
  DrawerLeverSliderScale,
  DrawerLeverSliderScaleText,
  TradeFunctionLeftContainer,
  TradeFunctionLeftItem,
  CounterPriceItem,
  TradeFunctionDisplayContainer,
  TradeFunctionButtonContainer,
  TradeLeftFunctionButton,
  WareHousedPriceInputContainer,
  WareHousedPriceInput,
  WareHousedCountInput,
  WarehouseFunctionContainer,
  WarehouseTransferContainer,
  ConfirmContainer,
  ConfirmContentContainer,
  ConfirmContentTitle,
  ConfirmContent,
  ConfirmCheckbox,
  CheckboxCancel,
  CheckboxConfirm,
  AvailableTitle,
  AvailableContent
} from '@/styled-components/deal'

/**
 * @author odin
 * @level Layout/Deal
 * @description 交易頁面
*/
const Deal = () => {

  // $ init data
  const location = useLocation().pathname;

  // % context
  const context = useContext(PositionContext)
  const { marketArr } : PriceCtxValueTypes | any = useContext(PriceContext);

  // # states
  const [currencyOption, setCurrencyOption] = useState(0);
  const [dealOption, setDealOption] = useState(0);
  // const [currencyAmount, setCurrencyAmount] = useState(0);
  const [leverRatio, setLeverRatio] = useState(1);
  const [templeverRatio, setTempLeverRatio] = useState(1);
  const [leverDisplay, setLeverDisplay] = useState(0);
  const [wareHouseRatio] = useState(0);
  const [slider, setSlider] = useState(0);

  const [wareHousedrawerVisible, setWareHousedrawerVisible] = useState(false);
  const [leverVisible, setleverVisible] = useState(false);
  const [orderType, setOrderType] = useState(false);
  const [counterPartyPriceDrawer, setCounterPartyPriceDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [stopLossDrawerVisible, setStopLossDrawerVisible] = useState(false);
  // const [commissionFunctionSelect, setCommissionFunctionSelect] = useState(0);
  const [StopLossStopEarn, setStopLossStopEarn] = useState(false);
  const [revokeIsVisual, setRevokeIsVisual] = useState(false);

  const [fullWareHouseSelect, setFullWareHouseSelect] = useState(0);
  const [wareHouseUnitSelect, setWareHouseUnitSelect] = useState(0);
  const [orderTypeSelect, setOrderTypeSelect] = useState(0);
  const [counterPartyPrice, setCounterPartyPrice] = useState(0);
  const [wareHousedPrice, setWareHousedPrice] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [stopLoss, setStopLoss] = useState<string | number>("");
  const [stopLossPrice, setStopLossPrice] = useState<string | number>("");
  const [stopEarning, setStopEarning] = useState<string | number>("");
  const [stopEarningPrice, setStopEarningPrice] = useState<string | number>("");
  const { t } = useTranslation();
  const [fullWareHouseDisplay, setFullWareHouseDisplay] = useState(false);
  const [wareHouseUnitDisplay, setWareHouseUnitDisplay] = useState(false);
  const [functionLeftCheckbox, setFunctionLeftCheckbox] = useState(false);
  const [entrustArray, setEntrustArray] = useState([]);
  const [positionArray, setPositionArray] = useState([{
    "avgPrice": 0,
    "forceClose": 0,
    "leverage": 0,
    "lossPrice": 0,
    "margin": 0,
    "owner": "",
    "positionId": "",
    "profitAndLoss": 0,
    "profitPrice": 0,
    "quantity": 0,
    "side": "",
    "status": "",
    "symbol": "",
    "type": "",
  }]);

  const [inputPrice, setInputPrice] = useState("");
  const [loading, setLoading] = useState(false);
  // const [position, setPosition] = useState(false);
  const [future, setFuture] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [balance, setBalance] = useState(0);
  const [bestSellPrice, setBestSellPrice] = useState("");
  const [bestBuyPrice, setBestBuyPrice] = useState("");

  // 當前交易對名稱
  const [nowTrade, setNowTrade] = useState("BTC-USDT");

  // 當前交易對 24小時價格變化(百分比)
  const [nowChange, setNowChange] = useState(0);

  // 當前交易對 最新成交價格
  const [price, setPrice] = useState("");

  // 當前交易對 標記價格
  const [remarkPrice, setRemarkPrice] = useState("");

  const [, setMarketArray] = useState([]);
  const [canOpen, setCanOpen] = useState(0);

  // - methods
  const handleUnitOption = (index: number) => {
    setDealOption(index);
    console.log(functionLeftCheckbox);
    console.log(leverDisplay)
    console.log(bestSellPrice)
    console.log(bestBuyPrice)
  };

  const handlerDrawer = (type: string) => {
    setDrawerType(type);
    if (type === "Warehouse") {
      setFullWareHouseDisplay(!!fullWareHouseSelect);
      setWareHousedrawerVisible((v) => !v);
    } else if (type === "Unit") {
      setWareHouseUnitDisplay(!!wareHouseUnitSelect);
      setWareHousedrawerVisible((v) => !v);
    } else if (type === "lever") {
      setLeverDisplay(leverRatio);
      setleverVisible((v) => !v);
    } else {
      setWareHousedrawerVisible((v) => !v);
    }
  };

  const handlerCheckFullWarehouse = (type: number) => {
    setFullWareHouseSelect(type);
  };

  const handlerCheckFullWarehouseUnit = (type: number) => {
    setWareHouseUnitSelect(type);
  };

  const handlerCaculate = (move: string) => {
    move === "add" ? setTempLeverRatio((v) => v + 1) : setTempLeverRatio((v) => v - 1);
  };

  const handlerOrderDrawer = () => {
    setOrderType((v) => !v);
  };

  const getEntrust = () => {
    api.get("/investor/future?status=CREATE").then((x) => {
      setEntrustArray(x.data);
      for (let i = 0; i < x.data.length; i++) {
        if (x.data[i].status !== "CANCEL") {
          setFuture(true);
          return;
        }
      }
    })
    setInterval(() => {
      api.get("/investor/future?status=CREATE").then((x) => {
        setEntrustArray(x.data);
        // console.log(x.data);
        for (let i = 0; i < x.data.length; i++) {
          if (x.data[i].status !== "CANCEL") {
            setFuture(true);
            return;
          }
        }
      })
    }, 3000)
  };

  const getRemark = (s: string) => {
    const remark = find(marketArr, function (o) { return o.s === s })
    return remark!.m
  }

  const getPosition = () => {
    // api.get("/investor/position").then((x) => {
    //   console.log(x.data)
    //   setPositionArray(x.data.sort(function (a, b) {
    //     return a.positionId > b.positionId ? 1 : -1;
    //    }));
    //   for (let i = 0; i < x.data.length; i++) {
    //     if (x.data[i].status !== "CLOSE") {
    //       setPosition(true);
    //       return;
    //     }
    //   }
    // })
    // setInterval(() => {
    // api.get("/investor/position").then((x) => {
    //   setPositionArray(x.data.sort(function (a, b) {
    //     return a.positionId > b.positionId ? 1 : -1;
    //    }));

    //   for (let i = 0; i < x.data.length; i++) {
    //     if (x.data[i].status !== "CLOSE") {
    //       setPosition(true);
    //       return;
    //     }
    //   }
    // })},3000)
  };

  const getPrice = (symbol) => {
    // axios
    //   .get(`https://api1.binance.com/api/v3/ticker/price?symbol=${symbol}`)
    //   .then((x) => {
    //     setWareHousedPrice(x.data.price.slice(0, -6));
    //   });
    axios
      .get(`https://api1.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`)
      .then((x) => {
        setBestSellPrice(x.data.bidPrice);
        setBestBuyPrice(x.data.askPrice);
      });
  };

  const getBalance = (symbol: string, side: string) => {

    api.get(`/investor/margin-balance?symbol=${symbol}&side=${side}`).then((x) => {
      if (x.status !== 400 && x.status !== 401) {
        setBalance(x.data.toFixed(4));
      }
    });

    api.get(`/investor/available-quantity?symbol=${symbol}&side=${side}`).then((x) => {
      if (x.status !== 400 && x.status !== 401) {
        setCanOpen(x.data.toFixed(4));
      }
    });

  };

  // interface Position {
  //   positionId: string;
  //   owner: string;
  //   side: string;
  //   status: string;
  //   leverage: number;
  //   symbol: string;
  //   tagPrice: number;
  //   securityDeposit: number;
  //   profitAndLoss: number;
  //   type: string;
  //   avgPrice: number;
  //   quantity: number;
  //   margin: number;
  //   forceClose: number;
  // }

  interface Future {
    orderId: string;
    owner: string;
    side: string;
    symbol: string;
    status: string;
    origQty: number;
    avgPrice: number;
    executedQty: number;
    price: number;
    type: string;
    positionSide: string;
    leverage: number;
  }

  const getleverage = (symbol: string) => {
    api.get(`/investor/leverage/${symbol}`).then((x) => {
      // console.log(x.data)
      if (x.status !== 400 && x.status !== 401) {
        // setLeverageViewNum(x.data)
        setLeverRatio(x.data)
        setTempLeverRatio(x.data)
      }
    });
  };

  /**
   * @author odin
   * @description 改變單位
  */
  const handleUnitChange = (isUnitUSDT: boolean) => {
    setWareHouseUnitDisplay(isUnitUSDT);
    setInputPrice('');
    setSlider(0);
  };

  // * hooks
  /**
   * @author odin
   * @description 從 PriceContext 中拿到 webSocket 的資料更新畫面
   * 1. Remark Price
   * 2. Remark Change
  */
  useEffect(() => {
    if (!isEmpty(marketArr)) {
      let trade = localStorage.getItem("trade")
      const t = trade ? trade.split("-")[0] + "-USDT" : nowTrade
      const remark = find(marketArr, function (o) { return o.s === t });

      // console.log('marketArr', marketArr);
      const remarkChange = parseFloat(get(remark, 'P', 0));

      setRemarkPrice(remark ? remark!.m : "0")
      setPrice(remark ? remark!.c : "0");
      setNowChange(remarkChange);
    }
  }, [marketArr, nowTrade]);

  useEffect(() => {
    let trade = localStorage.getItem("trade")
    let market = localStorage.getItem("market")
    let array = JSON.parse(market!).market
    const t = trade ? trade.split("-")[0] + "-USDT" : nowTrade
    const remark = find(array, function (o) { return o.s === t })
    setWareHousedPrice(remark ? remark!.c.toString().slice(0, -2) : 0);
  }, [nowTrade])

  useEffect(() => {
    let inter = localStorage.getItem("interval")
    let trade = localStorage.getItem("trade")
    let market = localStorage.getItem("market")
    setMarketArray(JSON.parse(market!).market)

    if (trade) {
      setNowTrade(trade)
    }

    clearInterval(parseInt(inter!))

    if (localStorage.getItem("token")) {
      getEntrust();
      getPosition();
      getBalance(trade ? trade.split("-")[0] + "-USDT" : nowTrade, currencyOption === 0 ? "BUY" : "SELL")
      getleverage(trade ? trade.split("-")[0] + "-USDT" : nowTrade)
    }
    // if(localStorage.getItem("leverRatio")){
    //   setLeverRatio(parseInt(localStorage.getItem("leverRatio")!))
    //   setTempLeverRatio(parseInt(localStorage.getItem("leverRatio")!))
    // }
    getPrice(trade ? trade.split("-")[0] + "USDT" : nowTrade.split("-")[0] + "USDT");
    const interval = setInterval(() => {
      if (localStorage.getItem("token")) {
        getBalance(trade ? trade.split("-")[0] + "-USDT" : nowTrade, currencyOption === 0 ? "BUY" : "SELL")
        getPrice(trade ? trade.split("-")[0] + "USDT" : nowTrade.split("-")[0] + "USDT");
      }
    }, 2000);
    localStorage.setItem("interval", interval.toString())
    return () => clearInterval(interval);

  }, [nowTrade, currencyOption]);

  useEffect(() => {
    if (!isEmpty(context)) {

      console.log('context', context);
      setPositionArray(context)
    }
  }, [context])

  return (
    <>
      <LoadingOverlay active={loading} spinner>
        <PageContainer>
          <TitleContainer>
            <TitleLeftButton>{t("tradeFutures")}</TitleLeftButton>
            <Link to="/fiat-deal">
              <TitleRightButton>{t("tradeFiat")}</TitleRightButton>
            </Link>
          </TitleContainer>

          {/* 交易對 Container */}
          <DealPairContainer>
            <CurrentContractContainer>
              <CurrentContractName>
                {/* 搜尋 */}
                <Link to="/deal/search-deal">
                  <CurrentContractImage style={{ marginLeft: 0, marginRight: 10 }} src={search} alt="search" />
                </Link>

                {/* 交易對 */}
                <div style={{ marginRight: 10 }}>
                  {nowTrade}
                </div>

                {/* 變動％數 */}
                <DealPairChange nowChange={nowChange}>
                  {
                    nowChange >= 0
                      ? `+${nowChange}%`
                      : `${nowChange}%`
                  }
                </DealPairChange>
              </CurrentContractName>

              {/* 圖表按鈕連結 */}
              <CurrentContractImageList>
                <Link to="/deal/chart">
                  <CurrentContractImage src={chart} alt="chart" />
                </Link>
              </CurrentContractImageList>
            </CurrentContractContainer>
          </DealPairContainer>

          {/* 全倉以及倍數 */}
          <ContractContainer>
            <CurrentContractButtonContainer>
              <CurrentContractButton
                onClick={handlerDrawer.bind(null, "Warehouse")}
              >
                {fullWareHouseDisplay ? t("isolatedPosition") : t("crossPosition")}
              </CurrentContractButton>

              <CurrentContractButton
                onClick={() => {
                  handlerDrawer("lever")
                }}
              >
                {`${leverRatio ? Math.round(leverRatio) : 1}X`}
              </CurrentContractButton>
            </CurrentContractButtonContainer>
          </ContractContainer>

          {/* 操作 */}
          <OperateContainer orderTypeSelect={orderTypeSelect}>
            <OperateButtonList>

              <OperateDealBgContainer
                currencyOption={currencyOption}
                style={{
                  backgroundImage: `url(${currencyOption === 0 ? buyBg : sellBg})`,
                }}
              >
                {/* 買入 */}
                <OperateLeftButton
                  currencyOption={currencyOption}
                  index={0}
                  onClick={() => setCurrencyOption(0)}
                >
                  {t("buyOrder")}
                </OperateLeftButton>

                {/* 賣出 */}
                <OperateRightButton
                  currencyOption={currencyOption}
                  index={1}
                  onClick={() => setCurrencyOption(1)}
                >
                  {t("sellOrder")}
                </OperateRightButton>
              </OperateDealBgContainer>

              <OperateCurrencyButton
                style={{
                  fontSize: 12,
                  textAlign: "center"
                }}
                currencyOption={currencyOption}
                index={2}
              // onClick={() => setCurrencyOption(2)}
              >
                <p>{t("price")}</p>
                <p style={{ fontFamily: "Open Sans", fontWeight: 500 }}>{"(USDT)"}</p>
              </OperateCurrencyButton>
              <OperateCurrencyButton
                style={{
                  fontSize: 12,
                  marginRight: "-15px",
                  textAlign: "center"
                }}
                currencyOption={currencyOption}
                index={3}
              // onClick={() => setCurrencyOption(3)}
              >
                <p>{t("amount")}</p>
                <p style={{ fontFamily: "Open Sans", fontWeight: 500 }}>({nowTrade.split("-")[0]})</p>
              </OperateCurrencyButton>
            </OperateButtonList>

            {/* 交易內容區塊 */}
            <TradeFunctionContainer>
              <TradeFunctionLeftSide>
                <TradeFunctionLeftContainer orderTypeSelect={orderTypeSelect}>
                  {/* 限價 */}
                  <TradeFunctionLeftItem onClick={handlerOrderDrawer}>
                    <p style={{ color: COLORS.Dark_gray }}>
                      {orderTypeSelect === 0
                        ? t("limitedOrder")
                        : orderTypeSelect === 1
                          ? t("marketOrder")
                          : orderTypeSelect === 2
                            ? t("stopLimitOrder")
                            : t("stopMarketOrder")}

                    </p>
                    <img
                      src={arrowDown}
                      alt="arrow-down"
                      style={{ width: 10, height: 5 }}
                    />
                  </TradeFunctionLeftItem>

                  {/* 價格區塊，根據限價的其他選項而變動 */}
                  <TradeFunctionLeftItem style={{ padding: "10px 10px" }}>
                    {orderTypeSelect === 0 ? (
                      <WareHousedPriceInputContainer content="USDT">
                        <WareHousedPriceInput
                          overprice={
                            parseInt(wareHousedPrice) > 60000 ? true : false
                          }
                          value={wareHousedPrice}
                          onChange={(e) => {
                            setWareHousedPrice(e.target.value);
                          }}
                          placeholder={t("price")}
                        />
                      </WareHousedPriceInputContainer>
                    ) : orderTypeSelect === 1 ? (
                      <CounterPriceItem
                      // onClick={() => setCounterPartyPriceDrawer((v) => !v)}
                      >
                        <p style={{ color: COLORS.Mid_gray }}>
                          {counterPartyPrice === 0
                            ? t("marketOrder")
                            : `最優${counterPartyPrice}檔`}
                        </p>
                        {/* <img
                          src={arrowDown}
                          alt="arrow-down"
                          style={{ width: 10, height: 5 }}
                        /> */}
                        <p style={{ fontFamily: "Open Sans", fontWeight: 500 }}>USDT</p>
                      </CounterPriceItem>
                    ) : (
                      <WareHousedPriceInputContainer content="USDT">
                        <WareHousedPriceInput
                          overprice={false}
                          value={triggerPrice}
                          onChange={(e) => {
                            setTriggerPrice(e.target.value);
                          }}
                          placeholder={t("conditionPrice")}
                        />
                      </WareHousedPriceInputContainer>
                    )}
                  </TradeFunctionLeftItem>

                  {orderTypeSelect === 2 && (
                    <TradeFunctionLeftItem>
                      <WareHousedPriceInputContainer content="USDT">
                        <WareHousedPriceInput
                          overprice={
                            parseInt(wareHousedPrice) > 60000 ? true : false
                          }
                          value={wareHousedPrice}
                          onChange={(e) => {
                            setWareHousedPrice(e.target.value);
                          }}
                          placeholder={t("price")}
                        />
                      </WareHousedPriceInputContainer>
                    </TradeFunctionLeftItem>
                  )}

                  {/* 交易單位按鈕 */}
                  <TradeFunctionLeftItem>
                    {/* <TradeUnitButton onClick={handlerDrawer.bind(null, "Unit")}>
                      {wareHouseUnitDisplay ? "USDT" : nowTrade.split("-")[0]}
                    </TradeUnitButton> */}

                    {/* 現在交易對的名稱 */}
                    <TradeUnitButtonHalf isActive={!wareHouseUnitDisplay} onClick={() => { handleUnitChange(false) }}>
                      { nowTrade.split("-")[0] }
                    </TradeUnitButtonHalf>

                    {/* 現在交易對的名稱 */}
                    <TradeUnitButtonHalf isActive={wareHouseUnitDisplay}  onClick={() => { handleUnitChange(true) }}>
                      USDT
                    </TradeUnitButtonHalf>
                  </TradeFunctionLeftItem>

                  <TradeFunctionLeftItem>
                    {!!wareHouseRatio ? (
                      <div style={{ position: "relative" }}>
                        <input
                          value={`${inputPrice}%`}
                          style={{
                            background: "#F4F4F6",
                            border: "none",
                            color: "#383743",
                            fontSize: 15,
                            fontWeight: 500,
                          }}
                          onChange={(e) => {
                            setInputPrice(e.target.value);
                          }}
                        />
                        <p style={{ position: "absolute", top: 5, right: 12, fontWeight: 500, fontFamily: "Open Sans" }}>
                          USDT
                        </p>
                      </div>
                    ) : (
                      <WareHousedPriceInputContainer content={!wareHouseUnitDisplay ? `${nowTrade.split("-")[0]}(${slider}%)` : `USDT(${slider}%)`}>

                        <WareHousedCountInput
                          // style={{
                          //   color:
                          //   inputPrice > 0.2 ? COLORS.Red : "#8f8da2",
                          // }}
                          value={inputPrice}
                          onChange={(e) => {
                            if (localStorage.getItem("token")) {
                              if (wareHouseUnitSelect === 0) {
                                if (parseFloat(e.target.value) > balance * leverRatio / parseFloat(wareHousedPrice)) {
                                  var price = (balance * leverRatio / parseFloat(wareHousedPrice))
                                  setInputPrice(price.toString().substring(0, price.toString().indexOf(".") + 3));
                                  setSlider(100)
                                } else {
                                  setInputPrice(e.target.value);
                                  // console.log(e.target.value)
                                  setSlider(parseFloat(((parseFloat(e.target.value) * parseFloat(wareHousedPrice)) / (balance * leverRatio) * 100).toFixed(0)) ? parseFloat(((parseFloat(e.target.value) * parseFloat(wareHousedPrice)) / (balance * leverRatio) * 100).toFixed(0)) : 0)
                                }
                              } else {
                                if (parseFloat(e.target.value) > balance) {
                                  var usdtPrice = (balance)
                                  setInputPrice(usdtPrice.toString().substring(0, usdtPrice.toString().indexOf(".") + 3));
                                  setSlider(100)
                                } else {
                                  setInputPrice(e.target.value);
                                  // console.log(e.target.value)
                                  setSlider(parseFloat(((parseFloat(e.target.value)) / (balance) * 100).toFixed(0)) ? parseFloat(((parseFloat(e.target.value)) / (balance) * 100).toFixed(0)) : 0)
                                }
                              }

                            } else {
                              setInputPrice(e.target.value);
                              setSlider(0)
                            }

                          }}
                          precision={3}
                          placeholder={`${t("amount")}`}
                        />
                      </WareHousedPriceInputContainer>
                    )}
                  </TradeFunctionLeftItem>
                </TradeFunctionLeftContainer>

                {/* 進度條 */}
                {wareHouseUnitDisplay && <p style={{ fontSize: "12px", color: "#8f8da2", textAlign: "right", fontWeight: 500, fontFamily: "Open Sans" }}>≈ {(inputPrice && localStorage.getItem("token")) ? (parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().substring(0, (parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().indexOf(".") + 3) : 0}{nowTrade.split("-")[0]}</p>}
                <div>
                  <Slider
                    Amount={slider}
                    handleCurrencyAmount={setSlider}
                    setInputPrice={setInputPrice}
                    total={wareHouseUnitDisplay ? (balance) : canOpen}
                  />
                  <DrawerLeverSliderScale>
                    <DrawerLeverSliderScaleText>0%</DrawerLeverSliderScaleText>
                    <DrawerLeverSliderScaleText>25%</DrawerLeverSliderScaleText>
                    <DrawerLeverSliderScaleText>50%</DrawerLeverSliderScaleText>
                    <DrawerLeverSliderScaleText>75%</DrawerLeverSliderScaleText>
                    <DrawerLeverSliderScaleText style={{ marginRight: "-10px" }}>100%</DrawerLeverSliderScaleText>
                  </DrawerLeverSliderScale>
                </div>

                <TradeFunctionDisplayContainer>
                  {/* 可用 */}
                  <FlexAlignCenterDiv>
                    <AvailableTitle>{t("availableU")}</AvailableTitle>

                    <AvailableContent>
                      <p style={{ color: "#383743", fontWeight: 600, fontFamily: "Open Sans" }}>
                        {balance} USDT
                      </p>

                      {/* 資金劃轉 */}
                      <Link to="/deal/fund-transfer">
                        <CurrentContractImage style={{ marginLeft: 10 }} src={transfer} alt="unit" />
                      </Link>
                    </AvailableContent>
                  </FlexAlignCenterDiv>

                  {/* 可開 */}
                  <FlexAlignCenterDiv>
                    <AvailableTitle>{t("availableQ")}</AvailableTitle>

                    <AvailableContent>
                      <p style={{ color: "#383743", fontWeight: 600, fontFamily: "Open Sans" }}>
                        {balance === 0
                          ? 0
                          : canOpen}{" "}
                        {nowTrade.split("-")[0]}
                      </p>
                    </AvailableContent>

                  </FlexAlignCenterDiv>
                </TradeFunctionDisplayContainer>

                {/* 買入、賣出按鈕區塊 */}
                <TradeFunctionButtonContainer>
                  {currencyOption === 0 ?
                    <TradeLeftFunctionButton
                      onClick={() => {
                        if (localStorage.getItem("token")) {
                          if (!wareHousedPrice) {
                            alert("請輸入價格");
                          } else if (!inputPrice) {
                            alert(t("fiatSellQty"));
                          } else {
                            var number = parseFloat(inputPrice)
                            if (wareHouseUnitDisplay) {
                              number = parseFloat((parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().substring(0, (parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().indexOf(".") + 3))
                            }
                            console.log({
                              price: wareHousedPrice,
                              origQty: number,
                              side: "SELL",
                              symbol: nowTrade,
                              leverage: Math.round(leverRatio),
                              type: "LIMIT"
                            })
                            setLoading(true);
                            var obj = orderTypeSelect === 0 ?
                              {
                                price: wareHousedPrice,
                                origQty: number,
                                side: "BUY",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "LIMIT"
                              } : orderTypeSelect === 1 ? {
                                origQty: number,
                                side: "BUY",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "MARKET"
                              } : orderTypeSelect === 2 ? {
                                price: wareHousedPrice,
                                origQty: number,
                                side: "BUY",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "STOP_LIMIT",
                                stopPrice: triggerPrice
                              } : {
                                origQty: number,
                                side: "BUY",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "STOP_MARKET",
                                stopPrice: triggerPrice
                              }
                            api
                              .post("/order/futures/open-order", obj)
                              .then((x) => {
                                setLoading(false);
                                setInputPrice("")
                                setTriggerPrice("")
                                setSlider(0)
                                getEntrust();
                                getPosition();
                                // getBalance()
                              });
                          }
                        } else {
                          alert("請先登入");
                        }
                      }}
                    >
                      {t("buyOrder")}
                    </TradeLeftFunctionButton> :
                    <TradeLeftFunctionButton
                      style={{
                        background: "#d32f2f",
                      }}
                      onClick={() => {
                        if (localStorage.getItem("token")) {
                          if (!wareHousedPrice) {
                            alert("請輸入價格");
                          } else if (!inputPrice) {
                            alert(t("fiatSellQty"));
                          } else {
                            setLoading(true);
                            var number = parseFloat(inputPrice)
                            if (wareHouseUnitDisplay) {
                              number = parseFloat((parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().substring(0, (parseFloat(inputPrice) * leverRatio / parseFloat(wareHousedPrice)).toString().indexOf(".") + 3))
                            }
                            var obj = orderTypeSelect === 0 ?
                              {
                                price: wareHousedPrice,
                                origQty: number,
                                side: "SELL",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "LIMIT"
                              } : orderTypeSelect === 1 ? {
                                origQty: number,
                                side: "SELL",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "MARKET"
                              } : orderTypeSelect === 2 ? {
                                price: wareHousedPrice,
                                origQty: number,
                                side: "SELL",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "STOP_LIMIT",
                                stopPrice: triggerPrice
                              } : {
                                origQty: number,
                                side: "SELL",
                                symbol: nowTrade,
                                leverage: Math.round(leverRatio),
                                type: "STOP_MARKET",
                                stopPrice: triggerPrice
                              }
                            api
                              .post("/order/futures/open-order", obj)
                              .then((x) => {
                                setLoading(false);
                                setInputPrice("")
                                setTriggerPrice("")
                                setSlider(0)
                                getEntrust();
                                getPosition();
                                // getBalance()
                              });
                          }
                        } else {
                          alert("請先登入");
                        }
                      }}
                    >
                      {t("sellOrder")}
                    </TradeLeftFunctionButton>}
                </TradeFunctionButtonContainer>
              </TradeFunctionLeftSide>

              {/* 右半邊 */}
              <DealPriceZone
                price={price}
                remarkPrice={remarkPrice}
                symbol={nowTrade.split("-")[0] + 'USDT'}
              />
            </TradeFunctionContainer>
          </OperateContainer>

          <WarehouseFunctionContainer>
            <WarehouseTransferContainer>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                  width: "100%"
                }}
              >
                {/* 當前持倉 */}
                <OperateUnitButton
                  currencyOption={dealOption}
                  index={0}
                  onClick={handleUnitOption.bind(null, 0)}
                >
                  {t("activePosition")}
                </OperateUnitButton>

                {/* 當前委託 */}
                <OperateUnitButton
                  currencyOption={dealOption}
                  index={1}
                  onClick={handleUnitOption.bind(null, 1)}
                >
                  {t("activeOrder")}
                </OperateUnitButton>

                {/* 移除右上方五個點 */}
                {/* <DealCardList>
                  {DUMMY_DATA_ARRAY.slice(0, 2).map((e) => {
                    return <WarehouseCountIcon key={e} />;
                  })}
                  {DUMMY_DATA_ARRAY.slice(2, DUMMY_DATA_ARRAY.length).map((e) => {
                    return (
                      <WarehouseCountIcon
                        key={e}
                        style={{
                          background: "#DEDDE3",
                        }}
                      />
                    );
                  })}
                </DealCardList> */}
              </div>

            </WarehouseTransferContainer>

            {dealOption === 1 ? (
              // 當前委託的內容
              <div
                style={{
                  padding: "0px 0 80px 0",
                  textAlign: "center",
                }}
              >
                {entrustArray.map((e: Future, i) => {
                  return (
                    <div>
                      {e.status !== "CANCEL" && (
                        <CurrentCommissionCard
                          key={i}
                          setStopLossStopEarn={setStopLossStopEarn}
                          setRevokeIsVisual={setRevokeIsVisual}
                          data={e}
                          setOrderId={setOrderId}
                          balance={balance}
                        />
                      )}
                    </div>
                  );
                })}
                {(entrustArray.length === 0 || future === false) && (
                  <>
                    <img
                      style={{ width: 135, height: 135, marginTop: "30px" }}
                      src={noItemIcon}
                      alt="no info"
                    />
                    <p
                      style={{
                        padding: "30px 0",
                        color: "#BDBCC8",
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {t("noHistory")}
                    </p>
                  </>
                )}
              </div>
            ) : (
              // 當前持倉的內容
              <div
                style={{
                  flex: 1,
                  padding: "0px 0 80px 0",
                  textAlign: "center",
                }}
              >
                {
                  !(positionArray.length === 1 && !positionArray[0].positionId) &&
                  positionArray.map((e: any, i) => {
                  console.log(e)
                  return (
                    <>
                      {e.status !== "CLOSE" && (
                        <CurrentPositionCard
                          key={i}
                          setCurrencyOption={setCurrencyOption}
                          data={e}
                          getPosition={getPosition}
                          setLoading={setLoading}
                          getBalance={getBalance}
                          remark={e.symbol ? getRemark(e.symbol) : ""}
                        />
                      )}
                    </>
                  );
                })}
                {(positionArray.length === 1 && !positionArray[0].positionId) && (
                  <>
                    <img
                      style={{ width: 135, height: 135, marginTop: "30px" }}
                      src={noItemIcon}
                      alt="no info"
                    />
                    <p
                      style={{
                        padding: "30px 0",
                        color: "#BDBCC8",
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {t("noHistory")}
                    </p>
                  </>
                )}
              </div>
            )}
          </WarehouseFunctionContainer>

          <Drawer
            isVisible={wareHousedrawerVisible}
            selectVisible={handlerDrawer.bind(null, "other")}
            height={292}
          >
            <DrawerFullWarehouseTitleContainer>
              <DrawerFullWarehouseImage
                src={cancel}
                alt="cancel"
                onClick={handlerDrawer.bind(null, "other")}
              />
              <DrawerFullWarehouseTitle>
                {drawerType === "Warehouse" ? t("marginMode") : t("tradeUnit")}
              </DrawerFullWarehouseTitle>
            </DrawerFullWarehouseTitleContainer>
            <DrawerFullWarehouseSelectContainer>
              <DrawerFullWarehouseSelectButton
                type={0}
                isChecked={
                  drawerType === "Warehouse"
                    ? fullWareHouseSelect
                    : wareHouseUnitSelect
                }
                onClick={
                  drawerType === "Warehouse"
                    ? handlerCheckFullWarehouse.bind(null, 0)
                    : handlerCheckFullWarehouseUnit.bind(null, 0)
                }
              >
                <DrawerFullWarehouseSelectTitle
                  type={0}
                  isChecked={
                    drawerType === "Warehouse"
                      ? fullWareHouseSelect
                      : wareHouseUnitSelect
                  }
                >
                  {drawerType === "Warehouse" ? t("crossPosition") : nowTrade.split("-")[0]}
                </DrawerFullWarehouseSelectTitle>
                {drawerType === "Warehouse" && fullWareHouseSelect === 0 && (
                  <img
                    src={checkIcon}
                    alt="cancel"
                    style={{ width: 24, height: 24 }}
                  />
                )}
                {drawerType === "Unit" && wareHouseUnitSelect === 0 && (
                  <img
                    src={checkIcon}
                    alt="cancel"
                    style={{ width: 24, height: 24 }}
                  />
                )}
              </DrawerFullWarehouseSelectButton>
              <DrawerFullWarehouseSelectButton
                type={1}
                isChecked={
                  drawerType === "Warehouse"
                    ? fullWareHouseSelect
                    : wareHouseUnitSelect
                }
                onClick={
                  drawerType === "Warehouse"
                    ? handlerCheckFullWarehouse.bind(null, 1)
                    : handlerCheckFullWarehouseUnit.bind(null, 1)
                }
              >
                <DrawerFullWarehouseSelectTitle
                  type={1}
                  isChecked={
                    drawerType === "Warehouse"
                      ? fullWareHouseSelect
                      : wareHouseUnitSelect
                  }
                >
                  {drawerType === "Warehouse" ? t("isolatedPosition") : "USDT"}
                </DrawerFullWarehouseSelectTitle>
                {drawerType === "Warehouse" && fullWareHouseSelect === 1 && (
                  <img
                    src={checkIcon}
                    alt="cancel"
                    style={{ width: 24, height: 24 }}
                  />
                )}
                {drawerType === "Unit" && wareHouseUnitSelect === 1 && (
                  <img
                    src={checkIcon}
                    alt="cancel"
                    style={{ width: 24, height: 24 }}
                  />
                )}
              </DrawerFullWarehouseSelectButton>
            </DrawerFullWarehouseSelectContainer>
            {drawerType === "Warehouse" ? (
              <DrawerFullWarehouseContent>
                {`所有品種合約的倉位共用一個帳戶權益，合約帳戶中的擔保資產合併計算。`}
              </DrawerFullWarehouseContent>
            ) : (
              <DrawerFullWarehouseContent>
                <p>{`${nowTrade.split("-")[0]}/USDT 永續合約`}</p>
                <p>{`1 ${nowTrade.split("-")[0]} ≈ ${wareHousedPrice} USDT`}</p>
              </DrawerFullWarehouseContent>
            )}
            <DrawerFullWarehouseConfirm
              onClick={() => {
                if (wareHouseUnitSelect === 0) {
                  setWareHouseUnitDisplay(false)
                } else {
                  setWareHouseUnitDisplay(true)
                }
                setInputPrice("")
                setSlider(0)
                handlerDrawer("Warehouse");
              }}
            >{`確認`}</DrawerFullWarehouseConfirm>
          </Drawer>
          <Drawer
            isVisible={leverVisible}
            selectVisible={handlerDrawer.bind(null, "lever")}
            height={425}
          >
            <DrawerFullWarehouseTitleContainer>
              <DrawerFullWarehouseImage
                src={cancel}
                alt="cancel"
                onClick={handlerDrawer.bind(null, "lever")}
              />
              <DrawerFullWarehouseTitle>{t("leverage")}</DrawerFullWarehouseTitle>
            </DrawerFullWarehouseTitleContainer>
            <DrawerLeverButtonContainer>
              <DrawerLeverButtonImg
                src={minus}
                alt="cancel"
                onClick={handlerCaculate.bind(null, "minus")}
              />
              <DrawerLeverButtonTitle>{`${templeverRatio ? (templeverRatio < 0 ? 0 : Math.round(templeverRatio)) : 1
                }X`}</DrawerLeverButtonTitle>
              <DrawerLeverButtonImg
                src={add}
                alt="cancel"
                onClick={handlerCaculate.bind(null, "add")}
              />
            </DrawerLeverButtonContainer>
            <LeverSlider
              Amount={templeverRatio}
              handleCurrencyAmount={setTempLeverRatio}
            />
            <DrawerLeverSliderScale>
              <DrawerLeverSliderScaleText>1x</DrawerLeverSliderScaleText>
              <DrawerLeverSliderScaleText>25x</DrawerLeverSliderScaleText>
              <DrawerLeverSliderScaleText style={{ marginLeft: "10px" }}>50x</DrawerLeverSliderScaleText>
              <DrawerLeverSliderScaleText style={{ marginLeft: "10px" }}>75x</DrawerLeverSliderScaleText>
              <DrawerLeverSliderScaleText style={{ marginLeft: "10px" }}>100x</DrawerLeverSliderScaleText>
              <DrawerLeverSliderScaleText style={{ marginRight: "-10px" }}>125x</DrawerLeverSliderScaleText>
            </DrawerLeverSliderScale>
            <DrawerFullWarehouseContent style={{ height: 136 }}>
              <DrawerFullWarehouseContentTitle>{t("leverageMsg")}</DrawerFullWarehouseContentTitle>
              <DrawerFullWarehouseContentDescription>{`調整槓桿後，您的 ${nowTrade.split("-")[0]} 永續合約資金將變化為：`}</DrawerFullWarehouseContentDescription>
              <DrawerFullWarehouseContentDescription>{`${balance.toString().substring(0, balance.toString().indexOf('.') + 3)} USDT 持倉擔保金額`}</DrawerFullWarehouseContentDescription>
              <DrawerFullWarehouseContentDescription>{`${balance.toString().substring(0, balance.toString().indexOf('.') + 3)} USDT 可用擔保金額`}</DrawerFullWarehouseContentDescription>
            </DrawerFullWarehouseContent>
            <DrawerFullWarehouseConfirm
              onClick={() => {
                if (localStorage.getItem("token")) {
                  api.post("/order/position/adjust-leverage", { leverage: templeverRatio, symbol: nowTrade }).then(x => {
                    if (x.status !== 400) {
                      handlerDrawer("lever")
                      setLeverRatio(templeverRatio)
                      localStorage.setItem("leverRatio", templeverRatio.toString())
                      getEntrust()
                      getPosition()
                      // getBalance()
                    }
                  })
                } else {
                  alert("請先登入")
                }

              }}
            >{`確認`}</DrawerFullWarehouseConfirm>
          </Drawer>
          <OrderTypeDrawer
            isVisible={orderType}
            selectVisible={setOrderType}
            height={300}
            setOrderTypeSelect={setOrderTypeSelect}
            orderTypeSelect={orderTypeSelect}
            getPrice={getPrice}
          />
          <CounterpartyPriceDrawer
            isVisible={counterPartyPriceDrawer}
            selectVisible={setCounterPartyPriceDrawer}
            height={375}
            setOrderTypeSelect={setCounterPartyPrice}
            orderTypeSelect={counterPartyPrice}
          />
          <StopLossDrawer
            isVisible={stopLossDrawerVisible}
            selectVisible={setStopLossDrawerVisible}
            height={553}
            stopLoss={stopLoss}
            setStopLoss={setStopLoss}
            stopLossPrice={stopLossPrice}
            setStopLossPrice={setStopLossPrice}
            stopEarning={stopEarning}
            setStopEarning={setStopEarning}
            stopEarningPrice={stopEarningPrice}
            setStopEarningPrice={setStopEarningPrice}
            setFunctionLeftCheckbox={setFunctionLeftCheckbox}
          />
          <StopLossStopEarnDrawer
            isVisible={StopLossStopEarn}
            selectVisible={setStopLossStopEarn}
            height={329}
          />
          <Footer locationPage={location} />
        </PageContainer>
        {revokeIsVisual && (
          <Modal>
            <ConfirmContainer>
              <ConfirmContentContainer>
                <ConfirmContentTitle>撤銷委託單？</ConfirmContentTitle>
                <ConfirmContent>
                  確定撤銷委託單後，將無法再次回復該筆委託單內容。
                </ConfirmContent>
              </ConfirmContentContainer>
              <ConfirmCheckbox>
                <CheckboxCancel onClick={() => setRevokeIsVisual((v) => !v)}>
                  {t("cancel")}
                </CheckboxCancel>
                <CheckboxConfirm
                  onClick={() => {
                    setLoading(true);
                    api
                      .post("/order/futures/cancel-order", { orderId })
                      .then((x) => {
                        setLoading(false);
                        getEntrust();
                      });
                    setRevokeIsVisual((v) => !v);
                  }}
                >
                  {t("OK")}
                </CheckboxConfirm>
              </ConfirmCheckbox>
            </ConfirmContainer>
          </Modal>
        )}
      </LoadingOverlay>
    </>
  );
};

export default Deal;
