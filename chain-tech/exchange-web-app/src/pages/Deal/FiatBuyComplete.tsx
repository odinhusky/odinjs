import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import completeState from "../../assets/icon/Deal/complete_state.png";
import Footer from "../../components/footer/HomeFooter";
import { Link } from "react-router-dom";
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
  letter-spacing: 0.4px;
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

const FiatCurrency = () => {
  const [ad, setAd] = useState({
    amount: 0,
    price: 0,
    quantity: 0,
    id: "",
    createdDate: 0
  });
  const { t } = useTranslation();
  useEffect(() => {
    setAd(JSON.parse(localStorage.getItem("buyResult")!));
  }, []);
  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderLeft>
          <Link to="/fiat-deal">
            <SelectIcon src={Cancel} alt="cancel" />
          </Link>
        </HeaderLeft>
        <HeaderRight>
          <SetButton>{t("fiatBuy")} USDT</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <DescriptionContainer>
        <DescriptionItem style={{ flexDirection: "column" }}>
          <CompleteIcon src={completeState} alt="complete" />
          <DescriptionText>{t("orderFinish")}</DescriptionText>
        </DescriptionItem>
        <div
          style={{
            background: COLORS.EXLight_gray,
            padding: "16px 16px 24px 16px"
          }}
        >
          <DescriptionItem>
            <DescriptionText>{t("fiatTotal")}</DescriptionText>
            <DescriptionText
              style={{
                color: COLORS.Red,
                display: "flex",
                alignItems: "center",
                fontSize: 16,
                lineHeight: "20px"
              }}
            >
              NT$
              <p
                style={{
                  marginLeft: 4,
                  color: COLORS.Red,
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: "30px"
                }}
              >
                {ad.amount}
              </p>
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("amount")}</DescriptionText>
            <DescriptionText
              style={{
                color: COLORS.Dark_gray,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "20px",
                letterSpacing: "0.004em"
              }}
            >
              {ad.quantity}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("unitPrice")}</DescriptionText>
            <DescriptionText
              style={{
                color: COLORS.Dark_gray,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "20px",
                letterSpacing: "0.004em"
              }}
            >
              NT$ {ad.price}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("payments")}</DescriptionText>
            <DescriptionText style={{ color: COLORS.Dark_gray }}>
              {t("fiatOrderNum")}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("fiatOrderNum")}</DescriptionText>
            <DescriptionText
              style={{ color: COLORS.Dark_gray, wordBreak: "break-word" }}
            >
              {ad.id.slice(0, 20)}
            </DescriptionText>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionText>{t("fiatOrderTime")}</DescriptionText>
            <DescriptionText style={{ color: COLORS.Dark_gray }}>
              {new Date(ad.createdDate).getFullYear() + "-"}
              {new Date(ad.createdDate).getMonth() + 1 < 10
                ? "0" + (new Date(ad.createdDate).getMonth() + 1)
                : new Date(ad.createdDate).getMonth() + 1}
              -
              {new Date(ad.createdDate).getDate() < 10
                ? "0" + new Date(ad.createdDate).getDate()
                : new Date(ad.createdDate).getDate()}{" "}
              {new Date(ad.createdDate).getHours() + ":"}
              {new Date(ad.createdDate).getMinutes() < 10
                ? "0" + new Date(ad.createdDate).getMinutes()
                : new Date(ad.createdDate).getMinutes()}
            </DescriptionText>
          </DescriptionItem>
        </div>
        <Link to="/fiat-deal">
          <BackButton>{t("fiatOverview")}</BackButton>
        </Link>
      </DescriptionContainer>
      <Footer locationPage={"/deal"} />
    </PageContainer>
  );
};

export default FiatCurrency;
