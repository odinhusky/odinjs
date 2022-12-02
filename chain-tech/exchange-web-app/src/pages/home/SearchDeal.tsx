import { useState, useContext, useEffect } from "react";
import { AppContext, PriceContext } from "../../store/select-context";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Cancel from "../../assets/icon/cancel.png";
import searchIcon from "../../assets/icon/Deal/search.png";
import noSearch from "../../assets/icon/no-item-find.png";
import { COLORS } from "../../constants/colors";
import Footer from "../../components/footer/HomeFooter";
import selecetIcon from "../../assets/icon/cramstar.png";
import nonSelecetIcon from "../../assets/icon/Deal/emptyStar.png";
// import arrowDefault from "../../assets/icon/Deal/arrow-default.png";
// import arrowUp from "../../assets/icon/Deal/sort-arrow-up.png";
// import arrowDown from "../../assets/icon/Deal/sort-arrow-down.png";
import api from "../../common/api";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid ${COLORS.EXLight_gray};
  padding: 20px 12px 6px 16px;
  position: relative;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
`;
const LinkText = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #383743;
`;
const SelectIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 7px;
`;
const TitleContainer = styled.div`
  width: 100%;
  height: 44px;
  border-bottom: 0.5px solid ${COLORS.EXLight_gray};
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
`;
const TitleButton = styled.div`
  width: 80px;
  height: 24px;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: ${COLORS.Mid_gray};
`;
// const ArrowContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin-left: 8px;
// `;
// const ArrowImage = styled.img`
//   width: 24px;
//   height: 24x;
// `;
const CurrencyList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 12px;
  padding-bottom: 100px;
`;
const CurrencyItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 16px;
  margin-bottom: 18px;
`;
const ContractItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 18px;
  width: 30%;
`;
const LatestItem = styled(Link)`
  font-weight: 600;
  font-size: 13px;
  color: ${COLORS.Gray};
  width: 20%;
  margin-right: 30px;
`;
const RatioItem = styled(Link)<{ ratio: number }>`
  width: 15%;
  font-weight: 600;
  font-size: 13px;
  color: ${props => (props.ratio < 0 ? COLORS.Red : COLORS.Green)};
  margin-right: 10px;
