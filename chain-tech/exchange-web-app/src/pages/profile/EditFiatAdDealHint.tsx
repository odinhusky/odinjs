import { useState, useEffect } from "react";
import Footer from "../../components/footer/HomeFooter";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icon/Deal/backArrow.png";
import Redadd from "../../assets/icon/Deal/Redadd.png";
import AddPayway from "../../components/fund/addPayway";
import cancel_circle from "../../assets/icon/Deal/cancel_circle.png";
import { useTranslation } from "react-i18next";

// header style
const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${COLORS.EXLight_gray};
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
  justify-content: space-between;
  align-items: center;
`;

const NavImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 12px;
`;

const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
  margin-left: 11%;
`;
// status bar style
const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-top: 8px;
  position: relative;
`;
const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const StatusIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 4px solid #dedde3;
  border-radius: 8px;
`;
const StatusDes = styled.p`
  font-weight: 700;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  color: #dedde3;
  margin-top: 6px;
`;
const StatusSplit = styled.div`
  height: 2px;
  width: 32%;
  background: #dedde3;
  border-radius: 3px;
  margin-bottom: 8%;
  position: absolute;
  bottom: 9%;
  left: 14.7%;
`;
const NextButton = styled.button<{ isValid: boolean }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  letter-spacing: 0.4px;
  color: ${COLORS.Red};
  opacity: ${(props) => (props.isValid ? 1 : 0.24)};
  background: ${COLORS.EXLight_gray};
  border: none;
`;
const PayWayContainer = styled.div`
  width: 100%;
  height: 104px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 16px;
  padding: 16px;
`;
const PayWayTitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
`;
const PayWayTitle = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${COLORS.Dark_gray};
`;
const PayWayAddIcon = styled.img`
  width: 28px;
  height: 28px;
`;
const PayWayDes = styled.p`
  width: 100%;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;
const PayWayLabel = styled.div`
  height: 32px;
  background: ${COLORS.EXLight_gray};
  border-radius: 16px;
  padding: 5px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1%;
`;
const PayWayLabelIcon = styled.img`
  width: 18px;
  height: 18px;
`;
const PayWayLabelText = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.012em;
  color: ${COLORS.Gray};
  margin-right: 8px;
`;
const DealHintContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 16px;
  padding: 16px 16px 24px 16px;
  position: relative;
`;
const DealHintWrite = styled.textarea`
  width: 100%;
  height: 120px;
  background: rgb(244, 244, 246, 0.6);
  border-radius: 4px;
  border: none;
  padding: 12px 16px;
`;
const DealHintLabel = styled.p`
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: ${COLORS.Mid_gray};
  position: absolute;
  bottom: 40px;
  right: 32px;
`;
const DealLimitContainer = styled.div`
  width: 100%;
  height: 168px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  margin-top: 16px;
  padding: 16px;
`;
const DealLimitItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
`;
const DealLimitInput = styled.input`
  width: 60px;
  height: 36px;
  background: rgb(244, 244, 246, 0.6);
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
  padding: 8px 0;
  border: none;
  margin-right: 8px;
`;

