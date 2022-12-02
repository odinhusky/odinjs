import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import Drawer from "../UI/Drawer";
import cancel from "../../assets/icon/cancel.png";
import { useTranslation } from "react-i18next";

const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;
const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  display: flex;
  align-items: center;
  letter-spacing: 0.002em;
  color: #d32f2f;
`;

const CardTitleStatus = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #bdbcc8;
`;
const CardTime = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: #5f5c70;
  margin-bottom: 12px;
`;
const CardContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CardContentItem = styled.div`
  display: flex;
  flex-direction: column;
`;
const CardContentItemTitle = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: 0.004em;
  color: #8f8da2;
`;
const CardContentItemValue = styled.p`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  letter-spacing: 0.004em;
  color: #5f5c70;
`;

const OrderDrawer: React.FC<{
  isVisible: boolean;
  selectVisible: Dispatch<SetStateAction<boolean>>;
  height: number;
}> = ({ isVisible, selectVisible, height }) => {
  const handleisVisible = () => {
    selectVisible((v) => !v);
  };
  const { t } = useTranslation();
  return (
    <Drawer
      isVisible={isVisible}
      selectVisible={handleisVisible}
      height={height}
    >
      <TitleContainer>
        <DepthTitle>{t("stopProfitLoss")}</DepthTitle>
        <DrawerFullWarehouseImage
          src={cancel}
          alt="cancel"
          onClick={handleisVisible}
        />
      </TitleContainer>
      <Card style={{ borderBottom: "1px solid #F4F4F6", paddingBottom: 16 }}>
        <CardTitleContainer>
          <CardTitle>止盈平多</CardTitle>
          <CardTitleStatus>未生效</CardTitleStatus>
        </CardTitleContainer>
        <CardTime>2021-10-19 13:24:30</CardTime>
        <CardContentContainer>
          <CardContentItem>
            <CardContentItemTitle>{`觸發條件(USDT)`}</CardContentItemTitle>
            <CardContentItemValue>{`≥20,000.0`}</CardContentItemValue>
          </CardContentItem>
          <CardContentItem>
            <CardContentItemTitle>{t("orderSize")}{`(BTC)`}</CardContentItemTitle>
            <CardContentItemValue>{`0.1`}</CardContentItemValue>
          </CardContentItem>
          <CardContentItem>
            <CardContentItemTitle>{t("orderPrice")}{`(USDT)`}</CardContentItemTitle>
            <CardContentItemValue>{`17,980.0`}</CardContentItemValue>
          </CardContentItem>
        </CardContentContainer>
      </Card>
      <Card style={{ marginBottom: 50, marginTop: 16 }}>
        <CardTitleContainer>
          <CardTitle style={{ color: "#29A370" }}>止盈平多</CardTitle>
          <CardTitleStatus>未生效</CardTitleStatus>
        </CardTitleContainer>
        <CardTime>2021-10-19 13:24:30</CardTime>
        <CardContentContainer>
          <CardContentItem>
            <CardContentItemTitle>{`觸發條件(USDT)`}</CardContentItemTitle>
            <CardContentItemValue>{`≥20,000.0`}</CardContentItemValue>
          </CardContentItem>
          <CardContentItem>
            <CardContentItemTitle>{t("orderSize")}{`(BTC)`}</CardContentItemTitle>
            <CardContentItemValue>{`0.1`}</CardContentItemValue>
          </CardContentItem>
          <CardContentItem>
            <CardContentItemTitle>{t("orderPrice")}{`(USDT)`}</CardContentItemTitle>
            <CardContentItemValue>{`17,980.0`}</CardContentItemValue>
          </CardContentItem>
        </CardContentContainer>
      </Card>
    </Drawer>
  );
};

export default OrderDrawer;