`;

const Chart = () => {
  const [searchText, setSearchText] = useState("");
  // const [isSelectByAlpha, setIsSelectByAlpha] = useState("default");
  // const [isSelectByPrice, setIsSelectByPrice] = useState("default");
  // const [isSelectByRatio, setIsSelectByRatio] = useState("default");
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
  const [favorite, setFavorite] = useState([""]);
  const context = useContext(AppContext);
  const { marketArr }: any = useContext(PriceContext);
  const { t } = useTranslation();
  const { dispatch } = context;
  // const { selectItem } = state;

  // const isInSelectList = (current: string, list: string[]) => {
  //   let result = false;
  //   if (!current || !!!list) {
  //     return false;
  //   }
  //   list.forEach((item) => {
  //     if (item === current) {
  //       result = true;
  //     }
  //   });
  //   return result;
  // };
  // const isSortList = (select: string, index: number) => {
  //   if (index === 1) {
  //     setIsSelectByAlpha(select);
  //   } else if (index === 2) {
  //     setIsSelectByPrice(select);
  //   }
  //   if (index === 3) {
  //     setIsSelectByRatio(select);
  //   }
  //   setIsSelect(select);
  // };
  const getFavorite = () => {
    api.get("/investor/favorite").then(x => {
      if (x.status !== 401 && x.status !== 400) {
        setFavorite(x.data);
        // let a = [];
        // for(let i = 0;i < x.data.length;i++){
        //   for(let j = 0;j<context.length;j++){
        //     if(x.data[i].split("-")[0]+x.data[i].split("-")[1] == context[j].s){
        //       a.push(context[j])
        //     }
        //   }
        // }
      } else if (x.status === 401) {
        localStorage.removeItem("token");
      } else {
        alert(x.data.msg);
      }
    });
  };
  useEffect(() => {
    let gfg = _.orderBy(marketArr, ["s"]);
    setMarket(gfg);
    if (localStorage.getItem("token")) {
      getFavorite();
    }
  }, [marketArr]);
  return (
    <PageContainer>
      <SearchContainer>
        <SelectIcon
          style={{
            width: 28,
            height: 28,
            position: "absolute",
            left: 16,
            top: 22
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
            borderColor: "transparent"
          }}
          placeholder={t("search")}
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value.trim());
          }}
        />
        <LinkText to="/home">
          <SelectIcon src={Cancel} alt="cancel" />
        </LinkText>
      </SearchContainer>
      <TitleContainer>
        <TitleButton>
          <p onClick={dispatch.bind(null, { type: "two" })}>
            {t("futuresList")}
          </p>
          {/* <ArrowContainer>
            {isSelectByAlpha === "default" ? (
              <ArrowImage
                src={arrowDefault}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByAlphabetAscending", 1)}
              />
            ) : isSelectByAlpha === "ByAlphabetAscending" ? (
              <ArrowImage
                src={arrowUp}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByAlphabetDescending", 1)}
              />
            ) : (
              <ArrowImage
                src={arrowDown}
                alt="arrowUp"
                onClick={isSortList.bind(null, "default", 1)}
              />
            )}
          </ArrowContainer> */}
        </TitleButton>
        <TitleButton
          style={{
            justifyContent: "center"
          }}
        >
          <p>{t("lastPrice")}</p>
          {/* <ArrowContainer>
            {isSelectByPrice === "default" ? (
              <ArrowImage
                src={arrowDefault}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByPriceAscending", 2)}
              />
            ) : isSelectByPrice === "ByPriceAscending" ? (
              <ArrowImage
                src={arrowUp}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByPriceDescending", 2)}
              />
            ) : (
              <ArrowImage
                src={arrowDown}
                alt="arrowUp"
                onClick={isSortList.bind(null, "default", 2)}
              />
            )}
          </ArrowContainer> */}
        </TitleButton>
        <TitleButton
          style={{
            marginRight: 5,
            justifyContent: "flex-end"
          }}
        >
          <p>{t("24Hchg")}</p>
          {/* <ArrowContainer>
            {isSelectByRatio === "default" ? (
              <ArrowImage
                src={arrowDefault}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByRatioAscending", 3)}
              />
            ) : isSelectByRatio === "ByRatioAscending" ? (
              <ArrowImage
                src={arrowUp}
                alt="arrowUp"
                onClick={isSortList.bind(null, "ByRatioDescending", 3)}
              />
            ) : (
              <ArrowImage
                src={arrowDown}
                alt="arrowUp"
                onClick={isSortList.bind(null, "default", 3)}
              />
            )}
          </ArrowContainer> */}
        </TitleButton>
      </TitleContainer>
      <CurrencyList>
        {market
          .filter((item: any) => {
            if (!searchText) {
              return true;
            } else {
              return item.s.toLowerCase().indexOf(searchText.toLowerCase()) ===
                -1
                ? false
                : true;
            }
          })
          .map((e: any) => {
            return (
              <div>
                <CurrencyItem key={e.id}>
                  <ContractItem
                    onClick={() => {
                      localStorage.setItem("trade", e.s);
                    }}
                  >
                    {favorite.includes(e.s) ? (
                      <img
                        onClick={() => {
                          if (localStorage.getItem("token")) {
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
                          } else {
                            alert("請先登入");
                          }
                        }}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        src={selecetIcon}
                        alt="cancel"
                      />
                    ) : (
                      <img
                        onClick={() => {
                          if (localStorage.getItem("token")) {
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
                          } else {
                            alert("請先登入");
                          }
                        }}
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        src={nonSelecetIcon}
                        alt="cancel"
                      />
                    )}

                    {/* {isInSelectList(e.cur, selectItem) ? (
                    <img
                      onClick={dispatch.bind(null, {
                        type: "REMOVE_SELECT",
                        data: e.cur,
                      })}
                      style={{ width: 24, height: 24, marginRight: 10 }}
                      src={selecetIcon}
                      alt="cancel"
                    />
                  ) : (
                    <img
                      onClick={dispatch.bind(null, {
                        type: "ADD_SELECT",
                        data: e.cur,
                      })}
                      style={{ width: 24, height: 24, marginRight: 10 }}
                      src={nonSelecetIcon}
                      alt="cancel"
                    />
                  )} */}
                    <Link
                      to="/deal"
                      style={{
                        fontSize: 14,
                        color: COLORS.Gray,
                        fontWeight: 600
                      }}
                    >
                      {e.s}
                    </Link>
                    <Link
                      to="/deal"
                      style={{
                        fontSize: 13,
                        color: COLORS.Light_gray,
                        fontWeight: 600
                      }}
                    >
                      {`/${
                        parseFloat(e.c) < 10 && parseFloat(e.c) > 1
                          ? e.c.slice(0, -3)
                          : parseFloat(e.c) < 10
                          ? e.c.slice(0, -2)
                          : e.c.slice(0, -4)
                      }`}
                    </Link>
                  </ContractItem>
                  <LatestItem to="/deal">{e.latest}</LatestItem>
                  <RatioItem ratio={e.P} to="/deal">{`${
                    parseFloat(e.P) > 0 ? "+" : ""
                  }${e.P}%`}</RatioItem>
                </CurrencyItem>
              </div>
            );
          })}
        {market.filter((item: any) => {
          if (!searchText) {
            return true;
          } else {
            return item.s.toLowerCase().indexOf(searchText.toLowerCase()) === -1
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
              marginTop: 48
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
                marginTop: 24
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
