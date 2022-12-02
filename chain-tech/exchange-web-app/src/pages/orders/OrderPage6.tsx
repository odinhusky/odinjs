
import styled from "styled-components";
import HistoryPositionCard from "../../components/UI/HistoryPositionCard";
import api from "../../common/api";
import { useState, useEffect, useContext } from "react";
import noItemIcon from "../../assets/icon/illustration.png";
import { PositionContext, PriceContext } from "../../store/select-context"
import _ from "lodash"
import { useTranslation } from "react-i18next";

const ContractContainer = styled.div`
  width: 100%;
  flex: 1;
  background: #fff;
  padding: 16px 16px 70px 16px;
`;

const OrderPage6 = () => {
  const [, setLoading] = useState(false);
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
  const [, setBalance] = useState(0);
  const [, setCurrencyOption] = useState(0);
  const context = useContext(PositionContext)
  const context2 = useContext(PriceContext)
  const { t } = useTranslation();
  const getRemark = (s: string) => {
    const remark = _.find(context2, function (o) { return o.s === s })
    return remark!.m
  }

  const getPosition = () => {
    // api.get("/investor/position").then((x) => {
    //   console.log(x.data)
    //   // setPositionArray(x.data.sort(function (a, b) {
    //   //   return a.positionId > b.positionId ? 1 : -1;
    //   //  }));
    //   // for (let i = 0; i < x.data.length; i++) {
    //   //   if (x.data[i].status !== "CLOSE") {
    //   //     setPosition(true);
    //   //     return;
    //   //   }
    //   // }
    // })
  };
  const getBalance = () => {
    api.get("/investor/margin-balance").then((x) => {
      setBalance(x.data);
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getPosition()
      getBalance()
    }
  }, [])
  useEffect(() => {
    if (context) {
      console.log(context)
      setPositionArray(context)
    }
  }, [context])
  return (
    <ContractContainer>
      {positionArray.map((e: any, i) => {
        return (
          <>
            <HistoryPositionCard
              key={i}
              setCurrencyOption={setCurrencyOption}
              data={e}
              getPosition={getPosition}
              setLoading={setLoading}
              getBalance={getBalance}
              remark={e.symbol ? getRemark(e.symbol) : ""}
            />

          </>
        );
      })}
      {
        (!localStorage.getItem("token") || (positionArray.length === 1 && !positionArray[0].positionId)) &&
        <div
          style={{
            flex: 1,
            padding: "0px 0 80px 0",
            textAlign: "center",
          }}
        >
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
              fontSize: 13,
            }}
          >
            {t("noHistory")}
          </p>
        </div>
      }
    </ContractContainer>
  );
};

export default OrderPage6;
