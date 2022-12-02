import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { CURRENCY_UNIT } from "../../constants/currency";
import { Link } from "react-router-dom";
// import Language from "../../assets/icon/home/language.png";
// import Currency from "../../assets/icon/home/currency.png";
import MemberIcon from "@/assets/member/member-icon.svg";
import Avatar from "../../assets/icon/account_circle.png";
import ArrowDown from "../../assets/icon/ArrowDown.png";
import ArrowUp from "../../assets/icon/ArrowUp.png";
// import Agent from "../../assets/icon/home/Vector.png";
import Search from "../../assets/home/search.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CustomerServiceOutlined,
  ExpandOutlined,
  MailOutlined,
} from "@ant-design/icons";
// % context
import { useGlobalCtx } from "@/components/Layout/GlobalContext";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: ${COLORS.White};
  @media (min-width: 768px) {
  }
  @media (min-width: 1200px) {
    height: 56px;
    background-color: #191919;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  width: 62%;
  @media (min-width: 1200px) {
    height: 56px;
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  @media (min-width: 1200px) {
    height: 56px;
  }
`;
const NavImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 12px;
  @media (min-width: 768px) {
  }
  @media (min-width: 1200px) {
    display: none;
  }
`;
// const LogoImage = styled.p`
//   font-family: SF Pro Text;
//   font-style: normal;
//   font-weight: 700;
//   font-size: 16px;
//   line-height: 40px;
//   color: #383743;
//   margin-left: 12px;
//   @media (min-width: 768px) {
//   }
//   @media (min-width: 1200px) {
//     margin-left: 30px;
//     color: #fdfdfd;
//     font-size: 24px;
//   }
// `;
// const SelectIcon = styled.img`
//   width: 28px;
//   height: 28px;
//   margin-right: 12px;
//   @media (min-width: 768px) {
//   }
//   @media (min-width: 1200px) {
//     display: none;
//   }
// `;
const LinkText = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
`;
const NavSelect = styled.p`
  display: none;
  @media (min-width: 1200px) {
    display: block;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #fdfdfd;
    margin-left: 60px;
  }
`;
const DesktopNavItem = styled.div`
  display: none;
  @media (min-width: 1200px) {
    display: flex;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #fdfdfd;
    margin-right: 26px;
  }
`;
const SeparateIcon = styled.div`
  display: none;
  @media (min-width: 1200px) {
    display: block;
    width: 1px;
    height: 18px;
    background: #333333;
    margin: 0 12px;
  }
`;
const SelectButton = styled.img`
  width: 19px;
  height: 19px;
  margin-left: 4px;
`;
const SelectCurrencyContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    position: absolute;
    width: 180px;
    height: 314px;
    background: #fdfdfd;
    top: 30px;
    left: -75px;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: scroll;
  }
`;
const SelectLangContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    position: absolute;
    width: 120px;
    height: 135px;
    background: #fdfdfd;
    top: 30px;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
const SelectLangItem = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`;
const SelectProfileContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    position: absolute;
    width: 120px;
    height: 271px;
    background: #fdfdfd;
    top: 50px;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
const SelectFundsContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    position: absolute;
    width: 120px;
    height: 176px;
    background: #fdfdfd;
    top: 50px;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
const SelectOrderContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    position: absolute;
    width: 120px;
    height: 94px;
    background: #fdfdfd;
    top: 50px;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const Header: React.FC = () => {

  // % context
  const { setIsOpenNotice } = useGlobalCtx();

  const [isLangChangeLang, setIsLangChangeLang] = useState(false);
  const [isProfileChangeLang, setIsProfileChangeLang] = useState(false);
  const [isOrderChangeLang, setIsOrderChangeLang] = useState(false);
  const [isFundsChangeLang, setIsFundsChangeLang] = useState(false);
  const [isCurrencyChangeLang, setIsCurrencyChangeLang] = useState(false);

  const navigation = useNavigate();
  const { t } = useTranslation();

  const changeSelectHandler = (text: string) => {
    if (text === "lang") {
      setIsLangChangeLang(true);
    } else if (text === "profile") {
      setIsProfileChangeLang(true);
    } else if (text === "Order") {
      setIsOrderChangeLang(true);
    } else if (text === "Funds") {
      setIsFundsChangeLang(true);
    } else if (text === "Currency") {
      setIsCurrencyChangeLang(true);
    }
  };
  const closeSelectHandler = () => {
    setIsLangChangeLang(false);
    setIsProfileChangeLang(false);
    setIsOrderChangeLang(false);
    setIsFundsChangeLang(false);
    setIsCurrencyChangeLang(false);
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        {/* 專址到會員頁面 */}
        <NavImage
          src={MemberIcon}
          alt="language"
          onClick={() => { navigation("/member") }}
        />

        <div
          style={{
            width: "70%",
            height: 30,
            marginLeft: 5,
            backgroundColor: "#F4F4F6",
            display: "flex",
            alignItems: "center",
            borderRadius: 20,
          }}
          onClick={() => {
            navigation("/search-deal");
          }}
        >
          <img
            src={Search}
            style={{ width: 22, height: 22, marginLeft: 5 }}
            alt=""
          />
          <p style={{ color: "#BDBCC8", fontSize: 13 }}>{t("search")}</p>
        </div>

        {/* <LinkText to="/">
          <LogoImage>LOGO</LogoImage>
        </LinkText> */}
        <LinkText to="/">
          <NavSelect>OTC法幣交易</NavSelect>
        </LinkText>
        <LinkText to="/">
          <NavSelect>{t("tradeFutures")}</NavSelect>
        </LinkText>
        <LinkText to="/">
          <NavSelect>{t("helpPage")}</NavSelect>
        </LinkText>
        <LinkText to="/">
          <NavSelect>{t("aboutUs")}</NavSelect>
        </LinkText>
      </HeaderLeft>
      <HeaderRight>
        {/* <SelectIcon
          style={{ width: 20, height: 20, marginRight: 5 }}
          src={Agent}
          alt="language"
          onClick={() => {
            window.open("https://chat.usefordemo.com/", "_parent");
          }}
        /> */}
        <CustomerServiceOutlined
          alt="language"
          style={{ fontSize: "20px", marginRight: 5 }}
          onClick={() => {
            window.open("https://chat.usefordemo.com/", "_parent");
          }}
        />
        <ExpandOutlined
          alt="language"
          style={{ fontSize: "20px", marginRight: 5 }}
        />
        <MailOutlined
          alt="language"
          style={{ fontSize: "20px", marginRight: 16 }}
          onClick={() => {
            setIsOpenNotice(true);
          }}
        />
        {/* <SelectIcon
          src={Language}
          alt="language"
          onClick={changeModal.bind(null, "lang")}
          style={{ marginRight: 0 }}
        />
        <SelectIcon
          src={Currency}
          alt="currency"
          onClick={changeModal.bind(null, "currency")}
        /> */}
        <DesktopNavItem>
          <div
            style={{ display: "flex" }}
            onMouseEnter={changeSelectHandler.bind(null, "Funds")}
          >
            <p>{t("funding")}</p>
            {isFundsChangeLang ? (
              <SelectButton src={ArrowUp} alt="arrowDown" />
            ) : (
              <SelectButton src={ArrowDown} alt="arrowDown" />
            )}
          </div>
          {isFundsChangeLang && (
            <SelectFundsContainer onMouseLeave={closeSelectHandler}>
              <SelectLangItem>{t("funding")}</SelectLangItem>
              <SelectLangItem>{t("fundSpot")}</SelectLangItem>
              <SelectLangItem>{t("futuresList")}</SelectLangItem>
              <SelectLangItem>{t("fundFiat")}</SelectLangItem>
            </SelectFundsContainer>
          )}
        </DesktopNavItem>
        <DesktopNavItem>
          <div
            style={{ display: "flex" }}
            onMouseEnter={changeSelectHandler.bind(null, "Order")}
          >
            <p>{t("order")}</p>
            {isOrderChangeLang ? (
              <SelectButton src={ArrowUp} alt="arrowDown" />
            ) : (
              <SelectButton src={ArrowDown} alt="arrowDown" />
            )}
          </div>
          {isOrderChangeLang && (
            <SelectOrderContainer onMouseLeave={closeSelectHandler}>
              <SelectLangItem>OTC{t("orderFiat")}</SelectLangItem>
              <SelectLangItem>{t("orderFutures")}</SelectLangItem>
            </SelectOrderContainer>
          )}
        </DesktopNavItem>
        <DesktopNavItem>
          <img
            src={Avatar}
            alt="avatar"
            onMouseEnter={changeSelectHandler.bind(null, "profile")}
          />
          {isProfileChangeLang && (
            <SelectProfileContainer onMouseLeave={closeSelectHandler}>
              <SelectLangItem>{t("funding")}</SelectLangItem>
              <SelectLangItem>{t("security")}</SelectLangItem>
              <SelectLangItem>{t("accountSet")}</SelectLangItem>
              <SelectLangItem>{t("myAds")}</SelectLangItem>
              <SelectLangItem>代理反佣</SelectLangItem>
              <SelectLangItem
                style={{ borderTop: "1px solid #F2F2F2", paddingTop: 18 }}
              >
                {t("logOut")}
              </SelectLangItem>
            </SelectProfileContainer>
          )}
        </DesktopNavItem>
        <DesktopNavItem style={{ marginRight: 31, position: "relative" }}>
          <p onMouseEnter={changeSelectHandler.bind(null, "lang")}>
            {t("traditionalChinese")}
          </p>
          <SeparateIcon />
          <p onMouseEnter={changeSelectHandler.bind(null, "Currency")}>USD</p>
          {isLangChangeLang && (
            <SelectLangContainer onMouseLeave={closeSelectHandler}>
              <SelectLangItem>{t("english")}</SelectLangItem>
              <SelectLangItem>{t("traditionalChinese")}</SelectLangItem>
              <SelectLangItem>{t("simplifiedChinese")}</SelectLangItem>
            </SelectLangContainer>
          )}
          {isCurrencyChangeLang && (
            <SelectCurrencyContainer onMouseLeave={closeSelectHandler}>
              {CURRENCY_UNIT.map((currency, i) => {
                return (
                  <SelectLangItem
                    key={i.toString()}
                    style={{ marginBottom: 20 }}
                  >{`${currency.name} - ${currency.unit}`}</SelectLangItem>
                );
              })}
            </SelectCurrencyContainer>
          )}
        </DesktopNavItem>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
