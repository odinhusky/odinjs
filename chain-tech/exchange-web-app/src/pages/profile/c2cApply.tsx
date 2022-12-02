import { useEffect, useState } from "react"

/* 引入styled components */

// # API
import api from "@/common/api"

// - Images
import Footer from "@/components/footer/HomeFooter";
//轉向網址

// ? Self-packed Components || Functions
import C2CHeader from "@/components/header/c2cApplyHeader";

// ^ Plugins
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isEmpty } from 'lodash';

// = Styled Component
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

/**
 * @author odin
 * @level Layout/C2c/C2cApply
 * @description 申請商家質押
*/
const C2cApply = () => {

  // $ init data
  const location = useLocation().pathname;
  const { t } = useTranslation();
  const defaultLevel = {
    conditionCompleteAmount: 0,
    conditionCompleteOrders: 0,
    conditionCompleteRate: 0,
    conditionCompleteUsers: 0,
    deposit: 0,
    id: 0,
    isSpecial: false,
    maxAmountPerDay: 0,
    maxAmountPerOrder: 0,
    name: ""
  };

  // # states
  const [obj, setObj] = useState({
    completeAmount: 0,
    completeOrders: 0,
    completeRate: 0,
    completeUsers: 0
  });

  const [level, setLevel] = useState([
    { ...defaultLevel }
  ]);

  const [currentLevel, setCurrentLevel] = useState({ ...defaultLevel });

  const [advertiserLevel, setAdvertiserLevel] = useState("");
  const [index, setIndex] = useState(0);
  const [userAccount, setUserAccount] = useState("");

  // - methods
  async function getData() {
    let user = localStorage.getItem("user");
    setUserAccount(JSON.parse(user!).account)
    api.get(`/otc/api/user/${JSON.parse(user!).account}`).then(x => {
      api.get("/otc/api/advertiserLevel/").then(y => {
        if(isEmpty(y)) return;

        setLevel(y);

        if (x.advertiserLevel) {
          for (let i = 0; i < y.length; i++) {
            if (x.advertiserLevel.name === y[i].name) {
              if (i + 1 < y.length) {
                setCurrentLevel(y[i + 1]);
                setIndex(i + 1)
              } else {
                setCurrentLevel(y[i]);
                setIndex(i)
              }
            }
          }
        } else {
          setCurrentLevel(y[0]);
        }
      });
      api
        .get(
          `/otc/api/user/${JSON.parse(user!).account}/advertiserLevel/condition`
        )
        .then(z => {
          setObj(z);
        });
      if (x.advertiserLevel) {
        setAdvertiserLevel(x.advertiserLevel.name);
      }
    });
  }

  // * hooks
  useEffect(() => {
    getData()
  }, []);

  return (
    <PageContainer>
      <C2CHeader />
      <div style={{ background: "white", flex: 1, padding: 16 }}>
        { (level[0].id !== 0) &&
          level.map((x: any, i) => {
            return (
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 16, border: "1px solid #DEDDE3", borderRadius: 4, marginBottom: 10, borderColor: obj.completeAmount >= currentLevel.conditionCompleteAmount && obj.completeOrders >= currentLevel.conditionCompleteOrders && obj.completeRate >= currentLevel.conditionCompleteRate && obj.completeUsers >= currentLevel.conditionCompleteUsers && advertiserLevel !== x.name && index === i ? "black" : "#DEDDE3" }}>
                <p style={{ color: "#8F8DA2", fontWeight: 700, fontSize: 16 }}>{x.name}</p>
                {advertiserLevel === x.name && (
                  <p style={{ color: "#8F8DA2", fontWeight: 500, fontSize: 13 }}>目前等級</p>
                )}
              </div>
            )
          })}
        <div style={{ width: "100%", background: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("stackAmount")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{currentLevel.deposit}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>USDT</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("maxAmountPer")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{currentLevel.maxAmountPerOrder}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>USDT</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("maxAmountPerDay")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#383743" }}>{currentLevel.maxAmountPerDay}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>USDT</p>
              </div>
            </div>
          </div>
          <div style={{ width: "95%", height: 1, backgroundColor: "#F4F4F6", marginTop: 16, marginBottom: 16 }}></div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#383743", marginBottom: 16 }}>{t("levelRestrict")}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("fiatTraderNum")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#D32F2F" }}>{obj.completeUsers}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>/{currentLevel.conditionCompleteUsers}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("fiatTradeNum")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#D32F2F" }}>{obj.completeOrders}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>/{currentLevel.conditionCompleteOrders}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("accumulatedAmount")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#D32F2F" }}> {obj.completeAmount}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>/{currentLevel.conditionCompleteAmount}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2" }}>{t("completeRate")}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 600, color: "#D32F2F" }}>{obj.completeRate}</p>
                <p style={{ fontFamily: "PingFang TC", fontSize: 13, fontWeight: 500, color: "#8F8DA2", marginLeft: 8 }}>/{currentLevel.conditionCompleteRate}</p>
              </div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "12px", backgroundColor: "#D32F2F", fontSize: "14px", border: "none", borderRadius: "4px", color: "white", marginTop: 20 }} onClick={() => {
            if (advertiserLevel === level[level.length - 1].name) {
              alert(t("highestLevel"))
            } else{
              var yes = window.confirm('升級後將自動從法幣錢包餘額扣除押金，是否繼續升級？');

            if (yes) {
                api.put(`/otc/api/user/${userAccount}/advertiserLevel/${currentLevel.id}`).then(x => {
                  console.log(x)
                  if (x.status !== 400) {
                    getData()
                  } else {
                    alert(x.data.msg)
                  }
                })
            } else {

            }
            }

          }}>
            { advertiserLevel === level[level.length - 1].name ? t("highestLevel") : t("fiatUpgrade") }
          </button>
        </div>
      </div>
      <Footer locationPage={location} />
    </PageContainer>
  );
};

export default C2cApply;
