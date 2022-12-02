import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { NavLink } from "react-router-dom";
import BackIcon from "../../assets/icon/back.png";
import { useTranslation } from "react-i18next";

// import search from "../../assets/icon/Deal/search.png";
// import star from "../../assets/icon/star.png";
// import cramstar from "../../assets/icon/cramstar.png";
const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #f4f4f6;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  padding-bottom:25px;
  
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
  font-family:Open Sans;
`;
const LinkText = styled(NavLink)`
  text-decoration: none;
  display: flex;
`;

const AnnouncementHeader: React.FC<{
  removeFavorite: () => void;
  isFavorite: boolean;
}> = ({ removeFavorite, isFavorite }) => {
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <HeaderLeft>
        <LinkText to="/deal">
          <NavImage src={BackIcon} alt="language" />
        </LinkText>
        <LogoImage>BTC/USDT {t("perpetualFuture")}</LogoImage>
        {/* <NavImage src={search} alt="language" />
        {isFavorite ? (
          <NavImage src={cramstar} alt="language" onClick={removeFavorite} />
        ) : (
          <NavImage src={star} alt="language" onClick={removeFavorite} />
        )} */}
      </HeaderLeft>
    </HeaderContainer>
  );
};

export default AnnouncementHeader;
