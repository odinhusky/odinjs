import React from "react";
import { COLORS } from "../../constants/colors";

// - Images
import Deal from "@/assets/footer/deal.svg";
import Order from "@/assets/footer/order.svg";
import Fund from "@/assets/footer/fund.svg";
import MyProfile from "@/assets/icon/Tab/profile.png";
import Home from "@/assets/footer/home.svg";

// ^ Plugins
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// = Styled Component
import styled from "styled-components";

const HeaderContainer = styled.div`
  background-color: ${COLORS.White};
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  box-shadow: 0px -2px 4px rgba(143, 141, 162, 0.07);
  position: fixed;
  width: 100%;
  bottom: 0;
`;
const TabImage = styled.img`
  width: 31px;
  height: 28px;
`;
const TabDescription = styled.p`
  font-family: PingFang TC;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
  color: #383743;
`;
const LinkText = styled(Link)`
  text-decoration: none;
  margin-top:10px;
`;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <LinkText to="/">
        <TabImage src={Home} alt="language" />
        <TabDescription>首頁</TabDescription>
      </LinkText>
      <LinkText to="/deal">
        <TabImage src={Deal} alt="language" />
        <TabDescription>交易</TabDescription>
      </LinkText>
      <LinkText to="/fund">
        <TabImage src={Fund} alt="language" />
        <TabDescription>{t("funding")}</TabDescription>
      </LinkText>
      <LinkText to="/orders">
        <TabImage src={Order} alt="language" />
        <TabDescription>{t("order")}</TabDescription>
      </LinkText>
      <LinkText to="/profile">
        <TabImage src={MyProfile} alt="language" />
        <TabDescription>{t("profile")}</TabDescription>
      </LinkText>
    </HeaderContainer>
  );
};

export default Footer;
