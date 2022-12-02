import {
  useState,
  useEffect,
  useContext,
  useCallback
} from "react";

// % context
import { PriceContext } from "@/store/select-context";

// ? Self-packed Components || Functions
import KlineChart from './KlineChart'
import { COLORS } from "@/constants/colors";
import Drawer from "@/components/UI/Drawer";
import ChartHeader from "@/components/header/chartHeader";

// - Images
import arrowDown from "@/assets/icon/Deal/arrowDown.png";

// ^ Plugins
import { find, cloneDeep, get, isNil } from "lodash"
import { useTranslation } from "react-i18next";
import axios from "axios";

// = Styled Component
import {
  PageContainer,
  ChartContainer,
  DealListContainer,
  DealListTitle,
  DealList,
  CurrencyListTitle,
  DealItemContainer,
  DealItem,
  DepthTitle,
  DepthItem,
  CancelButton
} from '@/styled-components/deal-chart';

/**
 * @author odin
 * @level Layout/Deal/Chart
 * @description K線頁面
*/
const Chart = () => {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { marketArr }: any = useContext(PriceContext)

  // # states
  const [trade, setTrade] = useState<string>('BTC-USDT');
  const [isFavorite, setIsFavorite] = useState(true);
  const [selectDepth, setSelectDepth] = useState(0.1);
  const [selectChange, setSelectChange] = useState(false);
  const [timeScale, setTimeScale] = useState("1m");
  const [timeline, serTimeline] = useState(false);
  const [price,setPrice] = useState("")
  const [bidsArray , setBidsArray] = useState([])
  const [asksArray , setAsksArray] = useState([])
  const [remarkPrice, setRemarkPrice] = useState("");

  // - methods
  const favoriteHandler = () => {
    setIsFavorite((v) => !v);
  };

  const depthHandler = (depth: number) => {
    setSelectDepth(depth);
    setSelectChange((v) => !v);
  };

  const selectDepthHandler = () => {
    setSelectChange((v) => !v);
  };

  const getDepth = useCallback(() => {
    const url = `https://api1.binance.com/api/v3/depth?symbol=${trade?.split("-")[0]}USDT&limit=15`;

    axios.get(url)
      .then((res: any) => {
        const resNew = cloneDeep(res);
        const asks = get(resNew, 'data.asks', []).reverse();
        const bids = get(resNew, 'data.bids', []);

        setAsksArray(asks);
        setBidsArray(bids);
      });
  }, [trade]);

  /**
   * @author odin
   * @description 取得現在的交易對名稱
  */
  useEffect(() => {
    const localStorageTrade = localStorage.getItem("trade") || 'BTC-USDT';

    if(isNil(localStorageTrade)) return;

    setTrade(localStorageTrade);
  }, []);

  // * hooks
  useEffect(()=>{

    getDepth();

    const interval = setInterval(() => {
      getDepth();
    },2000);

    return function cleanUp () { clearInterval(interval) };
  },[getDepth]);

  useEffect( () => {
    if (marketArr) {
      const trade = localStorage.getItem("trade")
      const t = trade ? trade.split("-")[0] + "-USDT" : "BTC-USDT"
      const remark = find(marketArr, function(o) { return o.s === t })
      setRemarkPrice(remark ? remark.m : 0)
      setPrice(remark ? remark.c.toString() : "0")
    }
  }, [marketArr]);

  return (
    <PageContainer>
      <ChartHeader removeFavorite={favoriteHandler} isFavorite={isFavorite} />
      {true ? (
        <>
          <div
            style={{
              width: "100%",
              height: 111,
              background: "#fff",
              position: "absolute",
              top: 45,
              borderTop: "0.5px solid #F4F4F6",
              boxShadow: "0px 2px 4px rgba(143, 141, 162, 0.07)",
              display: "flex",
              flexDirection: "column",
              zIndex: 100,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "65%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
              }}
            >
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: 32,
                  color: COLORS.Red,
                  fontFamily:"Open Sans"
                }}
              >{remarkPrice ? (parseFloat(remarkPrice) < 10 && parseFloat(remarkPrice) > 1) ? remarkPrice.slice(0, -3) : parseFloat(remarkPrice) < 10 ? remarkPrice.slice(0, -2) :remarkPrice.slice(0, -4): remarkPrice}</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex" }}>
                  <p
                    style={{ lineHeight: "18px", color: COLORS.Mid_gray }}
                  >
                    {t("marketPrice")}&nbsp;&nbsp;
                  </p>
                  <p style={{ lineHeight: "18px",fontWeight:600,fontFamily:"Open Sans" }}>{remarkPrice ? (parseFloat(remarkPrice) < 10 && parseFloat(remarkPrice) > 1) ? remarkPrice.slice(0, -3) : parseFloat(remarkPrice) < 10 ? remarkPrice.slice(0, -2) :remarkPrice.slice(0, -4): remarkPrice}</p>
                </div>
                <div style={{ display: "flex" }}>
                  <p
                    style={{ lineHeight: "18px", color: COLORS.Mid_gray }}
                  >
                    {t("indexPrice")}&nbsp;&nbsp;
                  </p>
                  <p style={{ lineHeight: "18px",fontWeight:600,fontFamily:"Open Sans" }}>{(parseFloat(price) < 10 && parseFloat(price) > 1) ? price.slice(0, -3) : parseFloat(price) < 10 ? price.slice(0, -2) :price.slice(0, -4)}</p>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "35%",
                padding: "0 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    paddingRight: 24,
                    color: timeScale === "15m" ? "#000" : COLORS.Mid_gray,
                    fontWeight:500
                  }}
                  onClick={() => {
                    setTimeScale("15m");
                    serTimeline(false);
                  }}
                >
                  15分
                </div>
                <div
                  style={{
                    paddingRight: 24,
                    color: timeScale === "1h" ? "#000" : COLORS.Mid_gray,
                    fontWeight:500
                  }}
                  onClick={() => {
                    setTimeScale("1h");
                    serTimeline(false);
                  }}
                >
                  1時
                </div>
                <div
                  style={{
                    paddingRight: 24,
                    color: timeScale === "4h" ? "#000" : COLORS.Mid_gray,
                    fontWeight:500
                  }}
                  onClick={() => {
                    setTimeScale("4h");
                    serTimeline(false);
                  }}
                >
                  4時
                </div>
                <div
                  style={{
                    paddingRight: 24,
                    color: timeScale === "1d" ? "#000" : COLORS.Mid_gray,
                    fontWeight:500
                  }}
                  onClick={() => {
                    setTimeScale("1d");
                    serTimeline(false);
                  }}
                >
                  1日
                </div>
                <div
                  style={{
                    height: "100%",
                    paddingRight: 24,
                    color:
                      timeScale === "timeshare"
                        ? "#000"
                        : COLORS.Mid_gray,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() => {
                    serTimeline((v) => !v);
                    setTimeScale("timeshare");
                  }}
                >
                  <p style={{ paddingRight: 6 }}>更多</p>
                  <img
                    src={arrowDown}
                    alt="arrow"
                    style={{ width: 6.43, height: 3.21 }}
                  />
                </div>
              </div>
              <div style={{fontWeight:500}}>{timeScale}</div>
            </div>
          </div>
          {timeline && (
            <div
              style={{
                width: "100%",
                height: 50,
                background: "#fff",
                position: "absolute",
                top: 155,
                borderBottom: "0.5px solid #F4F4F6",
                boxShadow: "0px 2px 4px rgba(143, 141, 162, 0.07)",
                display: "flex",
                borderRadius: "0 0 16px 16px",
                padding: "12px 16px",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  background: timeScale === "timeshare" ? "#5F5C70" : "#F4F4F6",
                  padding: "4px 12px",
                  borderRadius: 16,
                  lineHeight: "18px",
                  fontSize: 12,
                  marginRight: 8,
                  color: timeScale === "timeshare" ? "#fff" : "#8F8DA2",
                }}
              >
                分時
              </div>
              <div
                style={{
                  background: timeScale === "1m" ? "#5F5C70" : "#F4F4F6",
                  padding: "4px 12px",
                  borderRadius: 16,
                  lineHeight: "18px",
                  fontSize: 12,
                  marginRight: 8,
                  color: timeScale === "1m" ? "#fff" : "#8F8DA2",
                  fontWeight:500
                }}
                onClick={() => setTimeScale("1m")}
              >
                1分
              </div>
              <div
                style={{
                  background: timeScale === "5m" ? "#5F5C70" : "#F4F4F6",
                  padding: "4px 12px",
                  borderRadius: 16,
                  lineHeight: "18px",
                  fontSize: 12,
                  marginRight: 8,
                  color: timeScale === "5m" ? "#fff" : "#8F8DA2",
                  fontWeight:500
                }}
                onClick={() => setTimeScale("5m")}
              >
                5分
              </div>
              <div
                style={{
                  background: timeScale === "30m" ? "#5F5C70" : "#F4F4F6",
                  padding: "4px 12px",
                  borderRadius: 16,
                  lineHeight: "18px",
                  fontSize: 12,
                  marginRight: 8,
                  color: timeScale === "30m" ? "#fff" : "#8F8DA2",
                  fontWeight:500
                }}
                onClick={() => setTimeScale("30m")}
              >
                30分
              </div>
              <div
                style={{
                  background: timeScale === "1M" ? "#5F5C70" : "#F4F4F6",
                  padding: "4px 12px",
                  borderRadius: 16,
                  lineHeight: "18px",
                  fontSize: 12,
                  marginRight: 8,
                  color: timeScale === "1M" ? "#fff" : "#8F8DA2",
                  fontWeight:500
                }}
                onClick={() => setTimeScale("1M")}
              >
                1月
              </div>
            </div>
          )}
        </>
      ) : null}

      <ChartContainer>
        {/* <Menu1 /> */}
      </ChartContainer>
      <DealListContainer>
      <KlineChart trade={trade} timeScale={timeScale}/>

        <DealListTitle>
          <p style={{ fontWeight: 600, fontSize: 16, color: "#383743" }}>
          {t("orderBook")}
          </p>
          {/* <DealListTitleButton onClick={selectDepthHandler}>
            <p style={{ fontWeight: 400, fontSize: 12, color: "#8F8DA2" }}>
              {`深度 ${selectDepth}`}
            </p>
            <img
              style={{ width: 8.6, height: 4.3 }}
              src={arrowDown}
              alt="arrow"
            />
          </DealListTitleButton> */}
        </DealListTitle>
        <DealList>
          <p
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "#8F8DA2",
              width: 42,
              height: 33,
            }}
          >{t("price")+`(USDT)`}</p>
          <p
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "#8F8DA2",
              width: 42,
              height: 33,
            }}
          >{t("amount")+`(BTC)`}</p>
          <p
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "#8F8DA2",
              width: 42,
              height: 33,
              textAlign: "right",
            }}
          >{t("totalAmount")+`(BTC)`}</p>
        </DealList>
        {isFavorite && (
          <>
            {asksArray.map((e:string, i) => {
              return (
                <DealItemContainer key={i.toString()}>
                  <DealItem style={{ color: COLORS.Green,fontWeight:600,fontFamily:"Open Sans" }}>
                  {(parseFloat(e[0]) < 10 && parseFloat(e[0]) > 1) ? e[0].slice(0, -5) : parseFloat(e[0]) < 10 ? e[0].slice(0, -4) :e[0].slice(0, -6)}
                  </DealItem>
                  <DealItem style={{ paddingRight: 30,fontWeight:600,fontFamily:"Open Sans" }}>{e[1].slice(0,-5)}</DealItem>
                  <DealItem>{e[1].slice(0,-5)}</DealItem>
                </DealItemContainer>
              );
            })}
            <CurrencyListTitle style={{ marginTop: 16 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#BDBCC8",
                  width: 42,
                }}
              >{`{t("lastPrice")}`}</p>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#BDBCC8",
                  width: 42,
                  textAlign: "right",
                }}
              >{`指數價`}</p>
            </CurrencyListTitle>
            <CurrencyListTitle style={{ paddingBottom: 13 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: COLORS.Red,
                  width: 42,
                  fontFamily:"Open Sans"
                }}
              >{(parseFloat(price) < 10 && parseFloat(price) > 1) ? price.slice(0, -3) : parseFloat(price) < 10 ? price.slice(0, -2) :price.slice(0, -4)}</p>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#5F5C70",
                  textAlign: "right",
                  fontFamily:"Open Sans"
                }}
              >{(parseFloat(price) < 10 && parseFloat(price) > 1) ? price.slice(0, -3) : parseFloat(price) < 10 ? price.slice(0, -2) :price.slice(0, -4)}</p>
            </CurrencyListTitle>
            {bidsArray.map((e:string, i) => {
              return (
                <DealItemContainer key={i.toString()}>
                  <DealItem style={{ color: COLORS.Red }}>
                  {(parseFloat(e[0]) < 10 && parseFloat(e[0]) > 1) ? e[0].slice(0, -5) : parseFloat(e[0]) < 10 ? e[0].slice(0, -4) :e[0].slice(0, -6)}
                  </DealItem>
                  <DealItem style={{ paddingRight: 30 }}>{e[1].slice(0,-5)}</DealItem>
                  <DealItem>{e[1].slice(0,-5)}</DealItem>
                </DealItemContainer>
              );
            })}
          </>
        )}
      </DealListContainer>
      {/* <FooterContainer>
        <FooterButton style={{ background: "#d32f2f" }}>開倉</FooterButton>
        <FooterButton
          style={{ background: "#29A370" }}
          onClick={() => navigate(`/deal`)}
        >
          平倉
        </FooterButton>
      </FooterContainer> */}
      <Drawer
        isVisible={selectChange}
        selectVisible={selectDepthHandler}
        height={302}
      >
        <DepthTitle>深度</DepthTitle>
        <DepthItem
          isSelect={selectDepth}
          index={0.1}
          onClick={depthHandler.bind(null, 0.1)}
        >
          0.1
        </DepthItem>

        <DepthItem
          isSelect={selectDepth}
          index={1}
          onClick={depthHandler.bind(null, 1)}
        >
          1
        </DepthItem>
        <DepthItem
          style={{ border: "none" }}
          isSelect={selectDepth}
          index={10}
          onClick={depthHandler.bind(null, 10)}
        >
          10
        </DepthItem>
        <CancelButton onClick={selectDepthHandler}>{t("cancel")}</CancelButton>
      </Drawer>
    </PageContainer>
  );
};

export default Chart;
