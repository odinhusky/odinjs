import styled from "styled-components";
import { useState, useEffect } from "react";
import CurrentCommissionCard from "../../components/UI/CurrentCommissionCard";
import api from "../../common/api";
import Modal from "../../components/UI/CoverModal";
import noItemIcon from "../../assets/icon/illustration.png";
import StopLossStopEarnDrawer from "../../components/fund/StopLossStopEarnDrawer";
import { useTranslation } from "react-i18next";

const ContractContainer = styled.div`
  width: 100%;
  flex: 1;
  background: #fff;
  padding: 16px 16px 70px 16px;
`;

// const SelectButton = styled.button<{
//   currencyOption: number;
//   index: number;
// }>`
//   height: 26px;
//   background: ${(props) =>
//     props.currencyOption === props.index ? "#5F5C70" : "#F4F4F6"};
//   border-radius: 16px;
//   border: none;
//   font-size: 12px;
//   color: ${(props) =>
//     props.currencyOption === props.index ? "#F4F4F6" : "#8F8DA2"};
//   margin-bottom: 20px;
//   margin-right: 10px;
// `;

const ConfirmContainer = styled.div`
  width: 270px;
  height: 140px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  margin-bottom: 20%;
`;
const ConfirmContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;
const ConfirmContentTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #262626;
  margin: 0 0 8px 0;
`;
const ConfirmContent = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #595959;
`;
const ConfirmCheckbox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Future {
  orderId: string;
  owner: string;
  side: string;
  symbol: string;
  status: string;
  origQty: number;
  avgPrice: number;
  executedQty: number;
  price: number;
  type: string;
  positionSide: string;
  leverage: number;
}

const CheckboxCancel = styled.div`
  margin-top: 16px;
  width: 50%;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #8c8c8c;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
`;
const CheckboxConfirm = styled.div`
  margin-top: 16px;
  width: 50%;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #296df1;
`;



const OrderPage2 = () => {
  // const [currencyOption, setCurrencyOption] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [balance] = useState(0);
  const [StopLossStopEarn, setStopLossStopEarn] = useState(false);
  const [revokeIsVisual, setRevokeIsVisual] = useState(false);
  const [entrustArray, setEntrustArray] = useState([]);
  const [, setFuture] = useState(false);
  const [, setLoading] = useState(false);
  const { t } = useTranslation();
  const getEntrust = () => {
    api.get("/investor/future?status=CREATE").then((x) => {
      setEntrustArray(x.data);
      for (let i = 0; i < x.data.length; i++) {
        if (x.data[i].status !== "CANCEL") {
          setFuture(true);
          return;
        }
      }
    })
    // setInterval(() => {
    // api.get("/investor/future?status=CREATE").then((x) => {
    //   setEntrustArray(x.data);
    //   // console.log(x.data);
    //   for (let i = 0; i < x.data.length; i++) {
    //     if (x.data[i].status !== "CANCEL") {
    //       setFuture(true);
    //       return;
    //     }
    //   }
    // })},3000)
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getEntrust()
    }
  })

  return (
    <ContractContainer>
      {entrustArray.map((e: Future, i) => {
        return (
          <CurrentCommissionCard
            key={i}
            setStopLossStopEarn={setStopLossStopEarn}
            setRevokeIsVisual={setRevokeIsVisual}
            data={e}
            setOrderId={setOrderId}
            balance={balance}
          />
        );
      })}
      {revokeIsVisual && (
        <Modal>
          <ConfirmContainer>
            <ConfirmContentContainer>
              <ConfirmContentTitle>撤銷委託單？</ConfirmContentTitle>
              <ConfirmContent>
                確定撤銷委託單後，將無法再次回復該筆委託單內容。
              </ConfirmContent>
            </ConfirmContentContainer>
            <ConfirmCheckbox>
              <CheckboxCancel onClick={() => setRevokeIsVisual((v) => !v)}>
                {t("cancel")}
              </CheckboxCancel>
              <CheckboxConfirm
                onClick={() => {
                  setLoading(true);
                  api
                    .post("/order/futures/cancel-order", { orderId })
                    .then((x) => {
                      console.log(x);
                      setLoading(false);
                      getEntrust();
                    });
                  setRevokeIsVisual((v) => !v);
                }}
              >
                {t("OK")}
              </CheckboxConfirm>
            </ConfirmCheckbox>
          </ConfirmContainer>
        </Modal>
      )}
      {
        (!localStorage.getItem("token") || entrustArray.length === 0) &&
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
      <StopLossStopEarnDrawer
        isVisible={StopLossStopEarn}
        selectVisible={setStopLossStopEarn}
        height={329}
      />
    </ContractContainer>
  );
};

export default OrderPage2;
