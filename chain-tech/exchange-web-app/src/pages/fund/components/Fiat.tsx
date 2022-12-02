import React, { useState, useEffect } from "react";

// # ApI
import api from "@/common/api";

// ? Self-packed Components || Functions
import Drawer from "../../../components/UI/Drawer";
import { COLORS } from "@/constants/colors";

// - Images
import History from "@/assets/fund/historical_record.png";
import USDT from "@/assets/fund/usdt.png";
// import BTC from "@/assets/fund/bitcoin.png";
// import ETH from "@/assets/fund/eth.png";
// import BUSD from "@/assets/fund/busd.png";
// import transfer from "@/assets/icon/Deal/transfer.png";

// ^ Plugins
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// = Styled Component
import styled from "styled-components";

const Container = styled.div``;

const SpotContainer = styled.div`
  height: 118px;
  padding: 16px;
  margin-bottom: 8px;
`;
const SpotContainerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SpotTitle = styled.h2`
  color: ${COLORS.Gray};
  font-size: 15px;
  font-weight: 400;
  font-family: PingFang TC;
  float: left;
`;
const FundIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-top: -5px;
`;

// const TransferIcon = styled.img`
//   width: 30px;
//   height: 30px;
//   margin-top: -5px;
// `;

const SpotIconButton = styled.button`
  width: 40px;
  border: none;
  background-color: transparent;
  height: 30px;
  margin-top: -5px;
  display: flex;
`;

const SpotContent = styled.div`
  margin-top: 40px;
`;
const SpotCurrency = styled.span`
  color: ${COLORS.Dark_gray};
  font-size: 13px;
  font-weight: 600;
  font-family: Open Sans;
  margin-left: 5px;
`;

const SpotUSDTPrice = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 24px;
  font-weight: 700;
  font-family: Open Sans;
  margin-right: 5px;
`;

const SpotTWDPrice = styled.h2`
  color: ${COLORS.Mid_gray};
  font-size: 13px;
  font-weight: 600;
  font-family: Open Sans;
  margin-top: 5px;
`;

// const LeftButton = styled.h2`
//   width: 45%;
//   height: 38px;
//   border-radius: 4px;
//   background-color: ${COLORS.EXLight_gray};
//   color: ${COLORS.Gray};
//   font-size: 14px;
//   font-weight: 500;
//   font-family: PingFang TC;
//   text-align: center;
//   line-height: 38px;
// `;

const RightButton = styled.h2`
  width: 100%;
  height: 38px;
  border-radius: 4px;
  background-color: ${COLORS.Primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family: PingFang TC;
  text-align: center;
  line-height: 38px;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 16px 16px;
`;

const Line = styled.div`
  height: 8px;
  background-color: ${COLORS.EXLight_gray};
`;
const CurrencyContainer = styled.div`
  width: 100%;
  height: 73px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${COLORS.EXLight_gray};
`;

const CurrencyLeft = styled.div`
  display: flex;
`;

const CurrencyRight = styled.div``;
const Currency = styled.div`
  margin-left: 12px;
`;

const CurrencyImg = styled.img`
  width: 30px;
  height: 30px;
`;

const CurrencyTopText = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 15px;
  font-weight: 500;
  font-family: Open Sans;
`;

const CurrencyBottomText = styled.h2`
  color: ${COLORS.Mid_gray};
  font-size: 12px;
  font-weight: 500;
  margin-top: 3px;
  font-family: Open Sans;
`;

const PriceText = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 16px;
  font-weight: 700;
`;

const PriceText2 = styled.h2`
  color: ${COLORS.Gray};
  font-size: 15px;
  font-weight: 400;
`;
interface ContractProps {
  isLogin: boolean;
  currencyUnit: string;
  nowRate: number;
}

