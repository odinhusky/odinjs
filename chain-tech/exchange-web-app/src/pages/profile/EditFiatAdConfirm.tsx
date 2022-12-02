import { useState, useEffect } from "react";
import Footer from "../../components/footer/HomeFooter";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icon/Deal/backArrow.png";
import payment from "../../assets/icon/Deal/payment.png";
// import JKO_pay from "../../assets/icon/Deal/JKO_pay.png";
import check from "../../assets/icon/Deal/check.png";
import Modal from "../../components/UI/CoverModal";
import unVisibility from "../../assets/icon/Deal/unvisibility.png";
import visibility from "../../assets/icon/Deal/visibility.png";
import api from "../../common/api"
import { useTranslation } from "react-i18next";

// header style
const PageContainer = styled.div`
  height: 115vh;
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

const DescriptionItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const DescriptionItemSplit = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
`;

const DescriptionText = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004rem;
  color: ${COLORS.Mid_gray};
`;

const DealCompleteContainer = styled.div`
  background: #fff;
  padding: 22px 16px 24px 16px;
  margin: 16px 16px 49px 16px;
  border-radius: 8px;
`;

const DealPayItemContainer = styled.div`
  display: flex;
  align-items: center;
`;
const DealPayItemIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const DealPayItemDes = styled.p`
  font-weight: 600;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;

const ReadConfirmContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReadConfirmIcon = styled.img`
  margin-right: 8.5px;
  width: 24px;
  height: 24px;
`;

const ReadConfirmDes = styled.p`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Gray};
`;

const SubmitContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 19px 0 0px 0;
  padding: 0 16px;
`;

const ModifyButton = styled.button`
  width: 87px;
  height: 44px;
  background: #ffffff;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: ${COLORS.Gray};
`;
const ConfirmButton = styled.button`
  width: 240px;
  height: 44px;
  background: #d32f2f;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #ffffff;
`;
const TradeFunctionCheckBox = styled.div<{ check: boolean }>`
  width: 18px;
  height: 18px;
  background-color: ${(props) => (props.check ? "#5F5C70" : "#fff")};
  border: 1.5px solid #dedde3;
  border-radius: 9px;
  margin-right: 8.5px;
`;

const ConfirmBox = styled.div<{ isValid: boolean }>`
  width: 270px;
  height: ${(props) => (props.isValid ? 168 : 140)}px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ConfirmBoxTitle = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #262626;
  margin-top: 16px;
`;

const ConfirmBoxContent = styled.p`
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #595959;
  margin-top: 8px;
  padding: 0 16px;
  text-align: center;
`;

const ConfirmBoxInput = styled.input`
  width: 238px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  backdrop-filter: blur(8px);
  border-radius: 4px;
  padding: 4px 55px 4px 12px;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  margin-top: 14px;
`;

const BoxCheckContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 43px;
  display: flex;
  align-items: center;
  padding-top: 16px;
`;

const UnValidBoxCheckContainer = styled.div`
  width: 270px;
  height: 43px;
  margin: auto 0 0 0;
  border-radius: 0 0 18px 18px;
  background: #fff;
  color: #296df1;
  text-align: center;
  line-height: 43px;
  border-top: 1px solid #d9d9d9;
`;

const BoxCheckContent = styled.button`
  width: 50%;
  height: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 43px;
  text-align: center;
  color: #8c8c8c;
  border: none;
  background-color: #fff;
  border-top: 1px solid #d9d9d9;
`;

