import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import Change from "../../assets/icon/Deal/change.png";
import Footer from "../../components/footer/HomeFooter";
import { Link } from "react-router-dom";
import numeral from "numeral";
import OnSellPage from "../../components/fund/onSellPage";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 4px;
`;
const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;
const SelectIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const SetButton = styled.div`
  text-align: center;
  color: ${COLORS.Dark_gray};
  font-weight: 600;
`;
const ContentContainer = styled.div`
  width: 100%;
  height: 344px;
  background: #fff;
`;

const TitleContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  padding: 25px 16px 0 16px;
`;
const TitleItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const TitleItemName = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  color: #8f8da2;
  margin-right: 8px;
`;
const TitleItemUnit = styled.p`
  font-size: 15px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: 0.004em;
  color: #383743;
  margin-right: 4px;
`;
const TitleItemAmount = styled.p`
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
  color: #383743;
`;
const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  padding: 0 16px;
`;
const InputItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const InputTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const InputTransferIcon = styled.img`
  width: 44px;
  height: 44px;
`;
const InputLabel = styled.label`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #5f5c70;
`;
const UserInput = styled.input`
  height: 48px;
  width: 283px;
  border: none;
  padding: 12px 16px;
  background: rgb(244, 244, 246, 0.6);
  border-radius: 4px;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: #bdbcc8;
`;
const UserInputUnit = styled.div`
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: #8f8da2;
  position: absolute;
  right: 93px;
  bottom: 12px;
  display: flex;
`;
// const UserInputLimit = styled.p`
//   font-weight: 400;
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: 0.004em;
//   color: #d32f2f;
//   margin-top: 2px;
// `;
// const UserInputHint = styled.div`
//   font-weight: 500;
//   font-size: 14px;
//   line-height: 22px;
//   text-align: right;
//   letter-spacing: 0.012em;
//   color: #d32f2f;
//   margin-left: 12px;
// `;
const ConfirmButton = styled.div<{ clickButton: boolean }>`
  width: 100%;
  height: 38px;
  text-align: center;
  line-height: 38px;
  color: #fff;
  background: ${COLORS.Red};
  border-radius: 4px;
  margin-top: 24px;
  opacity: ${props => (props.clickButton ? 0.4 : 1)};
`;

const DescriptionContainer = styled.div`
  width: 100%;
  background: ${COLORS.EXLight_gray};
  padding: 16px 16px;
  flex: 1;
`;

const DescriptionItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;
const DescriptionTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: #383743;
`;
const DescriptionText = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Mid_gray};
`;
const DescriptionHint = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;