const FiatAdDealHint = () => {
  const navigation = useNavigate();

  const [addPayWayStatus, setAddPayWayStatus] = useState(false);
  // const [paySelect, setPaySelect] = useState([""]);
  const [, setAddPayDetail] = useState<any>({});
  const [dealHint, setDealHint] = useState("");
  const [payArray, setPayArray] = useState([]);
  const [limitDealAmount, setLimitDealAmount] = useState("0");
  const [limitRegisterDate, setLimitRegisterDate] = useState("0");
  const { t } = useTranslation();
  const [, setAddPaySecess] = useState(true);
  const [ad, setAd] = useState({
    type: 0,
    priceType: 0,
    price: 0,
    totalTradingAmount: 0,
    orderLimitMin: 0,
    orderLimitMax: 0,
    payments: [],
    paymentTimeLimit: 900000,
    conditionCompleteOrders: "",
    conditionRegisteredDays: ""
  });

  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("ad")!))
    setDealHint(JSON.parse(localStorage.getItem("EditAd")!).terms)
    setLimitDealAmount(JSON.parse(localStorage.getItem("EditAd")!).conditionCompleteOrders.toString())
    setLimitRegisterDate(JSON.parse(localStorage.getItem("EditAd")!).conditionRegisteredDays.toString())
    setPayArray(JSON.parse(localStorage.getItem("EditAd")!).payments)
  }, [])
  return (
    <PageContainer>
      {addPayWayStatus ? (
        <AddPayway
          payArray={payArray}
          setPayArray={setPayArray}
          setAddPayDetail={setAddPayDetail}
          setAddPayWayStatus={setAddPayWayStatus}
          setAddPaySecess={setAddPaySecess}
        />
      ) : (
        <>
          <TitleContainer>
            <Link to="/EditFiatAdPage">
              <NavImage src={BackIcon} alt="language" />
            </Link>
            <LogoImage>{t("placeAds")}</LogoImage>
            <NextButton
              isValid={ad.type === 1 ?
                !!payArray.length &&
                // !!dealHint &&
                !!limitDealAmount &&
                !!limitRegisterDate :
                // !!dealHint &&
                !!limitDealAmount &&
                !!limitRegisterDate
              }
              onClick={() => {
                console.log(payArray)
                let ad = JSON.parse(localStorage.getItem("ad")!)
                ad.conditionCompleteOrders = parseInt(limitDealAmount)
                ad.conditionRegisteredDays = parseInt(limitRegisterDate)
                if (dealHint) {
                  ad.terms = dealHint
                }
                if (ad.type === 1) {
                  ad.payments = payArray
                }
                localStorage.setItem("buyConfirm", JSON.stringify(ad))
                if (ad.type === 1) {
                  !!payArray.length &&
                    // !!dealHint &&
                    !!limitDealAmount &&
                    !!limitRegisterDate &&
                    navigation("/EditFiatAdConfirm");
                } else {
                  // !!dealHint &&
                  !!limitDealAmount &&
                    !!limitRegisterDate &&
                    navigation("/EditFiatAdConfirm");
                }

              }}
            >
              {t("next")}
            </NextButton>
          </TitleContainer>
          <StatusContainer>
            <StatusItem>
              <StatusIcon
                style={{ border: "none", background: COLORS.Gray }}
              />
              <StatusDes style={{ color: `${COLORS.Dark_gray}` }}>
                {t("priceNQty")}
              </StatusDes>
            </StatusItem>
            <StatusSplit style={{ background: COLORS.Gray }} />
            <StatusItem>
              <StatusIcon style={{ border: `4px solid ${COLORS.Red}` }} />
              <StatusDes>{t("fiatTradeType")}</StatusDes>
            </StatusItem>
            <StatusSplit style={{ left: "53.3%" }} />
            <StatusItem>
              <StatusIcon />
              <StatusDes>{t("adsConfirm")}</StatusDes>
            </StatusItem>
          </StatusContainer>
          {ad.type === 1 &&
            <PayWayContainer>
              <PayWayTitleContainer>
                <PayWayTitle>{t("payments")}</PayWayTitle>
                <PayWayAddIcon
                  src={Redadd}
                  alt="add"
                  onClick={() => {
                    setAddPayWayStatus((v) => !v);
                  }}
                />
              </PayWayTitleContainer>
              <PayWayTitleContainer>
                {payArray.length !== 0 ? (
                  <PayWayLabel>
                    <PayWayLabelText>{t("fiatOrderNum")}</PayWayLabelText>
                    <PayWayLabelIcon
                      src={cancel_circle}
                      alt="cancel"
                      onClick={() => {
                        setPayArray([]);
                      }}
                    />
                  </PayWayLabel>
                ) : (
                  <PayWayDes>請添加至少一種付款方式</PayWayDes>
                )}
              </PayWayTitleContainer>
            </PayWayContainer>
          }

          <DealHintContainer style={{ marginTop: 10 }}>
            <PayWayTitle>{t("tradeMemo")}</PayWayTitle>
            <DealHintWrite
              placeholder={t("memoMsg")}
              onChange={(e) => {
                setDealHint(e.target.value);
              }}
              value={dealHint}
            />
            <DealHintLabel>{`${dealHint.length} / 100`}</DealHintLabel>
          </DealHintContainer>
          <DealLimitContainer style={{ marginTop: 10 }}>
            <PayWayTitle>交易方條件</PayWayTitle>
            <DealLimitItem style={{ marginTop: 16 }}>
              <PayWayDes style={{ width: "70%", marginRight: 7 }}>
                {t("dealAtLeast")}
              </PayWayDes>
              <DealLimitInput
                placeholder="0"
                onChange={(e) => setLimitDealAmount(e.target.value)}
                value={limitDealAmount}
              />
              <PayWayDes>{t("dealTimes")}</PayWayDes>
            </DealLimitItem>
            <DealLimitItem style={{ marginTop: 16 }}>
              <PayWayDes style={{ width: "70%", marginRight: 7 }}>
                註冊帳戶不少於
              </PayWayDes>
              <DealLimitInput
                placeholder="0"
                onChange={(e) => setLimitRegisterDate(e.target.value)}
                value={limitRegisterDate}
              />
              <PayWayDes>{t("days")}</PayWayDes>
            </DealLimitItem>
          </DealLimitContainer>
        </>
      )}
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatAdDealHint;
