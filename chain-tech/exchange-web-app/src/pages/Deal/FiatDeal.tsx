import { useState,useEffect } from "react";
import Footer from "../../components/footer/HomeFooter";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import addIcon from "../../assets/icon/Deal/add.png";
// import transfer from "../../assets/icon/Deal/TransferArrow.png";
// import payment from "../../assets/icon/Deal/payment.png";
// import linePay from "../../assets/icon/Deal/line_pay.png";
// import JKO_pay from "../../assets/icon/Deal/JKO_pay.png";
import api from "../../common/api"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// const DUMMY_DATA = [
//   {
//     id: "123123123",
//     avatar: "E",
//     name: "edddwww",
//     amount: "611.315730 USDT",
//     price: "NT$ 5,000.00 - 17,459.00",
//     payList: [1],
//   },
//   {
//     id: "123easdcasd",
//     avatar: "U",
//     name: "UNI團隊＠匯款區",
//     amount: "10,000.000000 USDT",
//     price: "NT$ 3,000.00 - 3,000.00",
//     payList: [1, 2],
//   },
//   {
//     id: "123e1231209",
//     avatar: "J",
//     name: "Jock821",
//     amount: "15,144.799179 USDT",
//     price: "NT$ 300,000.00 - 433,141.00",
//     payList: [1],
//   },
//   {
//     id: "123123edfvfdv",
//     avatar: "獎",
//     name: "獎學金",
//     amount: "15,144.799179 USDT",
//     price: "NT$ 5,000.00 - 50,000.00",
//     payList: [1, 2, 3],
//   },
//   {
//     id: "123123213909sc",
//     avatar: "金",
//     name: "Carmen06",
//     amount: "47,072.000000 USDT",
//     price: "NT$ 150,000.00 - 1,350,000.00",
//     payList: [1],
//   },
// ];

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f4f4f6;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  align-items: center;
`;
const TitleLeftButton = styled.p`
  width: 66px;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  color: #8f8da2;
  margin-right: 24px;
  line-height: 24px;
`;
const TitleRightButton = styled.p`
  width: 81px;
  height: 30px;
  font-weight: 600;
  font-size: 20px;
  color: #383743;
  line-height: 30px;
`;
const CurrencyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px 16px 0px 0px;
`;
const CurrencyTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16px 16px 0px 0px;
  border-bottom: 1px solid #f4f4f6;
`;
const CurrencyTitleButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px 16px 0px 0px;
`;
const CurrencyTitleButton = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background: #fff;
  color: ${COLORS.Mid_gray};
  font-weight: 600;
  padding: 16px;
  border-radius: 16px 16px 0px 0px;
`;
const CurrencyTitleSplit = styled.div`
  width: 1.5px;
  height: 16px;
  background: ${COLORS.EXLight_gray};
`;
const CurrencyTransferContainer = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f4f4f6;
`;
const CurrencyTransferButton = styled.p<{ index: number; isSelect: number }>`
  font-weight: 600;
  font-family:Open Sans;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.004em;
  color: ${(props) =>
    props.index === props.isSelect
      ? COLORS.EXLight_gray
      : COLORS.Mid_gray};
  background: ${(props) =>
    props.index === props.isSelect
      ? COLORS.Gray
      : "rgb(244, 244, 246, 0.6)"};
  padding: 6px 12px;
  margin-right: 8px;
  border-radius: 16px;
`;
const CurrencyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 6px 6px 8px 6px;
`;

const CurrencyListCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  background: #fff;
  padding: 6px;
`;
const CurrencyCardTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;
const CurrencyCardAvatar = styled.div`
  width: 24px;
  height: 24px;
  background: #bdbcc8;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  border-radius: 12px;
  text-align: center;
`;
const CurrencyCardName = styled.p`
  margin-left: 12px;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #383743;
  letter-spacing: 0.004em;
  font-family:Open Sans;
`;
const CurrencyCardNameRatio = styled.p`
  margin-left: 4px;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #8f8da2;
`;
const CurrencyCardUnit = styled.p`
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
  font-weight:500;
`;
const CurrencyCardPrice = styled.p`
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.002em;
  color: ${COLORS.Dark_gray};
  margin-left: 4px;
  font-family:Open Sans;
`;
const CurrencyCardContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const CurrencyCardAmount = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: 0.004em;
  color: #8f8da2;