const Fiat = ({ isLogin, currencyUnit, nowRate }: ContractProps) => {

  // $ init data
  const navigation = useNavigate();
  const { t } = useTranslation();

  // # states
  const [currencyDrawer, setCurrencyDrawer] = useState(false);
  const [isWithdraw] = useState(false);
  const [total, setTotal] = useState(0);
  const [freeze, setFreeze] = useState(0);

  // - methods
  const getFund = () => {
    let user = JSON.parse(localStorage.getItem("user")!);
    api.get("/otc/api/user/" + user.account).then(x => {
      console.log(x.wallet.coins);
      if (x.status !== 400) {
        for (let i = 0; i < x.wallet.coins.length; i++) {
          if (x.wallet.coins[i].symbol === "USDT") {
            setTotal(x.wallet.coins[i].balance);
            setFreeze(x.wallet.coins[i].freeze);
          }
        }
      }
    });
  };

  // * hooks
  useEffect(() => {
    if (isLogin) {
      getFund();
    }
  }, [isLogin]);

  return (
    <Container>
      <SpotContainer>
        <SpotContainerHeader>
          <SpotTitle>{t("fundTotal")}</SpotTitle>
          <div style={{ display: "flex" }}>
            <SpotIconButton
              onClick={() => {
                navigation("/spot-history");
              }}
            >
              <FundIcon src={History} />
            </SpotIconButton>
            {/* <SpotIconButton onClick={()=>{navigation("/fundTransfer")}}> 
            <TransferIcon src={transfer} />
          </SpotIconButton> */}
          </div>
        </SpotContainerHeader>
        <SpotContent>
          <SpotUSDTPrice>
            {total}
            <SpotCurrency>USDT</SpotCurrency>
          </SpotUSDTPrice>
          <SpotTWDPrice>
            ≈ {total * nowRate} {currencyUnit}
          </SpotTWDPrice>
        </SpotContent>
      </SpotContainer>
      <ButtonContainer>
        <RightButton
          onClick={() => {
            navigation("/otcFundTransfer");
          }}
        >
          {t("fundingTransfer")}
        </RightButton>
      </ButtonContainer>
      <Line></Line>
      <CurrencyContainer>
        <CurrencyLeft>
          <Currency>
            <PriceText2>{t("freezeAmount")}</PriceText2>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <PriceText>{freeze}</PriceText>
        </CurrencyRight>
      </CurrencyContainer>
      <CurrencyContainer>
        <CurrencyLeft>
          <CurrencyImg src={USDT} />
          <Currency>
            <CurrencyTopText>USDT</CurrencyTopText>
            <CurrencyBottomText>TetherUS</CurrencyBottomText>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <PriceText>{total}</PriceText>
        </CurrencyRight>
      </CurrencyContainer>
      {/* <CurrencyContainer>
        <CurrencyLeft>
            <CurrencyImg src={BTC} />
            <Currency>
                <CurrencyTopText>BTC</CurrencyTopText>
                <CurrencyBottomText>Bitcoin</CurrencyBottomText>
            </Currency>
        </CurrencyLeft>
        <CurrencyRight>
            <PriceText>{btc}</PriceText>
        </CurrencyRight>
      </CurrencyContainer>
      <CurrencyContainer>
        <CurrencyLeft>
            <CurrencyImg src={ETH} />
            <Currency>
                <CurrencyTopText>ETH</CurrencyTopText>
                <CurrencyBottomText>Ethereum</CurrencyBottomText>
            </Currency>
        </CurrencyLeft>
        <CurrencyRight>
            <PriceText>{eth}</PriceText>
        </CurrencyRight>
      </CurrencyContainer> */}
      {/* <CurrencyContainer>
        <CurrencyLeft>
            <CurrencyImg src={BUSD} style={{width:40,height:35,marginLeft:-5}}/>
            <Currency style={{marginLeft:5}}>
                <CurrencyTopText>BUSD</CurrencyTopText>
                <CurrencyBottomText>BUSD</CurrencyBottomText>
            </Currency>
        </CurrencyLeft>
        <CurrencyRight>
            <PriceText>{busd}</PriceText>
        </CurrencyRight>
      </CurrencyContainer> */}
      <Drawer isVisible={currencyDrawer} selectVisible={() => { }} height={180}>
        <h2
          style={{
            textAlign: "center",
            color: "#383743",
            fontSize: "16px",
            fontWeight: 600
          }}
        >
          {isWithdraw ? t("widthdraw") : t("deposit")}
        </h2>
        <div>
          <button
            style={{
              height: "35px",
              marginBottom: "10px",
              border: "none",
              borderBottom: "1px solid #F4F4F6",
              width: "100%",
              backgroundColor: "transparent"
            }}
            onClick={() => {
              if (isWithdraw) {
                navigation("/withdraw?symbol=USDT", {
                  state: { currency: "USDT" }
                });
              } else {
                navigation("/recharge?symbol=USDT", {
                  state: { currency: "USDT" }
                });
              }
            }}
          >
            <img
              src={USDT}
              style={{ width: "24px", height: "24px", float: "left" }}
              alt=""
            />
            <p
              style={{
                marginLeft: "10px",
                float: "left",
                fontFamily: "Open Sans",
                fontWeight: 500
              }}
            >
              USDT
            </p>
          </button>
          {/* <button style={{height:"35px",marginBottom:"10px",border:"none",borderBottom:"1px solid #F4F4F6",width:"100%",backgroundColor:"transparent"}}  onClick={()=>{            
            if(isWithdraw){
              navigation("/withdraw?symbol=BTC",{ state: {currency:"BTC"} })
            }else{
              navigation("/recharge?symbol=BTC",{ state: {currency:"BTC"} })
            }
            }}>
            <img src={BTC} style={{width:"24px",height:"24px",float:"left"}} alt=""/>
            <p style={{marginLeft:"10px",float:"left"}}>BTC</p>
          </button>
          <button style={{height:"35px",border:"none",backgroundColor:"transparent",width:"100%"}}  onClick={()=>{            
            if(isWithdraw){
              navigation("/withdraw?symbol=ETH",{ state: {currency:"ETH"} })
            }else{
              navigation("/withdraw?symbol=ETH",{ state: {currency:"ETH"} })
            }
            }}>
            <img src={ETH} style={{width:"24px",height:"24px",float:"left" }} alt=""/>
            <p style={{marginLeft:"10px",float:"left"}}>ETH</p>
          </button> */}
        </div>
        <button
          style={{
            height: "40px",
            backgroundColor: "#F4F4F6",
            border: "none",
            color: "#5F5C70",
            fontSize: "14px"
          }}
          onClick={() => {
            setCurrencyDrawer(false);
          }}
        >
          {t("cancel")}
        </button>
      </Drawer>
    </Container>
  );
};

export default Fiat;
