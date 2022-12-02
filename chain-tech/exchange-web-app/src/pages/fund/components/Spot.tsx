import React, { useState, useEffect } from "react";

// # API
import api from "@/common/api";

// ? Self-packed Components || Functions
import Drawer from "../../../components/UI/Drawer";
import CryptoIcon from "@/pages/fund/components/CryptoIcon";

// - Images
import transfer from "@/assets/icon/Deal/transfer.png";
import History from "@/assets/fund/historical_record.png";

// ^ Plugins
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// = Styled Component
import {
  SpotContainer,
  SpotContainerHeader,
  SpotTitle,
  FundIcon,
  TransferIcon,
  SpotIconButton,
  SpotContent,
  SpotCurrency,
  SpotUSDTPrice,
  SpotTWDPrice,
  LeftButton,
  RightButton,
  ButtonContainer,
  Line,
  CurrencyContainer,
  CurrencyLeft,
  CurrencyRight,
  Currency,
  CurrencyTopText,
  CurrencyBottomText,
  PriceText,
} from "@/styled-components/fund";

interface SpotProps {
  isLogin: boolean;
  currencyUnit: string;
  nowRate: number;
}

/**
 * @author odin
 * @level Layout/Fund/Spot
 * @description 資金中的現貨頁面內容
 */
const Spot = ({ isLogin, currencyUnit, nowRate }: SpotProps) => {
  // $ init data
  const { t } = useTranslation();
  const navigation = useNavigate();

  // # states
  const [currencyDrawer, setCurrencyDrawer] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [total, setTotal] = useState(0);
  const [, setBtc] = useState(0);
  const [usdt, setUsdt] = useState(0);
  // const [busd, setBusd] = useState(0);
  const [, setEth] = useState(0);

  // crypto map
  const cryptoCurrencyMap = {
    usdt: { name: "Tether", price: usdt },
    aave: { name: "AAVE", price: 0 },
    ada: { name: "Cardano", price: 0 },
    ape: { name: "ApeCoin", price: 0 },
    atom: { name: "Cosmos", price: 0 },
    avax: { name: "Avalanche", price: 0 },
    bch: { name: "BCH", price: 0 },
    bnb: { name: "Binance Coin", price: 0 },
    btc: { name: "Bitcoin", price: 0 },
    chz: { name: "Chiliz", price: 0 },
    comp: { name: "Compound", price: 0 },
    crv: { name: "Curve DAO Token", price: 0 },
    dash: { name: "Dash", price: 0 },
    doge: { name: "Dogecoin", price: 0 },
    dot: { name: "Polkadot", price: 0 },
    eos: { name: "EOS", price: 0 },
    etc: { name: "Ethereum Classic", price: 0 },
    eth: { name: "Ethereum", price: 0 },
    fil: { name: "Filecoin", price: 0 },
    hot: { name: "Holo", price: 0 },
    link: { name: "ChainLink", price: 0 },
    ltc: { name: "Litecoin", price: 0 },
    mana: { name: "Decentraland", price: 0 },
    matic: { name: "Polygon", price: 0 },
    rvn: { name: "Ravencoin", price: 0 },
    sand: { name: "The Sandbox", price: 0 },
    sol: { name: "Solana", price: 0 },
    trx: { name: "TRON", price: 0 },
    uni: { name: "Uniswap", price: 0 },
    vet: { name: "VeChain", price: 0 },
    xmr: { name: "Monero", price: 0 },
  };

  let containerList = Object.keys(cryptoCurrencyMap).map((key) => {
    return (
      <CurrencyContainer>
        <CurrencyLeft>
          <CryptoIcon name={key} size={30} />
          <Currency>
            <CurrencyTopText>{key.toUpperCase()}</CurrencyTopText>
            <CurrencyBottomText>
              {cryptoCurrencyMap[key].name}
            </CurrencyBottomText>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <PriceText>{cryptoCurrencyMap[key].price}</PriceText>
        </CurrencyRight>
      </CurrencyContainer>
    );
  });

  // - methods
  const getFund = () => {
    api.get("/investor/property").then((x) => {
      if (x.status !== 400) {
        setTotal(x.data.spot.equityValue);
        setBtc(
          x.data.spot.coins.sort(function (a, b) {
            return a.symbol > b.symbol ? 1 : -1;
          })[0].balance
        );
        setUsdt(
          x.data.spot.coins.sort(function (a, b) {
            return a.symbol > b.symbol ? 1 : -1;
          })[2].balance
        );
        // setBusd(x.data.spot.coins.sort(function(a, b) {
        //   return a.symbol > b.symbol ? 1 : -1;
        // })[1].balance)
        setEth(
          x.data.spot.coins.sort(function (a, b) {
            return a.symbol > b.symbol ? 1 : -1;
          })[1].balance
        );
      }
    });
  };

  // * hooks
  useEffect(() => {
    if (isLogin) {
      setInterval(() => {
        getFund();
      }, 1000);
      getFund();
    }
  }, [isLogin]);

  return (
    <div>
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
            <SpotIconButton
              onClick={() => {
                navigation("/fundTransfer");
              }}
            >
              <TransferIcon src={transfer} />
            </SpotIconButton>
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
        <LeftButton
          onClick={() => {
            setCurrencyDrawer(true);
            setIsWithdraw(true);
          }}
        >
          {t("widthdraw")}
        </LeftButton>
        <RightButton
          onClick={() => {
            setCurrencyDrawer(true);
            setIsWithdraw(false);
          }}
        >
          {t("deposit")}
        </RightButton>
      </ButtonContainer>
      <Line></Line>
      {containerList}
      <Drawer isVisible={currencyDrawer} selectVisible={() => {}} height={180}>
        <h2
          style={{
            textAlign: "center",
            color: "#383743",
            fontSize: "16px",
            fontWeight: 600,
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
              backgroundColor: "transparent",
            }}
            onClick={() => {
              if (isWithdraw) {
                navigation("/withdraw?symbol=USDT", {
                  state: { currency: "USDT" },
                });
              } else {
                navigation("/recharge?symbol=USDT", {
                  state: { currency: "USDT" },
                });
              }
            }}
          >
            <CryptoIcon name="usdt" size="30" />
            <p style={{ marginLeft: "10px", float: "left" }}>USDT</p>
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
            fontSize: "14px",
          }}
          onClick={() => {
            setCurrencyDrawer(false);
          }}
        >
          {t("cancel")}
        </button>
      </Drawer>
    </div>
  );
};

export default Spot;
