import { useState, useEffect, useContext } from "react";

// # API
// import api from "@/common/api";

// % context
import { PositionContext, PriceContext } from "@/store/select-context"

// ? Self-packed Components || Functions
import OrderCurrentPositionCard from "@/components/UI/OrderCurrentPositionCard";

// - Images
import noItemIcon from "@/assets/icon/illustration.png";

// ^ Plugins
import { find } from "lodash"
import { useTranslation } from "react-i18next";

// = Styled Components
import styled from "styled-components";

const ContractContainer = styled.div`
  width: 100%;
  flex: 1;
  background: #fff;
  padding: 16px 16px 70px 16px;
`;

/**
 * @author odin
 * @level Layout/Orders/OrderPage1
 * @description 交易頁面 第一步驟
*/
const OrderPage1 = () => {

  // $ init data
  const { t } = useTranslation();

  // % context
  const context = useContext(PositionContext)
  const { marketArr } : any = useContext(PriceContext)

  // # states
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
  // const [, setBalance] = useState(0);
  const [, setCurrencyOption] = useState(0);

  // - methods
  const getRemark = (s: string) => {
    const remark = find(marketArr, function (o) { return o.s === s })
    return remark!.m
  }

  const getPosition = () => {
    // api.get("/investor/position").then((x) => {
    //   setPositionArray(x.data.sort(function (a, b) {
    //     return a.positionId > b.positionId ? 1 : -1;
    //    }));
    //   for (let i = 0; i < x.data.length; i++) {
    //     if (x.data[i].status !== "CLOSE") {
    //       setPosition(true);
    //       return;
    //     }
    //   }
    // })
    // setInterval(() => {
    // api.get("/investor/position").then((x) => {
    //   setPositionArray(x.data.sort(function (a, b) {
    //     return a.positionId > b.positionId ? 1 : -1;
    //    }));

    //   for (let i = 0; i < x.data.length; i++) {
    //     if (x.data[i].status !== "CLOSE") {
    //       setPosition(true);
    //       return;
    //     }
    //   }
    // })},3000)
  };
  // const getBalance = () => {
  //   api.get("/investor/margin-balance").then((x) => {
  //     setBalance(x.data);
  //   });
  // };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getPosition()
      // getBalance()
    }
  }, []);

  useEffect(() => {
    if (context) {
      // console.log(context)
      setPositionArray(context)
    }
  }, [context])
  return (
    <ContractContainer>
      {positionArray.map((e: any, i) => {
        return (
          e.status !== "CLOSE" && (
            <OrderCurrentPositionCard
              key={i}
              setCurrencyOption={setCurrencyOption}
              data={e}
              getPosition={getPosition}
              remark={e.symbol ? getRemark(e.symbol) : ""}
            />
          )
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

export default OrderPage1;
