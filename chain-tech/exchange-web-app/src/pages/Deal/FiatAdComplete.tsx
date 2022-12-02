import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import completeState from "../../assets/icon/Deal/complete_state.png";
import Footer from "../../components/footer/HomeFooter";
import { Link } from "react-router-dom";
import payment from "../../assets/icon/Deal/payment.png";
import JKO_pay from "../../assets/icon/Deal/JKO_pay.png";
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

const DescriptionContainer = styled.div`
  width: 100%;
  background: #fff;
  padding: 16px 16px;
  flex: 1;
  padding-bottom: 100px;
`;

const DescriptionItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const DescriptionText = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${COLORS.Mid_gray};
`;

const CompleteIcon = styled.img`
  width: 135px;
  height: 135px;
  margin-bottom: 16px;
`;

const BackButton = styled.button`
  border: none;
  width: 100%;
  height: 44px;
  background: ${COLORS.EXLight_gray};
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0.012em;
  color: ${COLORS.Gray};
  margin: 61px 0 0 0;
`;

const DescriptionItemSplit = styled.div`
  width: 100%;
  height: 1px;
  background: #fff;
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
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Gray};
`;

const FiatCurrency = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderLeft>
          <Link to="/deal/FiatAdPage">
            <SelectIcon src={Cancel} alt="cancel" />
          </Link>
        </HeaderLeft>
        <HeaderRight>
          <SetButton>{t("placeAds")}</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <DescriptionContainer>
        <DescriptionItem style={{ flexDirection: "column" }}>
          <CompleteIcon src={completeState} alt="complete" />
          <DescriptionText>廣告已發佈</DescriptionText>
        </DescriptionItem>
        <div
          style={{
            background: COLORS.EXLight_gray,
            padding: "16px 16px 24px 16px"
          }}
        >
          <DescriptionItem>
            <DescriptionText>交易價格</DescriptionText>
            <DescriptionText
              style={{
                color: COLORS.Dark_gray,
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                lineHeight: "24px",
                fontWeight: 700
              }}
            >
              {`${28.35} TWD/USDT`}
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
                letterSpacing: "0.004em"
              }}
            >
              {t("FixedPrice")}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("tradeAmount")}</DescriptionText>
            <DescriptionText
              style={{
                color: COLORS.Dark_gray,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "20px",
                letterSpacing: "0.004em"
              }}
            >
              1,000 USDT
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem style={{ justifyContent: "center" }}>
            <DescriptionItemSplit />
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>單筆限額</DescriptionText>
            <DescriptionText style={{ color: COLORS.Dark_gray }}>
              NT$ 3,000 - 30,000
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("fiatOrderNum")}</DescriptionText>
            <DescriptionText style={{ color: COLORS.Dark_gray }}>
              19747424249011
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>放行時限</DescriptionText>
            <DescriptionText style={{ color: COLORS.Dark_gray }}>
              18 {t("minutes")}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("payments")}</DescriptionText>
            <DealPayItemContainer>
              <DealPayItemIcon src={payment} alt="bank" />
              <DealPayItemIcon src={JKO_pay} alt="bank" />
            </DealPayItemContainer>
          </DescriptionItem>
          <DescriptionItem
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <DescriptionText>{t("fiatMemo")}</DescriptionText>
            <DealPayItemDes>請買家務必於時限內付款，勿卡單。</DealPayItemDes>
          </DescriptionItem>
          <DescriptionItem
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <DescriptionText>交易方條件</DescriptionText>
            <DealPayItemDes>
              {t("dealAtLeast")} 3 {t("dealTimes")}、註冊帳戶不少於 30 天
            </DealPayItemDes>
          </DescriptionItem>
        </div>
        <Link to="/deal/FiatAdPage">
          <BackButton>{t("fiatOverview")}</BackButton>
        </Link>
      </DescriptionContainer>
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatCurrency;