const FiatCurrency = () => {
  const [transferCurrency, setTransferCurrency] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [id, setId] = useState("");
  const [progressOrder, setProgressOrder] = useState(0);

  const [changeOrder, setChangeOrder] = useState(false);
  const [clickButton, setClickButton] = useState(false);
  const { t } = useTranslation();
  // const TransferPrice = parseInt(transferCurrency);
  const [ad, setAd] = useState({
    type: 0,
    cryptoAsset: "unit",
    fiatCurrency: "currencyUnit",
    priceType: 0,
    price: 0,
    totalTradingAmount: 0,
    orderLimitMin: 0,
    orderLimitMax: 0,
    paymentTimeLimit: 900000,
    conditionCompleteOrders: 0,
    terms: "",
    conditionRegisteredDays: 0,
    owner: "",
    id: ""
  });

  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("sell")!));
  }, []);

  const handleBuy = () => {
    // setClickButton((v) => !v);
    console.log(ad);
    api.get("/user/payment").then(x => {
      api
        .postData(`/otc/api/advertisement/${ad.id}/otcOrder/`, {
          price: ad.price,
          amount: transferCurrency ? parseFloat(transferCurrency) : null,
          quantity: transferAmount ? parseFloat(transferAmount) : null,
          payments: x.data
        })
        .then(x => {
          console.log(x);
          setId(x.id);
          if (x.status !== 400) {
            // setClickButton((v) => !v);
            setProgressOrder(1);
            localStorage.setItem("sellResult", JSON.stringify(x));
          } else {
            alert(x.data.msg);
          }
        });
    });
    // setProgressOrder(1);
  };
  return (
    <PageContainer>
      {progressOrder === 0 ? (
        <>
          <HeaderContainer>
            <HeaderLeft>
              <Link to="/fiat-deal">
                <SelectIcon src={Cancel} alt="cancel" />
              </Link>
            </HeaderLeft>
            <HeaderRight>
              <SetButton>{t("fiatSell")} USDT</SetButton>
            </HeaderRight>
          </HeaderContainer>
          <ContentContainer>
            <TitleContainer>
              <TitleItem style={{ marginBottom: 9 }}>
                <TitleItemName>{t("unitPrice")}</TitleItemName>
                <TitleItemUnit>NT$</TitleItemUnit>
                <TitleItemAmount>
                  {numeral(ad.price).format("0,0.00")}
                </TitleItemAmount>
              </TitleItem>
              <TitleItem>
                <TitleItemName>{t("limitedAmount")}</TitleItemName>
                <TitleItemUnit>{`NT$ ${numeral(ad.orderLimitMin).format(
                  "0,0.00"
                )} - ${numeral(ad.orderLimitMax).format(
                  "0,0.00"
                )}`}</TitleItemUnit>
              </TitleItem>
            </TitleContainer>
            <InputContainer>
              {changeOrder ? (
                <>
                  <InputItem>
                    <InputTitleContainer>
                      <InputLabel>{t("amount")}</InputLabel>
                    </InputTitleContainer>
                    <UserInput
                      placeholder={t("enterQty")}
                      value={transferAmount}
                      onChange={e => {
                        if (transferCurrency) {
                          alert("金額和數量只能擇一輸入");
                        } else {
                          setTransferAmount(e.target.value);
                        }
                      }}
                    />
                    <UserInputUnit>
                      USDT
                      {/* <UserInputHint>全部</UserInputHint> */}
                    </UserInputUnit>
                  </InputItem>
                  <InputItem>
                    <InputTitleContainer>
                      <InputLabel>金額</InputLabel>
                      <InputTransferIcon
                        src={Change}
                        alt="transfer order"
                        onClick={e => setChangeOrder(v => !v)}
                      />
                    </InputTitleContainer>
                    <UserInput
                      placeholder={t("enterAmount")}
                      value={transferCurrency}
                      onChange={e => {
                        if (transferAmount) {
                          alert("金額和數量只能擇一輸入");
                        } else {
                          setTransferCurrency(e.target.value);
                        }
                      }}
                    />
                    <UserInputUnit>
                      TWD
                      {/* <UserInputHint>全部</UserInputHint> */}
                    </UserInputUnit>
                  </InputItem>
                </>
              ) : (
                <>
                  <InputItem>
                    <InputLabel>金額</InputLabel>
                    <UserInput
                      placeholder={t("enterAmount")}
                      value={transferCurrency}
                      onChange={e => {
                        if (transferAmount) {
                          alert("金額和數量只能擇一輸入");
                        } else {
                          setTransferCurrency(e.target.value);
                        }
                      }}
                    />
                    <UserInputUnit>
                      TWD
                      {/* <UserInputHint>全部</UserInputHint> */}
                    </UserInputUnit>
                    {/* {TransferPrice < 5000 && (
                      <UserInputLimit>金額低於限額，請重新輸入</UserInputLimit>
                    )} */}
                  </InputItem>
                  <InputItem>
                    <InputTitleContainer>
                      <InputLabel>{t("amount")}</InputLabel>
                      <InputTransferIcon
                        src={Change}
                        alt="transfer order"
                        onClick={e => setChangeOrder(v => !v)}
                      />
                    </InputTitleContainer>
                    <UserInput
                      placeholder={t("enterQty")}
                      value={transferAmount}
                      onChange={e => {
                        if (transferCurrency) {
                          alert("金額和數量只能擇一輸入");
                        } else {
                          setTransferAmount(e.target.value);
                        }
                      }}
                    />
                    <UserInputUnit>
                      USDT
                      {/* <UserInputHint>全部</UserInputHint> */}
                    </UserInputUnit>
                  </InputItem>
                </>
              )}
              <ConfirmButton clickButton={clickButton} onClick={handleBuy}>
                {t("fiatSell")}
              </ConfirmButton>
            </InputContainer>
          </ContentContainer>
          <DescriptionContainer>
            <DescriptionItem>
              <DescriptionTitle>{t("fiatTradeInfo")}</DescriptionTitle>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionText>買方暱稱</DescriptionText>
              <DescriptionText style={{ color: COLORS.Dark_gray }}>
                {ad.owner}
              </DescriptionText>
            </DescriptionItem>
            {/* <DescriptionItem>
              <DescriptionText>賣方收款方式</DescriptionText>
              <DescriptionText style={{ color: COLORS.Dark_gray }}>
                {t("fiatOrderNum")}
              </DescriptionText>
            </DescriptionItem> */}
            <DescriptionItem>
              <DescriptionText>{t("buyerLimitedTime")}</DescriptionText>
              <DescriptionText style={{ color: COLORS.Dark_gray }}>
                {ad.paymentTimeLimit / (60 * 1000)} {t("minutes")}
              </DescriptionText>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionText>{t("fiatMemo")}</DescriptionText>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionHint>{ad.terms}</DescriptionHint>
            </DescriptionItem>
          </DescriptionContainer>
        </>
      ) : (
        <OnSellPage
          progressOrder={progressOrder}
          setProgressOrder={setProgressOrder}
          setClickButton={setClickButton}
          number={transferAmount ? parseFloat(transferAmount) : 0}
          amount={transferCurrency ? parseFloat(transferCurrency) : 0}
          id={id}
          price={numeral(ad.price).format("0,0.00")}
        />
      )}

      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatCurrency;
