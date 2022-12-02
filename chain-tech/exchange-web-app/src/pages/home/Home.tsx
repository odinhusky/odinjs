import {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from 'react';

// # API
import api from '@/common/api';
import { getHotList, getFavoriteList, getMarquee } from 'api';

// % context
import { useGlobalCtx } from '@/components/Layout/GlobalContext';
import { PriceContext } from '@/store/select-context';

// ^ Types or Interfaces
import { HotShowData, PriceCtxValueTypes } from '@/constants/type';

// ? Self-packed Components || Functions
import Header from '@/components/header/HomeHeader';
import NavModal from '@/components/modal/NavModal';
import Footer from '@/components/footer/HomeFooter';
import { FlexDirectionRowDiv } from '@/styled-components';
import { handleLastPrice } from '@/common/methods';
import Marquee from '@/components/Marquee';

// - Images
import { ReactComponent as ArrowLeft } from '@/assets/icon/chevronLeft.svg';
import { ReactComponent as ArrowRight } from '@/assets/icon/chevronRight.svg';
import contractDealImg from "@/assets/home/contract_deal.svg";
import inviteImg from '@/assets/home/invite_friends.svg';
import protectFund from '@/assets/home/protectFund.svg';
import realTimeTrend from '@/assets/home/realTimeTrend.svg';
import rookieBonusImg from "@/assets/home/rookieBonus.svg";
import welfareImg from '@/assets/home/welfare.svg';
import loanImg from '@/assets/home/loan.svg';
import recentEventImg from '@/assets/home/recentEvent.svg';
import C2CImg from '@/assets/home/c2c.svg';
import rechargeImg from '@/assets/home/recharge.svg';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  isEmpty,
  get,
  isNil,
  // debounce
} from 'lodash';

// = Styled Component
import {
  PageContainer,
  ChartContainer,
  Banner,
  ListContainer,
  ListHeader,
  ListButton,
  ListContent,
  ListContentTitle,
  ItemContainer,
  ListItem,
  ItemPair,
  ItemRatio,
  ItemDeal,
  NewestContainer,
  NewestCard,
  NewestText,
  ContinueReadText,
  IconBtn,
  IconBtnImg,
  IconBtnText,
  TradePairContainer,
  TradePairUnit,
  TradePairName,
  TradePairPercentage,
  TradePairCurrencyToUsd,
  TradePairCurrencyFiatRate,
  HomeCarousel
} from '@/styled-components/home'