`;
const CardFooterButton = styled.button<{ orderStatus: string }>`
  width: 84px;
  height: 30px;
  border: none;
  background: ${(props) =>
    props.orderStatus === "sell" ? COLORS.Red : COLORS.Green};
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #ffffff;
`;

const PaymentIconContainer = styled.div``;

const FiatDeal = () => {
  const [selecetCurrency, setSelecetCurrency] = useState(0);
  const [orderStatus, setOrderStatus] = useState("buy");
  const [buyList, setBuyList] = useState([]);
  const navigation = useNavigate();
  const { t } = useTranslation();
  useEffect(()=>{
    let cur;
    if(selecetCurrency === 0){
      cur = "USDT"
    }
    else if(selecetCurrency === 1){
      cur = "BTC"
    }else if(selecetCurrency === 2){
      cur = "ETH"
    }
    if(localStorage.getItem("token")){
      api.getData(`/otc/api/advertisement/?type=${orderStatus === "buy" ? "sell":"buy"}&cryptoAsset=${cur}`).then(x=>{
        console.log(x)
        setBuyList(x)
      })
    }  
  },[selecetCurrency,orderStatus])
  return (
    <PageContainer>
      <TitleContainer>
        <Link to="/deal">
          <TitleLeftButton>{t("tradeFutures")}</TitleLeftButton>
        </Link>
        <TitleRightButton>{t("tradeFiat")}</TitleRightButton>
      </TitleContainer>
      <CurrencyContainer>
        <CurrencyTitleContainer>
          <CurrencyTitleButtonContainer>
            <CurrencyTitleButton
              style={{
                color:
                  orderStatus === "buy"
                    ? COLORS.Green
                    : COLORS.Mid_gray,
              }}
              onClick={() => {
                setOrderStatus("buy");
              }}
            >
              {t("fiatBuy")}
            </CurrencyTitleButton>
            <CurrencyTitleSplit />
            <CurrencyTitleButton
              style={{
                color:
                  orderStatus === "sell"
                    ? COLORS.Red
                    : COLORS.Mid_gray,
              }}
              onClick={() => {
                setOrderStatus("sell");
              }}
            >
              {t("fiatSell")}
            </CurrencyTitleButton>
          </CurrencyTitleButtonContainer>
          <CurrencyTitleButtonContainer>
            {/* <CurrencyTitleButton>
              <p>TWD</p>
              <img
                src={transfer}
                alt="add-currency"
                style={{ marginLeft: 6, width: 16, height: 18 }}
              />
            </CurrencyTitleButton> */}

            <CurrencyTitleButton>
              <Link to="/deal/FiatAdPage">
                <img
                  src={addIcon}
                  alt="add-currency"
                  style={{ width: 28, height: 28 }}
                />
              </Link>
            </CurrencyTitleButton>
          </CurrencyTitleButtonContainer>
        </CurrencyTitleContainer>
        <CurrencyTransferContainer>
          <CurrencyTransferButton
            index={0}
            isSelect={selecetCurrency}
            onClick={() => setSelecetCurrency(0)}
          >
            USDT
          </CurrencyTransferButton>
          <CurrencyTransferButton
            index={1}
            isSelect={selecetCurrency}
            onClick={() => setSelecetCurrency(1)}
          >
            BTC
          </CurrencyTransferButton>
          <CurrencyTransferButton
            index={2}
            isSelect={selecetCurrency}
            onClick={() => setSelecetCurrency(2)}
          >
            ETH
          </CurrencyTransferButton>
        </CurrencyTransferContainer>
      </CurrencyContainer>
      <CurrencyListContainer>
        {buyList.map((item:any) => {
          return (
            <CurrencyListCard key={item.id}>
              <CurrencyCardTitleContainer>
                <CurrencyCardAvatar>{}</CurrencyCardAvatar>
                <CurrencyCardName>{item.owner}</CurrencyCardName>
                {/* <CurrencyCardNameRatio>{`(100%)`}</CurrencyCardNameRatio> */}
              </CurrencyCardTitleContainer>
              <CurrencyCardContentContainer>
                <CurrencyCardAmount>{t("amount")}</CurrencyCardAmount>
                <CurrencyCardName
                  style={{
                    fontSize: 12,
                    lineHeight: "15px",
                    flex: 1,
                    fontWeight:600,
                    fontFamily:"Open Sans"
                  }}
                >
                  {item.totalTradingAmount}
                </CurrencyCardName>
                <CurrencyCardNameRatio
                  style={{ lineHeight: "18px" }}
                >{t("unitPrice")}</CurrencyCardNameRatio>
              </CurrencyCardContentContainer>
              <CurrencyCardContentContainer style={{ marginTop: 0 }}>
                <CurrencyCardAmount>{t("limitedAmount")}</CurrencyCardAmount>
                <CurrencyCardName
                  style={{
                    fontSize: 12,
                    lineHeight: "15px",
                    flex: 1,
                    fontWeight:600,
                    fontFamily:"Open Sans"
                  }}
                >
                  {item.orderLimitMin} - {item.orderLimitMax}
                </CurrencyCardName>
                <CurrencyCardUnit>NT$</CurrencyCardUnit>
                <CurrencyCardPrice>{item.price}</CurrencyCardPrice>
              </CurrencyCardContentContainer>
              <CurrencyCardContentContainer style={{ marginTop: 12 }}>
                <PaymentIconContainer>
                  {/* {item.payList.map((item) => {
                    if (item === 1) {
                      return (
                        <img
                          key={item.toString()}
                          src={payment}
                          alt="payment"
                          style={{ width: 28, height: 28 }}
                        />
                      );
                    } else if (item === 2) {
                      return (
                        <img
                          key={item.toString()}
                          src={linePay}
                          alt="payment"
                          style={{ width: 28, height: 28 }}
                        />
                      );
                    } else if (item === 3) {
                      return (
                        <img
                          key={item.toString()}
                          src={JKO_pay}
                          alt="payment"
                          style={{ width: 28, height: 28 }}
                        />
                      );
                    }
                    return null;
                  })} */}
                </PaymentIconContainer>
                <button
                  // to={
                  //   orderStatus === "buy"
                  //     ? "/deal/FiatBuyPage"
                  //     : "/deal/FiatSellPage"
                  // }
                  style={{border:"none",background:"transparent"}}
                  onClick={()=>{
                    if(orderStatus === "buy"){
                      localStorage.setItem("buy",JSON.stringify(item))
                      navigation("/deal/FiatBuyPage");
                    }else{
                      localStorage.setItem("sell",JSON.stringify(item))
                      navigation("/deal/FiatSellPage");
                    }
                  }}
                >
                  <CardFooterButton orderStatus={orderStatus}>
                    {orderStatus === "buy" ? t("fiatBuy") : t("fiatSell")}
                  </CardFooterButton>
                </button>
              </CurrencyCardContentContainer>
            </CurrencyListCard>
          );
        })}
      </CurrencyListContainer>
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatDeal;
