import {
  useState,
  useContext,
  useEffect
} from "react";

// # API
import api from "@/common/api";

// % context
import { AppContext,PriceContext } from "@/store/select-context";
import { useGlobalCtx } from '@/components/Layout/GlobalContext';

// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// - Images
import Cancel from "@/assets/icon/cancel.png";
import searchIcon from "@/assets/icon/Deal/search.png";
import noSearch from "@/assets/icon/no-item-find.png";
import Footer from "@/components/footer/HomeFooter";
import selecetIcon from "@/assets/icon/cramstar.png";
import nonSelecetIcon from "@/assets/icon/Deal/emptyStar.png";

// ^ Plugins
import { Link } from "react-router-dom";
import { orderBy } from "lodash"
import { useTranslation } from "react-i18next";

// = Styled Component
import {
  PageContainer,
  SearchContainer,
  LinkText,
  SelectIcon,
  SearchDealTitleContainer,
  TitleButton,
  CurrencyList,
  CurrencyItem,
  ContractItem,
  LatestItem,
  RatioItem
} from '@/styled-components/search-deal'

/**
 * @author odin
 * @level Layout/Deal/SearchDeal
 * @description 交易的搜尋頁面
*/
const Chart = () => {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { dispatch } = useContext(AppContext);
  const { marketArr } : any = useContext(PriceContext);
  const {
    // handleAPIErr,
    isLogin
  } = useGlobalCtx();

  // # states
  const [searchText, setSearchText] = useState("");
  const [market, setMarket] = useState([{
    E:"",
    P:"",
    c:"",
    e:"",
    p:"",
    s:"",
    v:"",
    w:"",
    m:""
  }]);
  const [favorite, setFavorite] = useState([""]);

  // - methods
  const getFavorite = () => {
    api.get("/investor/favorite").then(x => {
      if(x.status !== 401 && x.status !== 400){
        setFavorite(x.data);
      }else if(x.status === 401){
        localStorage.removeItem("token")
      }else{
        alert(x.data.msg)
      }
    });
  };

  // * hooks
  useEffect(()=>{
    const gfg = orderBy(marketArr,["s"]);

    setMarket(gfg);

    if(isLogin){
      getFavorite();
    }
  },[marketArr, isLogin]);

  return (
    <PageContainer>
      <SearchContainer>
        <SelectIcon
          style={{
            width: 28,
            height: 28,
            position: "absolute",
            left: 16,
            top: 22,
          }}
          src={searchIcon}
          alt="cancel"
        />
        <input
          style={{
            width: 307,
            height: 32,
            paddingLeft: 40,
            background: COLORS.EXLight_gray,
            borderRadius: 4,
            borderColor: "transparent",
          }}
          placeholder={t("search")}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value.trim());
          }}
        />
        <LinkText to="/deal">
          <SelectIcon src={Cancel} alt="cancel" />
        </LinkText>
      </SearchContainer>
      <SearchDealTitleContainer>
        <TitleButton>
          <p onClick={dispatch.bind(null, { type: "two" })}>{t("futuresList")}</p>
        </TitleButton>
        <TitleButton
          style={{
            justifyContent: "center",
          }}
        >
          <p>{t("lastPrice")}</p>
        </TitleButton>
        <TitleButton
          style={{
            marginRight: 5,
            justifyContent: "flex-end",
          }}
        >
          <p>{t("24Hchg")}</p>
        </TitleButton>
      </SearchDealTitleContainer>
      <CurrencyList>
        {market
          .filter((item:any) => {
            if (!searchText) {
              return true;
            } else {
              return item.s
                .toLowerCase()
                .indexOf(searchText.toLowerCase()) === -1
                ? false
                : true;
            }
          })
          .map((e:any) => {
            return (
              <div>
              <CurrencyItem key={e.id}>
                <ContractItem onClick={()=>{
                  localStorage.setItem("trade",e.s)
                }}>
                  {favorite.includes(e.s) ?<img
                      onClick={()=>{
                        if(localStorage.getItem("token")){
                          api
                                .deleteData("/investor/favorite", {
                                  symbol: e.s
                                })
                                .then(x => {
                                  if (x.status !== 400) {
                                    getFavorite();
                                  } else {
                                    alert(x.data.msg);
                                  }
                                });
                        }else{
                          alert("請先登入")
                        }
                      }}
                      style={{ width: 24, height: 24, marginRight: 10 }}
                      src={selecetIcon}
                      alt="cancel"
                    /> :
                  <img
                  onClick={()=>{
                    if(localStorage.getItem("token")){
                    api
                                .postData("/investor/favorite", {
                                  symbol: e.s
                                })
                                .then(x => {
                                  if (x.status !== 400) {
                                    getFavorite();
                                  } else {
                                    alert(x.data.msg);
                                  }
                                });
                              }
                              else{
                                alert("請先登入")
                              }
                  }}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                  src={nonSelecetIcon}
                  alt="cancel"
                />}
                  <Link
                    to="/deal"
                    style={{
                      fontSize: 14,
                      color: COLORS.Gray,
                      fontWeight: 600,
                    }}
                  >
                    {e.s}
                  </Link>
                  <Link
                    to="/deal"
                    style={{
                      fontSize: 13,
                      color: COLORS.Light_gray,
                      fontWeight: 600,
                    }}
                  >
                    {`/${(parseFloat(e.c) < 10 && parseFloat(e.c) > 1) ? e.c.slice(0, -3) : parseFloat(e.c) < 10 ? e.c.slice(0, -2) :e.c.slice(0, -4)}`}
                  </Link>
                </ContractItem>
                <LatestItem to="/deal">{e.latest}</LatestItem>
                <RatioItem ratio={e.P} to="/deal">{`${parseFloat(e.P) > 0 ? "+" : ""}${
                  e.P
                }%`}</RatioItem>
              </CurrencyItem>
              </div>
            );
          })}
        {market.filter((item:any) => {
          if (!searchText) {
            return true;
          } else {
            return item.s.toLowerCase().indexOf(searchText.toLowerCase()) ===
              -1
              ? false
              : true;
          }
        }).length === 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 48,
            }}
          >
            <img
              src={noSearch}
              alt="no answer"
              style={{ width: 135, height: 135 }}
            />
            <p
              style={{
                fontWeight: 500,
                fontSize: 13,
                color: COLORS.Light_gray,
                marginTop: 24,
              }}
            >
              無結果
            </p>
          </div>
        )}
      </CurrencyList>
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default Chart;
