import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { NavLink } from "react-router-dom";
import BackIcon from "../../assets/icon/back.png";
import { useTranslation } from "react-i18next";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid #f4f4f6;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
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
const SelectContainer = styled.div`
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;
const SelectItem = styled.div<{ currentItem: number; name: number }>`
  font-weight: 500;
  font-size: 14px;
  color: ${(props) =>
    props.currentItem === props.name ? "#383743" : "#8f8da2"};
  border-bottom: ${(props) =>
    props.currentItem === props.name ? "2px solid #d32f2f" : "none"};
  height: 100%;
  display: flex;
  align-items: center;
`;

const AnnouncementHeader: React.FC<{
  currentItem: number;
  select: (text: number) => void;
}> = ({ select, currentItem }) => {
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <HeaderLeft>
        <LinkText to="/member">
          <NavImage src={BackIcon} alt="language" />
        </LinkText>
        <LogoImage>{t("announcement")}</LogoImage>
      </HeaderLeft>
      <SelectContainer>
        <SelectItem
          onClick={() => { select(-1) }}
          currentItem={currentItem}
          name={-1}
        >
          <p>{t("allAnn")}</p>
        </SelectItem>
        <SelectItem
          onClick={() => { select(0) }}
          currentItem={currentItem}
          name={0}
        >
          <p>{t("event")}</p>
        </SelectItem>
        <SelectItem
          onClick={() => { select(1) }}
          currentItem={currentItem}
          name={1}
        >
          <p>{t("tradeFiat")}</p>
        </SelectItem>
        <SelectItem
          onClick={() => { select(2) }}
          currentItem={currentItem}
          name={2}
        >
          <p>{t("tradeFutures")}</p>
        </SelectItem>
        <SelectItem
          onClick={() => { select(3) }}
          currentItem={currentItem}
          name={3}
        >
          <p>新聞</p>
        </SelectItem>
      </SelectContainer>
    </HeaderContainer>
  );
};

export default AnnouncementHeader;
