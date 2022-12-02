import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { NavLink } from "react-router-dom";
import BackIcon from "../../assets/icon/back.png";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #f4f4f6;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  width: 100%;
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
`;
const NavImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 12px;
`;
const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
  padding: 0 30px 0 0;
`;
const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
`;

const AnnouncementHeader = () => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <LinkText to="/member">
          <NavImage src={BackIcon} alt="language" />
        </LinkText>
        <LogoImage>C2C管理中心</LogoImage>
      </HeaderLeft>
    </HeaderContainer>
  );
};

export default AnnouncementHeader;
