import React, { useState, useEffect } from "react";
import Footer from "../../../components/footer/HomeFooter";
import styled from "styled-components";
import Back from "../../../assets/fund/back.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import Next from "../../../assets/fund/next_gray.png";
import Drawer from '../../../components/UI/Drawer'
import api from "../../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  padding: 16px 16px 16px 0px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  text-align:center;
  background-color:white;
  margin-bottom:1px;
  
`;

const Container = styled.div`
  padding: 16px 0 16px 0;
  height:65px;
  width:100%;
  margin:auto;
  background-color:white;
  
`;


const BackButton = styled.button`
  border:none;
  background-color:transparent;
  width:40px;
  height:30px;
  float:left;
  margin-top:-5px;
  margin-left:-10px;
`

const Title = styled.h2`
  color:#383743;
  font-size:16px;
  font-weight:600;
`

const BackImg = styled.img`
  width: 30px;
  height: 30px;
`;


const Withdraw = () => {
  const location = useLocation().pathname;
  const navigation = useNavigate()
  const [isDrawer, setIsDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const search = useLocation().search
  const [currency, setCurrency] = useState("")
  const [address, setAddress] = useState("")
  const [number, setNumber] = useState("")
  const { t } = useTranslation();
  useEffect(() => {
    setCurrency(search.split("=")[1])
  }, [search])

  return (
    <LoadingOverlay
      active={loading}
      spinner
    >
      <PageContainer>
        <div style={{ flex: 1 }}>

          <Header>
            <BackButton onClick={() => { navigation(-1) }}>
              <BackImg src={Back} />
            </BackButton>
            <Title>{t("widthdraw")}{currency}</Title>
          </Header>

          <Container>
            <div style={{ backgroundColor: "white", paddingBottom: "16px" }}>
              <div style={{ textAlign: "center", width: "95%", margin: "auto", marginTop: "15px", flex: 1 }}>
                <h2 style={{ textAlign: "left", color: "#5F5C70", fontSize: "13px", fontWeight: 500 }}>{currency} {t("widthdrawAddress")}</h2>
                <div style={{ width: "100%", backgroundColor: "#F4F4F6", border: "none", borderRadius: "4px", padding: "16px 10px 16px 10px", textAlign: "left", marginTop: "10px" }}>
                  <input type="text" style={{ backgroundColor: "transparent", border: "none", fontSize: "15px", fontWeight: 400, width: "100%" }} placeholder={`輸入${currency}` + t("widthdrawAddress")} onChange={event => {
                    setAddress(event.target.value)
                  }} />
                </div>
                <h2 style={{ textAlign: "left", color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginTop: "10px" }}>{t("widthdrawNetwork")}</h2>
                <button style={{ width: "100%", backgroundColor: "#F4F4F6", border: "none", borderRadius: "4px", padding: "16px 10px 16px 10px", textAlign: "left", marginTop: "10px" }} onClick={() => {
                  // setIsDrawer(true)
                }}>
                  <p style={{ float: "left", color: "#8F8DA2" }}>TRC (TRC20)</p>
                  {/* <img src={Next} style={{width:"7px",height:"14px",float:"right"}} alt=""/> */}
                </button>
                <h2 style={{ textAlign: "left", color: "#5F5C70", fontSize: "13px", fontWeight: 500, marginTop: "15px" }}>MEMO</h2>
                <button style={{ width: "100%", backgroundColor: "#F4F4F6", border: "none", borderRadius: "4px", padding: "16px 10px 16px 10px", textAlign: "left", marginTop: "10px", marginBottom: "20px" }}>
                  <input type="text" style={{ backgroundColor: "transparent", border: "none", fontSize: "15px", fontWeight: 400, width: "100%" }} placeholder={t("optional")} />
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ textAlign: "left", color: "#5F5C70", fontSize: "13px", fontWeight: 500 }}>{t("amount")}</h2>
                  {/* <p style={{color:"#383743",fontSize:"12px",fontWeight:400}}>可用 0.17947065 BTC</p> */}
                </div>
                <div style={{ width: "100%", backgroundColor: "#F4F4F6", border: "none", borderRadius: "4px", padding: "16px 10px 16px 10px", textAlign: "left", marginTop: "10px" }}>
                  <input type="text" style={{ backgroundColor: "transparent", border: "none", fontSize: "15px", fontWeight: 400, width: "100%" }} placeholder={t("enterWidthdrawAmount")} onChange={event => {
                    setNumber(event.target.value)
                  }} />
                </div>
              </div>
            </div>
            <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", marginTop: "20px" }}>
                <p style={{ color: "#8F8DA2", fontSize: "13px", fontWeight: 500 }}>{t("withdrawFee")}</p>
                <p style={{ color: "#383743", fontSize: "15px", fontWeight: 400 }}>0.00000000 {currency}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", marginTop: "20px" }}>
                <p style={{ color: "#8F8DA2", fontSize: "13px", fontWeight: 500 }}>實際到帳</p>
                <p style={{ color: "#383743", fontSize: "24px", fontWeight: 700 }}>0 {currency}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", marginTop: "20px" }}>
                <button style={{ backgroundColor: "#D32F2F", color: "white", borderRadius: "4px", width: "100%", padding: "16px 0 16px 0", border: "none" }} onClick={() => {
                  if (!address) {
                    alert("請輸入地址")
                  } else if (!number) {
                    alert(t("fiatSellQty"))
                  } else {
                    setLoading(true)
                    api.postData("/wallet/withdraw", { amount: number, address: address }).then(x => {
                      console.log(x)
                      setLoading(false)
                      if (x.status !== 400) {
                        alert("提現成功")
                        navigation("/fund")
                      } else {
                        alert(x.data.msg)
                      }
                    })
                  }
                }}>{t("widthdraw")}</button>
              </div>
            </div>
          </Container>
          <Drawer isVisible={isDrawer} selectVisible={() => { }} height={270}>
            <div>
              {/* <button style={{border:"none",backgroundColor:"transparent"}} onClick={()=>{
                  setIsDrawer(false)
                }}>
                <img src={Cancel} alt="" style={{width:"15px",height:"15px"}}/>
              </button> */}
              <h2 style={{ textAlign: "center", color: "#383743", fontSize: "16px", fontWeight: 600 }}>{t("network")}</h2>
              {/* <button  style={{border:"none",backgroundColor:"transparent",color:"#8F8DA2",fontSize:"14px",fontWeight:500}} onClick={()=>{
                  setIsDrawer(false)
                }}>確定</button> */}
            </div>
            <button style={{ height: "35px", marginBottom: "10px", border: "none", borderBottom: "1px solid #F4F4F6", width: "100%", backgroundColor: "transparent" }} onClick={() => {
              setIsDrawer(false)
            }}>
              <p style={{ marginLeft: "10px", color: "#BDBCC8", fontSize: "14px", fontWeight: 600 }}>Ethereum</p>

            </button>
            <button style={{ height: "35px", marginBottom: "10px", border: "none", borderBottom: "1px solid #F4F4F6", width: "100%", backgroundColor: "transparent" }} onClick={() => {
              setIsDrawer(false)
            }}>
              <p style={{ marginLeft: "10px", color: "#BDBCC8", fontSize: "14px", fontWeight: 600 }}>BTC</p>

            </button>
            <button style={{ height: "35px", marginBottom: "10px", border: "none", borderBottom: "1px solid #F4F4F6", width: "100%", backgroundColor: "transparent" }} onClick={() => {
              setIsDrawer(false)
            }}>
              <p style={{ marginLeft: "10px", color: "#BDBCC8", fontSize: "14px", fontWeight: 600 }}>Bitcoin Chain</p>

            </button>
            <button style={{ height: "35px", marginBottom: "10px", border: "none", width: "100%", backgroundColor: "transparent" }} onClick={() => {
              setIsDrawer(false)
            }}>
              <p style={{ marginLeft: "10px", color: "#BDBCC8", fontSize: "14px", fontWeight: 600 }}>Bitcoin SmartChain</p>

            </button>

          </Drawer>

        </div>
        <Footer locationPage={location} />
      </PageContainer>
    </LoadingOverlay>
  );
};

export default Withdraw;
