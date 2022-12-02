import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { NavLink } from "react-router-dom";
import Language from "../../assets/icon/language.png";
import Currency from "../../assets/icon/currency.png";
import Menu from "../../assets/icon/menu.png";
import { useTranslation } from "react-i18next";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
`;
const HeaderRight = styled.div`
  float: Right;
  display: flex;
  align-items: center;
  height: 44px;
`;
const NavImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 12px;
`;
const LogoImage = styled.p`
  font-family: SF Pro Text;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 40px;
  color: #383743;
  margin-left: 12px;
`;
const SelectIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 12px;
`;
const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
`;

const DealHeader = () => {
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <HeaderLeft>
        <NavImage src={Menu} alt="language" />
        {/* <LinkText to="/">
          <LogoImage>LOGO</LogoImage>
        </LinkText> */}
      </HeaderLeft>
      <HeaderRight>
        <SelectIcon src={Language} alt="language" />
        <SelectIcon src={Currency} alt="currency" />
      </HeaderRight>
    </HeaderContainer>
  );
};

export default DealHeader;