const FiatAdDealHint = () => {
  const navigation = useNavigate();
  const [isReadPrivacy, setIsReadPrivacy] = useState(false);
  const [modalVisible, setIsModalVisible] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const { t } = useTranslation();
  const [transferPassword, setTransferPassword] = useState("");
  const [ad, setAd] = useState({
    type: 0,
    priceType: 0,
    price: 0,
    totalTradingAmount: 0,
    orderLimitMin: 0,
    orderLimitMax: 0,
    paymentTimeLimit: 900000,
    conditionCompleteOrders: 0,
    terms: "",
    conditionRegisteredDays: 0,
    financePassword: "",
    payments: []
  });

  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("buyConfirm")!))
    console.log(JSON.parse(localStorage.getItem("buyConfirm")!))
  }, [])

  return (
    <PageContainer>
      <TitleContainer>
        <Link to="/EditFiatAdDealHint">
          <NavImage src={BackIcon} alt="language" />
        </Link>
        <LogoImage>{t("placeAds")}</LogoImage>
        <NextButton
          isValid={false}
          onClick={() => {
            // navigation("/deal");
          }}
        >
          {/* 下一步 */}
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
          <StatusIcon
            style={{ border: "none", background: COLORS.Gray }}
          />
          <StatusDes style={{ color: `${COLORS.Dark_gray}` }}>
            {t("fiatTradeType")}
          </StatusDes>
        </StatusItem>
        <StatusSplit style={{ left: "53.3%", background: COLORS.Gray }} />
        <StatusItem>
          <StatusIcon style={{ border: `4px solid ${COLORS.Red}` }} />
          <StatusDes style={{ color: `${COLORS.Dark_gray}` }}>
            {t("adsConfirm")}
          </StatusDes>
        </StatusItem>
      </StatusContainer>
      <DealCompleteContainer>
        <DescriptionItem>
          <DescriptionText>交易價格</DescriptionText>
          <DescriptionText
            style={{
              color: COLORS.Dark_gray,
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "20px",
              letterSpacing: "0.004em",
            }}
          >
            {`${ad.price} TWD/USDT`}
          </DescriptionText>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionText>{t("priceMethod")}</DescriptionText>
          <DescriptionText
            style={{
              color: COLORS.Dark_gray,
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "20px",
              letterSpacing: "0.004em",
            }}
          >
            {ad.priceType === 0 ? t("FixedPrice") : "浮動價格"}
          </DescriptionText>
        </DescriptionItem>
        {/* <DescriptionItem>
          <DescriptionText>{t("unitPrice")}</DescriptionText>
          <DescriptionText
            style={{
              color: COLORS.Dark_gray,
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "20px",
              letterSpacing: "0.004em",
            }}
          >
            {`${1000} USDT`}
          </DescriptionText>
        </DescriptionItem> */}
        <DescriptionItem style={{ justifyContent: "center" }}>
          <DescriptionItemSplit />
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionText>單筆限額</DescriptionText>
          <DescriptionText style={{ color: COLORS.Dark_gray }}>
            NT$ {ad.orderLimitMin} - {ad.orderLimitMax}
          </DescriptionText>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionText>放行時限</DescriptionText>
          <DescriptionText style={{ color: COLORS.Dark_gray }}>
            {ad.paymentTimeLimit / (60 * 1000)} {t("minutes")}
          </DescriptionText>
        </DescriptionItem>
        {ad.type === 1 &&
          <DescriptionItem>
            <DescriptionText>{t("payments")}</DescriptionText>
            <DealPayItemContainer>
              <DealPayItemIcon src={payment} alt="bank" />
            </DealPayItemContainer>
          </DescriptionItem>
        }
        <DescriptionItem
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <DescriptionText>{t("fiatMemo")}</DescriptionText>
          <DealPayItemDes>{ad.terms}</DealPayItemDes>
        </DescriptionItem>
        <DescriptionItem
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <DescriptionText>交易方條件</DescriptionText>
          <DealPayItemDes>
            {t("dealAtLeast")} {ad.conditionCompleteOrders} {t("dealTimes")}、註冊帳戶不少於 {ad.conditionRegisteredDays} {t("days")}
          </DealPayItemDes>
        </DescriptionItem>
      </DealCompleteContainer>
      <ReadConfirmContainer
        onClick={() => {
          setIsReadPrivacy((v) => !v);
        }}
      >
        {isReadPrivacy ? (
          <ReadConfirmIcon src={check} alt="check" />
        ) : (
          <TradeFunctionCheckBox check={false} />
        )}
        <ReadConfirmDes>{t("iAgree")}</ReadConfirmDes>
        <ReadConfirmDes style={{ color: COLORS.Red }}>
          《交易條例》
        </ReadConfirmDes>
      </ReadConfirmContainer>
      <SubmitContainer>
        <ModifyButton
          onClick={() => {
            navigation("/deal/FiatAdPage");
          }}
        >
          {t("modify")}
        </ModifyButton>
        <ConfirmButton
          onClick={() => {
            // isReadPrivacy && setIsModalVisible(true);
            setIsModalVisible(true);
            // console.log(ad)
            // api.postData("/otc/api/advertisement/",ad).then(x=>{
            //   // navigation("/deal");
            //   console.log(x)
            // })
          }}
        >
          確認並發佈
        </ConfirmButton>
      </SubmitContainer>
      {modalVisible && (
        <Modal>
          <ConfirmBox isValid={passwordIsValid}>
            <ConfirmBoxTitle>
              {passwordIsValid ? t("enterFundingPass"): "錯誤"}
            </ConfirmBoxTitle>
            <ConfirmBoxContent>
              {passwordIsValid
                ? "進行出售，請輸入您設定的資金密碼"
                : "資金密碼輸入錯誤 1 次，若錯誤次數達到 3 次將鎖定帳號"}
            </ConfirmBoxContent>
            {passwordIsValid && (
              <ConfirmBoxInput
                placeholder={t("enterFundingPass")}
                onChange={(e) => {
                  setAd({ ...ad, financePassword: e.target.value })
                  setTransferPassword(e.target.value);
                }}
                value={transferPassword}
                type={passwordIsVisible ? "text" : "password"}
              />
            )}
            {passwordIsVisible
              ? passwordIsValid && (
                <img
                  src={unVisibility}
                  alt="visible"
                  style={{
                    width: 24,
                    height: 24,
                    position: "absolute",
                    right: 28,
                    top: 81,
                  }}
                  onClick={() => setPasswordIsVisible((v) => !v)}
                />
              )
              : passwordIsValid && (
                <img
                  src={visibility}
                  alt="visible"
                  style={{
                    width: 24,
                    height: 24,
                    position: "absolute",
                    right: 28,
                    top: 81,
                  }}
                  onClick={() => setPasswordIsVisible((v) => !v)}
                />
              )}
            {passwordIsValid ? (
              <BoxCheckContainer>
                <BoxCheckContent
                  style={{
                    borderRight: "1px solid #D9D9D9",
                    borderRadius: "0 0 0px 18px",
                  }}
                  onClick={() => {
                    setIsModalVisible((v) => !v);
                  }}
                >
                  {t("cancel")}
                </BoxCheckContent>
                <BoxCheckContent
                  style={{
                    borderRadius: "0 0 18px 0",
                    color: "#296DF1",
                  }}
                  onClick={() => {
                    console.log(ad.payments)
                    api.put("/otc/api/advertisement/" + JSON.parse(localStorage.getItem("EditAd")!).id, {
                      conditionCompleteOrders: ad.conditionCompleteOrders,
                      conditionRegisteredDays: ad.conditionRegisteredDays,
                      orderLimitMax: ad.orderLimitMax,
                      orderLimitMin: ad.orderLimitMin,
                      paymentTimeLimit: ad.paymentTimeLimit,
                      payments: ad.payments,
                      price: ad.price,
                      priceType: ad.priceType,
                      totalTradingAmount: ad.totalTradingAmount,
                      financePassword: transferPassword
                    }).then(x => {
                      if (x.status !== 400 && x.status !== 493) {
                        console.log(x)
                        alert("修改成功")
                        navigation("/myAD");
                      } else {
                        alert(x.data.msg)
                      }

                    })
                    // navigation("/deal/FiatAdComplete")
                  }}
                >
                  {t("OK")}
                </BoxCheckContent>
              </BoxCheckContainer>
            ) : (
              <UnValidBoxCheckContainer
                onClick={() => {
                  setPasswordIsValid((v) => !v);
                }}
              >
                {t("OK")}
              </UnValidBoxCheckContainer>
            )}
          </ConfirmBox>
        </Modal>
      )}
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatAdDealHint;