/* desktop thw newest info style end */
/**
 * @author odin
 * @level Layout/Home
 * @description 首頁
*/
export const Home = () => {

  // $ init data
  const { t } = useTranslation();
  const navigation = useNavigate();
  const location = useLocation().pathname;

  // % context
  // 當前選擇的幣別
  const {
    currencyUnit,
    // handleAPIErr,
    currentLang,
    isLogin
  } = useGlobalCtx();

  const { marketArr, marketObj } : PriceCtxValueTypes | any = useContext(PriceContext);

  // & handeld data

  const data = useMemo(() => [
    {
      title: "比特幣",
      titleRatio: "BTC",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },
    {
      title: "以太坊",
      titleRatio: "ETH",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },

    {
      title: "萊特幣",
      titleRatio: "BNB",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },
    {
      title: "波卡幣",
      titleRatio: "BUSD",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    }
  ], []);

  const iconBtns = useMemo(() => [
    // 合約交易
    {
      key: 0,
      style: {},
      text: t('tradeFutures'),
      img: contractDealImg,
      onClick: () => {
        if(isLogin){
          navigation("/deal");
        }
        else{
          alert("請先登入")
        }
      }
    },
    // 邀請好友
    {
      key: 1,
      style: {},
      text: t('inviteFriend'),
      img: inviteImg,
      onClick: () => {
        if(isLogin){
          navigation("/profile/Rebate");
        }else{
          alert("請先登入")
        }
      }
    },
    // 保護基金
    {
      key: 2,
      style: {},
      text: t('protectFund'),
      img: protectFund,
      onClick: () => {}
    },
    // 即時趨勢
    {
      key: 3,
      style: {},
      text: t('realTimeTrend'),
      img: realTimeTrend,
      onClick: () => {
        navigation("/instantTrend");
      }
    },
    // 新手獎勵
    {
      key: 4,
      style: {},
      text: t('rookieBonus'),
      img: rookieBonusImg,
      onClick: () => {}
    },
    // 福利中心
    {
      key: 5,
      style: {},
      text: t('welfare'),
      img: welfareImg,
      onClick: () => {
        navigation("/missionCenter");
      }
    },
    // 貸款
    {
      key: 6,
      style: {},
      text: t('Stake'),
      img: loanImg,
      onClick: () => {}
    },
    // 近期活動
    {
      key: 7,
      style: {},
      text: t('recentEvent'),
      img: recentEventImg,
      onClick: () => {}
    },

  ], [t, navigation, isLogin]);

  const tabs = useMemo(() => [
    // 熱門
    {
      key: 0,
      text: t("hot")
    },
    // 自選
    {
      key: 1,
      text: t("favoritesList")
    },
    // 漲幅榜
    {
      key: 2,
      text: t("gainersList")
    },
    // 跌幅榜
    {
      key: 3,
      text: t("losersList")
    },
    // 24H成交量榜
    {
      key: 4,
      text: t("24hVol")
    }
  ], [t]);

  const defaultMarquee = useMemo(() => [
    {
      key: 0,
      text: 'odin1: 我是測試文字我是測試文字'
    },
    {
      key: 1,
      text: 'odin2'
    },
    {
      key: 2,
      text: 'odin3'
    },
  ], []);

  // # state
  // 熱門交易對
  const [hotList, setHotList] = useState<string[] | []>([]);

  // 熱門交易對要顯示在畫面上的資料
  const [showHotList, setShowHotList] = useState<Array<HotShowData> | any>([]);

  // 各個幣種的匯率
  const [fiatRate, setFiatRate] = useState({
    twd: 0,
    usd: 0,
    cny: 0,
    jpy: 0,
    vnd: 0,
    rub: 0,
    eur: 0,
    try: 0,
    idr: 0,
    php: 0,
  });

  // 最下方目前 active 的是哪一個選項
  const [currentList, setCurrentList] = useState(0);

  const [imgArr, setImgArr] = useState([]);
  const [isNavModal] = useState(false);

  // 顯示的交易對
  const [data2, setData2] = useState([
    {
      title: "比特幣",
      titleRatio: "BTC",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },
    {
      title: "以太坊",
      titleRatio: "ETH",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },

    {
      title: "萊特幣",
      titleRatio: "BNB",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    },
    {
      title: "波卡幣",
      titleRatio: "BUSD",
      currencyRate: "",
      currencyToUsd: "",
      time: 24,
      dealAmount: "",
      change: 0
    }
  ]);

  const [market, setMarket] = useState([
    {
      E: "",
      P: "",
      c: "",
      e: "",
      p: "",
      s: "",
      v: "",
      w: "",
      m: ""
    }
  ]);
  const [favorite, setFavorite] = useState([
    {
      E: "",
      P: "",
      c: "",
      e: "",
      p: "",
      s: "",
      v: "",
      w: "",
      m: ""
    }
  ]);

  // API 取得的自選交易對名稱
  const [favoriteList, setFavoriteList] = useState<string[] | []>([]);

  // currencySign init
  const [currencySign, setCurrencySign] = useState({});

  const [marquee, setMarquee] = useState<string[] | []>([]);

  // - methods
  /**
   * @author odin
   * @description 當 market 有變動且 favoriteList 不為空陣列的時候處理要顯示的資料
  */
  const handleFavoriteData = useCallback(() => {
    if(isEmpty(favoriteList)) return;

    let a: any[] = [];

    for (let i = 0; i < favoriteList.length; i++) {
        for (let j = 0; j < market.length; j++) {
          if (favoriteList[i] === market[j]["s"]) {
            a.push(market[j]);
          }
        }
      }

      setFavorite(
        a
          .sort(function (a: any, b: any) {
            return parseFloat(a.P) - parseFloat(b.P);
          })
          .reverse()
      );
  }, [market, favoriteList]);

  /**
   * @author odin
   * @description 取得自選交易對列表並且 setState
  */
  const getFavorite = useCallback(async () => {
    try {
      const res: any = await getFavoriteList();

      console.log('getFavoriteList res => ', res);
      setFavoriteList(res);
    } catch (e) {
      console.log('getFavoriteList Error', e);
    }
  }, []); // eslint-disable-line

  const changeModalHandler = (modal: string) => {
      // setIsNavModal(v => !v)
      navigation("/member");
  };

  /**
   * @author odin
   * @description 取得熱門列表並且 setState
  */
  const handleGetHotList = async () => {
    try {
      const res: any = await getHotList();
      // console.log('getHotList res', res);

      setHotList(res);
    } catch (e) {
      console.log('getHotList Error', e);
      alert(`getHotList Error ${e}`);
    }
  };

  /**
   * @author odin
   * @description 取得熱門列表並且 setState
  */
  const handleGetMarquee = useCallback(async (lang: string) => {
    try {
      const res: any = await getMarquee(lang);
      // console.log('getMarquee res', res);

      setMarquee(res);
    } catch (e) {
      console.log('getMarquee Error', e);
    }
  }, []);

  // * hooks
  /**
   * @author odin
   * @description Home Init
  */
  useEffect(() => {
    handleGetHotList();
  }, []);

  /**
   * @author odin
   * @description Marquee Init
  */
  useEffect(() => {
    handleGetMarquee(currentLang);
  }, [handleGetMarquee, currentLang]);

  /**
   * @author odin
   * @description 組出要顯示在畫面上得資料
  */
  useEffect(() => {
    if(isEmpty(hotList) || isEmpty(marketObj)) return;

    const hotShowData : Array<HotShowData> | any = hotList.map((name, index) => {
      const pairObj = marketObj[name];
      const isExist = !isNil(pairObj) && !isEmpty(pairObj);

      return {
        key: index,
        name: name,
        lastPrice: isExist ? handleLastPrice(pairObj.c) : '0',
        percentageIn24H: isExist ? pairObj.P : '0',
      }
    });

    setShowHotList(hotShowData);
  }, [hotList, marketObj]);

  useEffect(() => {
    if (!isLogin) return;

    getFavorite();
  }, [isLogin, getFavorite]);

  useEffect(() => {
    if (marketArr) {
      let gfg = marketArr.sort(function (a: any, b: any) {
        return parseFloat(a.P) - parseFloat(b.P);
      });
      setMarket(gfg.reverse());
      let market = {
        market: gfg
      };

      handleFavoriteData();

      localStorage.setItem("market", JSON.stringify(market));

      for (let i = 0; i < marketArr.length; i++) {
        if (marketArr[i].s === "BTC-USDT") {
          let newArr = [...data];
          // let price = lastJsonMessage.data.c.slice(0, -6);
          newArr[0].currencyRate = marketArr[i].c.slice(0, -4);
          newArr[0].currencyToUsd =
            parseFloat(marketArr[i].c) < 10 && parseFloat(marketArr[i].c) > 1
              ? marketArr[i].c.slice(0, -3)
              : parseFloat(marketArr[i].c) < 10
              ? marketArr[i].c.slice(0, -2)
              : marketArr[i].c.slice(0, -4);
          newArr[0].change = parseFloat(marketArr[i].P);
          newArr[0].dealAmount = marketArr[i].v.split(".")[0];
          setData2(newArr);
        }
        if (marketArr[i].s === "ETH-USDT") {
          let newArr = [...data];
          // let price = lastJsonMessage.data.c.slice(0, -6);
          newArr[1].currencyRate = marketArr[i].c.slice(0, -4);
          newArr[1].currencyToUsd = marketArr[i].c.slice(0, -4);
          newArr[1].change = parseFloat(marketArr[i].P);
          newArr[1].dealAmount = marketArr[i].v.split(".")[0];
          setData2(newArr);
        }
        if (marketArr[i].s === "BNB-USDT") {
          let newArr = [...data];
          // let price = lastJsonMessage.data.c.slice(0, -6);
          newArr[2].currencyRate = marketArr[i].c.slice(0, -4);
          newArr[2].currencyToUsd = marketArr[i].c.slice(0, -4);
          newArr[2].change = parseFloat(marketArr[i].P);
          newArr[2].dealAmount = marketArr[i].v.split(".")[0];
          setData2(newArr);
        }
      }
    }
  }, [marketArr, data, isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api.get("/info/carousel?lang="+currentLang).then(x => {
      setImgArr(x.data);
    });
  }, [currentLang]);

  useEffect(() => {
    api.get("/info/fiat-currency").then(x => {
      const fiatObj = get(x, 'data', {});

      if(isEmpty(fiatObj)) return;
      setFiatRate({ ...x.data });
      setCurrencySign(
        Object.keys(fiatObj).reduce((a, v) => ({ ...a, [v]: v }), {})
      );
    });
  }, []);

  return (
    <PageContainer>
      {isNavModal
        ? (
          <NavModal changeModal={changeModalHandler} />
        )
        : (
          <>
            <Header />
            <div style={{ padding: '5px 16px 0px'}}>
              <HomeCarousel autoplay>
                {imgArr.map((x: any) => {
                  return (
                    <img
                      key={x.imagePath}
                      src={x.imagePath}
                      style={{ width: "100%", borderRadius: 8 }}
                      alt=""
                      onClick={() => {
                        if (x.announcementId) {
                          navigation("/announcement/" + x.announcementId);
                        }
                      }}
                    />
                  );
                })}
              </HomeCarousel>
            </div>

            {/* 跑馬燈公告 */}
            <div style={{
              padding: '0 20px'
            }}>
              <Marquee data={isEmpty(marquee) ? defaultMarquee : marquee} />
            </div>


            {/* Icon 按鈕區 */}
            <FlexDirectionRowDiv style={{
              padding: '0px 12px',
              flexWrap: 'wrap'
            }}>
              {
                !isEmpty(iconBtns) &&
                  iconBtns.map((item, idx) => (
                    <IconBtn
                      idx={idx}
                      key={item.key}
                      onClick={item.onClick}
                      style={{ ...item.style }}
                    >
                      <IconBtnImg src={item.img} />
                      <IconBtnText children={item.text} />
                    </IconBtn>
                  ))
              }
            </FlexDirectionRowDiv>

            <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
              <button style={{background:"#F4F4F6",marginLeft:12,width:"45%",height:50,border:"none",borderRadius:8,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10}} onClick={() => {
                  navigation("/recharge?symbol=USDT");
                }}>
                <p style={{fontWeight:600,fontSize:14,color:"#5F5C70",fontFamily: "Open Sans"}}>{ t('deposit') }</p>
                <img src={rechargeImg} alt="" style={{ width: 45, height: 45 }} />
              </button>
              <button style={{background:"#F4F4F6",marginRight:12,width:"45%",height:50,border:"none",borderRadius:8,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10}} onClick={() => {
                  navigation("/fiat-deal");
                }}>
                <p style={{fontWeight:600,fontSize:14,color:"#5F5C70",fontFamily: "Open Sans"}}>{ t('C2c') }</p>
                <img src={C2CImg} alt="" style={{ width: 45, height: 45 }} />
              </button>
            </div>

            <TradePairContainer>
              {data2.map((item, i) => {
                return (
                  <div key={i}>
                    {item.titleRatio !== "BUSD" && (
                      <TradePairUnit
                        onClick={() => {
                          localStorage.setItem(
                            "trade",
                            item.titleRatio + "-USDT"
                          );
                          navigation("/deal");
                        }}
                      >
                        <TradePairName>
                          {item.titleRatio}/USDT
                        </TradePairName>

                        <TradePairPercentage isPlus={item.change >= 0}>
                          {
                            (item.change >= 0)
                              ? `+${item.change}%`
                              : `${item.change}%`
                          }
                        </TradePairPercentage>

                        <TradePairCurrencyToUsd isPlus={item.change >= 0}>
                          {item.currencyToUsd}
                        </TradePairCurrencyToUsd>

                        <TradePairCurrencyFiatRate>
                          {`= ${currencySign[currencyUnit]} ${(Number(item.currencyToUsd) * fiatRate[currencyUnit]).toFixed(2)}`}
                        </TradePairCurrencyFiatRate>
                      </TradePairUnit>
                    )}
                  </div>
                );
              })}
            </TradePairContainer>

            {/* 下方 Tabs & TabContent */}
            <ChartContainer>
              <Banner />
              <ListContainer>
                <ListHeader>
                  {
                    !isEmpty(tabs) &&
                    tabs.map(item => (
                      <ListButton
                        key={item.key}
                        type="button"
                        currentList={currentList}
                        listNum={item.key}
                        onClick={() => {
                          setCurrentList(item.key);
                        }}
                      >
                        { item.text }
                      </ListButton>
                    ))
                  }
                </ListHeader>

                <ListContent>
                  <ListContentTitle>
                    <p>{t("marketPair")}</p>
                    <p>{t("lastPrice")}</p>
                    {currentList !== 3 ? (
                      <p>{t("24Hchg")}</p>
                    ) : (
                      <p>{t("24hVol")}</p>
                    )}
                  </ListContentTitle>
                  <ItemContainer>

                    {/* 熱門 - 內容 */}
                    {
                      (currentList === 0 && !isEmpty(showHotList)) && (
                        showHotList.map(item => (
                          <ListItem
                              key={item.key}
                              onClick={() => {
                                localStorage.setItem(
                                  "trade",
                                  item.name.split("-")[0] + "-USDT"
                                );
                                navigation("/deal");
                              }}
                            >
                              <ItemPair>
                                <p
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {item.name.split("-")[0]}
                                </p>
                                <p
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: "#8F8DA2",
                                    marginTop: 3,
                                    marginLeft: 4,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {` /USDT`}
                                </p>
                              </ItemPair>
                              <p
                                className="latestValue"
                                style={{
                                  fontWeight: 600,
                                  fontFamily: "Open Sans"
                                }}
                              >
                                {parseFloat(item.lastPrice) < 10 && parseFloat(item.lastPrice) > 1
                                  ? item.lastPrice.slice(0, -3)
                                  : parseFloat(item.lastPrice) < 10
                                  ? item.lastPrice.slice(0, -2)
                                  : item.lastPrice.slice(0, -4)}
                              </p>
                              <ItemRatio
                                change={item.percentageIn24H}
                              >{`${parseFloat(item.percentageIn24H).toFixed(2)}%`}</ItemRatio>
                            </ListItem>
                        ))
                      )
                    }

                    {/* 自選 - 內容 */}
                    {
                      (
                        currentList === 1
                          && !isEmpty(favorite)
                          && favorite[0].s !== ''
                      ) && (
                        favorite.map((data: any, i) => {
                          return (
                            <div key={i}>
                              {
                                <ListItem key={data.s}>
                                  <ItemPair>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 600,
                                          fontSize: 15,
                                          fontFamily: "Open Sans"
                                        }}
                                        onClick={() => {
                                          localStorage.setItem(
                                            "trade",
                                            data.s.split("-")[0] + "-USDT"
                                          );
                                          navigation("/deal");
                                        }}
                                      >
                                        {data.s.split("-")[0]}
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: 500,
                                          fontSize: 12,
                                          color: "#8F8DA2",
                                          marginTop: 3,
                                          marginLeft: 4,
                                          fontFamily: "Open Sans"
                                        }}
                                        onClick={() => {
                                          localStorage.setItem(
                                            "trade",
                                            data.s.split("-")[0] + "-USDT"
                                          );
                                          navigation("/deal");
                                        }}
                                      >
                                        {` /USDT`}
                                      </p>
                                    </div>
                                  </ItemPair>
                                  <p
                                    className="latestValue"
                                    style={{
                                      fontWeight: 600,
                                      fontFamily: "Open Sans"
                                    }}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "trade",
                                        data.s.split("-")[0] + "-USDT"
                                      );
                                      navigation("/deal");
                                    }}
                                  >
                                    {parseFloat(data.c) < 10 &&
                                    parseFloat(data.c) > 1
                                      ? data.c.slice(0, -3)
                                      : parseFloat(data.c) < 10
                                      ? data.c.slice(0, -2)
                                      : data.c.slice(0, -4)}
                                  </p>
                                  <ItemRatio
                                    change={data.P}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "trade",
                                        data.s.split("-")[0] + "-USDT"
                                      );
                                      navigation("/deal");
                                    }}
                                  >{`${data.P}%`}</ItemRatio>
                                </ListItem>
                              }
                            </div>
                          );
                        })
                      )
                    }


                    {market.map((data: any, i) => {
                      return (
                        <div key={data.s}>
                          {/* 漲幅榜 - 內容 */}
                          {currentList === 2 && parseFloat(data.P) > 0 && (
                            <ListItem
                              key={data.s}
                              onClick={() => {
                                localStorage.setItem(
                                  "trade",
                                  data.s.split("-")[0] + "-USDT"
                                );
                                navigation("/deal");
                              }}
                            >
                              <ItemPair>
                                <p
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {data.s.split("-")[0]}
                                </p>
                                <p
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: "#8F8DA2",
                                    marginTop: 3,
                                    marginLeft: 4,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {` /USDT`}
                                </p>
                              </ItemPair>
                              <p
                                className="latestValue"
                                style={{
                                  fontWeight: 600,
                                  fontFamily: "Open Sans"
                                }}
                              >
                                {parseFloat(data.c) < 10 && parseFloat(data.c) > 1
                                  ? data.c.slice(0, -3)
                                  : parseFloat(data.c) < 10
                                  ? data.c.slice(0, -2)
                                  : data.c.slice(0, -4)}
                              </p>
                              <ItemRatio
                                change={data.P}
                              >{`${parseFloat(data.P).toFixed(2)}%`}</ItemRatio>
                            </ListItem>
                          )}

                          {/* 跌幅榜 - 內容 */}
                          {currentList === 3 && parseFloat(data.P) < 0 && (
                            <ListItem
                              key={data.s}
                              onClick={() => {
                                localStorage.setItem(
                                  "trade",
                                  data.s.split("-")[0] + "-USDT"
                                );
                                navigation("/deal");
                              }}
                            >
                              <ItemPair>
                                <p
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {data.s.split("-")[0]}
                                </p>
                                <p
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: "#8F8DA2",
                                    marginTop: 3,
                                    marginLeft: 4,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {` /USDT`}
                                </p>
                              </ItemPair>
                              <p
                                className="latestValue"
                                style={{
                                  fontWeight: 600,
                                  fontFamily: "Open Sans"
                                }}
                              >
                                {parseFloat(data.c) < 10 && parseFloat(data.c) > 1
                                  ? data.c.slice(0, -3)
                                  : parseFloat(data.c) < 10
                                  ? data.c.slice(0, -2)
                                  : data.c.slice(0, -4)}
                              </p>
                              <ItemRatio
                                change={data.P}
                              >{`${parseFloat(data.P).toFixed(2)}%`}</ItemRatio>
                            </ListItem>
                          )}

                          {/* 24H成交量榜 - 內容 */}
                          {currentList === 4 && (
                            <ListItem
                              key={i}
                              onClick={() => {
                                localStorage.setItem(
                                  "trade",
                                  data.s.split("-")[0] + "-USDT"
                                );
                                navigation("/deal");
                              }}
                            >
                              <ItemPair>
                                <p
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {data.s.split("-")[0]}
                                </p>
                                <p
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: "#8F8DA2",
                                    marginTop: 3,
                                    marginLeft: 4,
                                    fontFamily: "Open Sans"
                                  }}
                                >
                                  {` /USDT`}
                                </p>
                              </ItemPair>
                              <p
                                className="latestValue"
                                style={{
                                  fontWeight: 600,
                                  fontFamily: "Open Sans"
                                }}
                              >
                                {parseFloat(data.c) < 10 && parseFloat(data.c) > 1
                                  ? data.c.slice(0, -3)
                                  : parseFloat(data.c) < 10
                                  ? data.c.slice(0, -2)
                                  : data.c.slice(0, -4)}
                              </p>
                              <ItemDeal>{`${data.v}`}</ItemDeal>
                            </ListItem>
                          )}
                        </div>
                      );
                    })}
                  </ItemContainer>
                </ListContent>
              </ListContainer>

              <NewestContainer>
                <ArrowLeft />
                <NewestCard>
                  <NewestText
                    style={{ color: "#333333" }}
                  >{`即將下架 BCX、BIFI、SBTC`}</NewestText>
                  <NewestText
                    style={{
                      marginTop: 16,
                      marginBottom: 19,
                      color: "#828282"
                    }}
                  >{`Huobi Global致力於推動區塊鏈行業健康发展，保護用户合法權益，有鑒於BCX（BitcoinX）、BIFI（Bitcoin File）、SBTC（Super Bitcoin）通證觸發《通證管理規則》第十九條的規定，Huobi Global將於新加坡時間2021年10月19日16:00停止BCX、BIFI、SBTC的交易並且進行下架處理。...`}</NewestText>
                  <ContinueReadText>{`查看全部`}</ContinueReadText>
                </NewestCard>
                <NewestCard>
                  <NewestText
                    style={{ color: "#333333" }}
                  >{`9 月 15 日將上線新幣 EDEN`}</NewestText>
                  <NewestText
                    style={{
                      marginTop: 16,
                      marginBottom: 19,
                      color: "#828282"
                    }}
                  >{`將於2021年9月15日上線EDEN (EDEN)。活動時程如下：
  9月15日19:30（GMT+8）開放EDEN充幣服務【立即充幣>>>】
  充幣量滿足市場交易需求時，將開放EDEN幣幣交易（EDEN/USDT）。具體時間將以公告形式提前通知，敬請關注！ ...`}</NewestText>
                  <ContinueReadText>{`查看全部`}</ContinueReadText>
                </NewestCard>
                <ArrowRight />
              </NewestContainer>
            </ChartContainer>
            <Footer locationPage={location} />
          </>
        )}
    </PageContainer>
  );
};

export default Home;
