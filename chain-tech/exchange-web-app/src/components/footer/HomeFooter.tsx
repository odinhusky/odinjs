import React from "react";

// % context
import { useGlobalCtx } from '@/components/Layout/GlobalContext';

// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// - Images
// import MyProfile from "@/assets/icon/Tab/profile.png";
// import SelectMyProfile from "@/assets/icon/Tab/select-profile.png";

import Home from '@/assets/footer/home.svg';
import SelectHome from '@/assets/footer/home_active.svg';
import Quote from '@/assets/footer/quote.svg';
import SelectQuote from '@/assets/footer/quote_active.svg';
import Deal from '@/assets/footer/deal.svg';
import SelectDeal from '@/assets/footer/deal_active.svg';
import Fund from '@/assets/footer/fund.svg';
import SelectFund from '@/assets/footer/fund_active.svg';
import Order from '@/assets/footer/order.svg';
import SelectOrder from '@/assets/footer/order_active.svg';


// ^ Plugins
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isEmpty } from 'lodash';

// = Styled Component
import styled from "styled-components";

const HeaderContainer = styled.footer`
  background-color: ${COLORS.White};
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  box-shadow: 0px -2px 4px rgba(143, 141, 162, 0.07);
  padding-bottom: 10px;
  position: fixed;
  width: 100%;
  bottom: 0;
  @media (min-width: 1200px) {
    background-color: #191919;
    height: 200px;
    justify-content: space-between;
    padding: 60px 149px 67px 148px;
  }
`;
const TabImage = styled.img`
  width: 31px;
  height: 28px;
`;
const TabDescription = styled.p<{ isLocate: boolean }>`
  font-family: PingFang TC;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
  color: ${props => (props.isLocate ? "#383743" : "#BDBCC8")};
`;
const LinkText = styled(Link)`
  margin-top: 10.5px;
  text-decoration: none;
  @media (min-width: 1200px) {
    display: none;
  }
`;
const FooterLeft = styled.div`
  display: none;
  @media (min-width: 1200px) {
    display: block;
    width: 104px;
    height: 60px;
    float: Left;
    font-size: 12px;
    color: #828282;
  }
`;
const FooterRight = styled.div`
  display: none;
  @media (min-width: 1200px) {
    width: 556px;
    height: 124px;
    float: Left;
    display: flex;
    justify-content: space-between;
    color: #ffffff;
  }
`;
const FooterRightContainer = styled.div`
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
`;
const RightContainerTitle = styled.p`
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 12px;
`;
const RightContainerDescription = styled.p`
  font-size: 12px;
  color: #828282;
  margin-bottom: 6px;
`;

interface FooterProps {
  locationPage: string
}

const Footer = (props: FooterProps) => {

  // $ init data
  const { t } = useTranslation();
  const { locationPage } = props;

  // % context
  const { isLogin } = useGlobalCtx();

  // & handled data
  const links = [
    // 首頁
    {
      key: 0,
      alt: 'home',
      img: Home,
      selectedImg: SelectHome,
      path: '/home',
      text: t("home")
    },
    // 市場 || 行情
    {
      key: 1,
      alt: 'quote',
      img: Quote,
      selectedImg: SelectQuote,
      path: '/quote',
      text: t("Quotes")
    },
    // 交易
    {
      key: 2,
      alt: 'trade',
      img: Deal,
      selectedImg: SelectDeal,
      path: isLogin ? '/deal' : '/login',
      text: t("trade")
    },
    // 資金
    {
      key: 3,
      alt: 'funds',
      img: Fund,
      selectedImg: SelectFund,
      path: isLogin ? '/fund' : '/login',
      text: t("funding")
    },
    // 訂單
    {
      key: 4,
      alt: 'orders',
      img: Order,
      selectedImg: SelectOrder,
      path: isLogin ? '/orders' : '/login',
      text: t("order")
    },
    // 我的
    // {
    //   key: 5,
    //   alt: 'menu',
    //   img: MyProfile,
    //   selectedImg: SelectMyProfile,
    //   path: isLogin ? '/profile' : '/login',
    //   text: t("profile")
    // }
  ];

  return (
    <HeaderContainer>
      {/* 目前 Footer 的按鈕 */}
      {
        !isEmpty(links) &&
        links.map(item => {
          const isActive = locationPage === item.path;
          return (
          <LinkText key={item.key} to={item.path}>
            {isActive ? (
              <TabImage src={item.selectedImg} alt={item.alt} />
            ) : (
              <TabImage src={item.img} alt={item.alt} />
            )}
            <TabDescription isLocate={isActive}>
              { item.text }
            </TabDescription>
          </LinkText>
        )})
      }

      {/* ! 以下內容目前沒有顯示 ! */}
      <FooterLeft>
        <p
          style={{
            color: "#FDFDFD",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 10
          }}
        >
          LOGO
        </p>
        <p>© 2021 Company</p>
      </FooterLeft>
      <FooterRight>
        <FooterRightContainer>
          <RightContainerTitle>交易</RightContainerTitle>
          <RightContainerDescription>OTC 法幣交易</RightContainerDescription>
          <RightContainerDescription>
            {t("tradeFutures")}
          </RightContainerDescription>
        </FooterRightContainer>
        <FooterRightContainer>
          <RightContainerTitle>{t("helpPage")}</RightContainerTitle>
          <RightContainerDescription>公吿</RightContainerDescription>
          <RightContainerDescription>{t("guide")}</RightContainerDescription>
          <RightContainerDescription>{t("questions")}</RightContainerDescription>
        </FooterRightContainer>
        <FooterRightContainer>
          <RightContainerTitle>{t("aboutUs")}</RightContainerTitle>
          <RightContainerDescription>{t("aboutUs")}</RightContainerDescription>
          <RightContainerDescription>隱私權政策</RightContainerDescription>
        </FooterRightContainer>
        <FooterRightContainer>
          <RightContainerTitle>{t("memberCenter")}</RightContainerTitle>
          <RightContainerDescription>公吿</RightContainerDescription>
          <RightContainerDescription>安全政策</RightContainerDescription>
          <RightContainerDescription>
            {t("accountSet")}
          </RightContainerDescription>
          <RightContainerDescription>{t("myAds")}</RightContainerDescription>
          <RightContainerDescription>代理反佣</RightContainerDescription>
        </FooterRightContainer>
      </FooterRight>
    </HeaderContainer>
  );
};

export default Footer;
