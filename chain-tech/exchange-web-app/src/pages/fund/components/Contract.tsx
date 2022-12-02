import React, { useState, useEffect, useContext } from "react";

// # API
import api from "@/common/api";

// % context
import { PositionContext, PriceContext } from "@/store/select-context";

// ? Self-packed Components || Functions
// import { COLORS } from "@/constants/colors";

// - Images
import History from "@/assets/fund/historical_record.png";
import CurrentPositionCard from "../../../components/UI/FundCurrentPositionCard";
import noItemIcon from "@/assets/icon/illustration.png";

// ^ Plugins
import { useTranslation } from "react-i18next";
import { find } from "lodash";
import { useNavigate } from "react-router-dom";

// = Styled Component

import {
  Container,
  SpotContainer,
  SpotContainerHeader,
  SpotTitle,
  FundIcon,
  SpotContent,
  SpotCurrency,
  SpotUSDTPrice,
  SpotTWDPrice,
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
  CurrencyText,
  SpotIconButton
} from '@/styled-components/fund-contract'

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

interface ContractProps {
  isLogin: boolean;
  currencyUnit: string;
  nowRate: number;
}

/**
 * @author odin
 * @level Layout/Fund/Contract
 * @description 資金頁面 - 合約分頁
*/
const Contract = ({ isLogin, currencyUnit, nowRate }: ContractProps) => {

  // $ init data
  const navigation = useNavigate();
  const { t } = useTranslation();

  // % context
  const context = useContext(PositionContext);
  const { marketArr }: any = useContext(PriceContext);

  // # states
  const [positionArray, setPositionArray] = useState([
    {
      avgPrice: 0,
      forceClose: 0,
      leverage: 0,
      lossPrice: 0,
      margin: 0,
      owner: "",
      positionId: "",
      profitAndLoss: 0,
      profitPrice: 0,
      quantity: 0,
      side: "",
      status: "",
      symbol: "",
      type: ""
    }
  ]);
  const [balance, setBalance] = useState(0);
  const [futures, setFutures] = useState({ balance: 0 });
  const [profitAndLoss] = useState(0);

  // - methods
  const getRemark = (s: string) => {
    const remark = find(marketArr, function (o) {
      return o.s === s;
    });
    return remark!.m;
  };

  const getPosition = () => {
    // api.get("/investor/position").then((x) => {
    //   if(x.status !== 400){
    //     if(x.data.length !== 0){
    //       setProfitAndLoss(x.data[0].profitAndLoss)
    //     }
    //     setPositionArray(x.data.sort(function (a, b) {
    //       return a.positionId > b.positionId ? 1 : -1;
    //     }));
    //     for (let i = 0; i < x.data.length; i++) {
    //       if (x.data[i].status !== "CLOSE") {
    //         return;
    //       }
    //     }
    //   }
    // })
  };

  const getBalance = () => {
    api.get("/investor/margin-balance").then(x => {
      setBalance(x.data);
    });
  };

  function getFund() {
    api.get("/investor/property").then(x => {
      setFutures(x.data.futures);
    });
  }

  // * hooks
  useEffect(() => {
    if (isLogin) {
      getPosition();
      getBalance();
      getFund();
      setInterval(() => {
        getPosition();
        getBalance();
        getFund();
      }, 1000);
    }
  }, [isLogin]);

  useEffect(() => {
    if (context) {
      console.log(context);
      setPositionArray(context);
    }
  }, [context]);

  return (
    <Container>
      <SpotContainer>
        <SpotContainerHeader>
          <SpotTitle>{t("fundTotal")}</SpotTitle>
          <SpotIconButton
            onClick={() => {
              navigation("/contract-history");
            }}
          >
            <FundIcon src={History} />
          </SpotIconButton>
        </SpotContainerHeader>
        <SpotContent>
          <SpotUSDTPrice>
            {futures && futures.balance + profitAndLoss}
            <SpotCurrency>USDT</SpotCurrency>
          </SpotUSDTPrice>
          <SpotTWDPrice>
            ≈ {futures && futures.balance * nowRate} {currencyUnit}
          </SpotTWDPrice>
        </SpotContent>
      </SpotContainer>
      <CurrencyContainer>
        <CurrencyLeft>
          <Currency>
            <PriceText>{t("marginBalance")}</PriceText>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <Currency>
            <CurrencyTopText>
              {balance} <CurrencyText>USDT</CurrencyText>
            </CurrencyTopText>
            <CurrencyBottomText>
              ≈ {balance * nowRate} {currencyUnit}
            </CurrencyBottomText>
          </Currency>
        </CurrencyRight>
      </CurrencyContainer>
      <CurrencyContainer>
        <CurrencyLeft>
          <Currency>
            <PriceText>{t("walletBalance")}</PriceText>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <Currency>
            <CurrencyTopText>
              {futures && futures.balance} <CurrencyText>USDT</CurrencyText>
            </CurrencyTopText>
            <CurrencyBottomText>
              ≈ {futures && futures.balance * nowRate} {currencyUnit}
            </CurrencyBottomText>
          </Currency>
        </CurrencyRight>
      </CurrencyContainer>
      <CurrencyContainer>
        <CurrencyLeft>
          <Currency>
            <PriceText>{t("pnlU")}</PriceText>
          </Currency>
        </CurrencyLeft>
        <CurrencyRight>
          <Currency>
            <CurrencyTopText>
              {profitAndLoss} <CurrencyText>USDT</CurrencyText>
            </CurrencyTopText>
            <CurrencyBottomText>
              ≈ {profitAndLoss * nowRate} {currencyUnit}
            </CurrencyBottomText>
          </Currency>
        </CurrencyRight>
      </CurrencyContainer>
      <ButtonContainer>
        <RightButton
          onClick={() => {
            navigation("/fundTransfer");
          }}
        >
          {t("fundingTransfer")}
        </RightButton>
      </ButtonContainer>
      <Line></Line>
      <div
        style={{
          flex: 1,
          padding: "16px 16px 80px 16px",
          textAlign: "center"
        }}
      >
        {positionArray.map((e: any, i) => {
          return (
            <>
              {e.status !== "CLOSE" && (
                <CurrentPositionCard
                  key={i}
                  data={e}
                  getPosition={getPosition}
                  getBalance={getBalance}
                  getFund={getFund}
                  remark={e.symbol ? getRemark(e.symbol) : ""}
                />
              )}
            </>
          );
        })}
        {positionArray.length === 1 && !positionArray[0].positionId && (
          <>
            <img
              style={{ width: 135, height: 135 }}
              src={noItemIcon}
              alt="no info"
            />
            <p
              style={{
                padding: "30px 0",
                color: "#BDBCC8",
                fontWeight: 500,
                fontSize: 13
              }}
            >
              {t("noHistory")}
            </p>
          </>
        )}
      </div>
    </Container>
  );
};

export default Contract;
