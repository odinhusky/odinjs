import React, { } from 'react';

// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// - Images
import cancelIcon from "@/assets/icon/cancel.png";
import searchIcon from "../../assets/icon/Deal/search.png";

// ^ Plugins
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// = Styled Components
import styled from "styled-components";

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid ${COLORS.EXLight_gray};
  padding: 20px 12px 6px 12px;
  position: relative;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  align-items: center;
`;

const SearchIconDiv = styled.div`
  width: 28px;
  height: 28px;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const CancelLink = styled(Link)`
  width: 28px;
  height: 28px;
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${COLORS.Dark_gray};
`;

const CancelBtn = styled.button`
  width: 28px;
  height: 28px;
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${COLORS.Dark_gray};
  position: absolute;
  right: 16px;
  top: 22px;
  padding: 0;
  border: none;
  background-color: transparent;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 32px;
  paddingLeft: 40px;
  background: ${COLORS.EXLight_gray};
  borderRadius: 4px;
  borderColor: transparent;
  border: none;
  padding-left: 8px
`;

// ^ Types or Interfaces
interface BaseSearchProps {
  searchText: string,
  setSearchText: Function,
  isCancelTextLink?: boolean,
  cancelTextLinkPath?: string
}

export const BaseSearch = ({
  searchText,
  setSearchText,
  isCancelTextLink = false,
  cancelTextLinkPath = '/home'
}: BaseSearchProps) => {

  // $ init data
  const { t } = useTranslation();

  return (
    <div>
      <SearchContainer>

        <SearchIconDiv>
          <Icon src={searchIcon} alt="search" />
        </SearchIconDiv>

        <SearchInput
          placeholder={t("search")}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value.trim());
          }}
        />

        {
          isCancelTextLink ? (
            <CancelLink to={cancelTextLinkPath}>
              <Icon src={cancelIcon} alt="cancel" />
            </CancelLink>
          ) : (
            <CancelBtn type="button" onClick={() => { setSearchText('') }}>
              <Icon src={cancelIcon} alt="cancel" />
            </CancelBtn>
          )
        }
      </SearchContainer>
    </div>
  )
}

export default BaseSearch
