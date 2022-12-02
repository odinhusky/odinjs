import React, { useState, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import BackIcon from "../../assets/icon/Deal/backArrow.png";
import { CURRENCY_UNIT } from "../../constants/currency";
import { ReactComponent as DoneIcon } from "../../assets/icon/done.svg";
import search from "../../assets/icon/Deal/graySearchIcon.png";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fff;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
`;
const NavImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 12px;
`;
const LogoImage = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #383743;
  flex: 1;
  text-align: center;
`;
const SelectContainer = styled.div`
  flex: 1;
  padding: 11px 16px;
  flex: 1;
`;
const SelectTable = styled.ul`
  width: 100%;
`;
const SelectItem = styled.li`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f6;
  font-weight: 500;
  font-size: 15px;
  color: #383743;
`;
const CurrencyDescription = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const CurrencyIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #ff786b;
  opacity: 0.16;
  border-radius: 12px;
  display: relative;
  margin-right: 12px;
`;
const CurrencyIcon = styled.p`
  position: absolute;
  left: 12px;
  top: 12px;
  transform: translateX(-50%) translateY(-50%);
`;
const SearchInputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  padding-bottom: 10px;
  position: relative;
`;
const SearchInput = styled.input`
  width: 343px;
  height: 32px;
  background: ${COLORS.EXLight_gray};
  border-radius: 4px;
  padding: 4px 12px 4px 40px;
  border: none;
`;
const InputIcon = styled.img`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 7px;
  left: 30px;
`;

const Modal: React.FC<{
  currencyUnit: string;
  setCurrencyUnit: Dispatch<SetStateAction<string>>;
  setChangeUnit: Dispatch<SetStateAction<boolean>>;
}> = ({ currencyUnit, setCurrencyUnit, setChangeUnit }) => {
  const [searchText, setSearchText] = useState("");
  const filterCurrency = CURRENCY_UNIT.filter((item) => {
    if (!searchText) {
      return true;
    } else {
      return (
        item.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
        item.other.includes(searchText.trim())
      );
    }
  });
  const { t } = useTranslation();
  return (
    <PageContainer>
      <TitleContainer>
        <NavImage
          src={BackIcon}
          alt="language"
          onClick={() => setChangeUnit(false)}
        />
        <LogoImage>{t("fundFiat")}</LogoImage>
      </TitleContainer>
      <SearchInputContainer>
        <InputIcon src={search} alt="find" />
        <SearchInput
          placeholder="請輸入法幣"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </SearchInputContainer>
      <SelectContainer>
        <SelectTable>
          {filterCurrency.map((currency) => {
            return (
              <SelectItem
                key={currency.name}
                onClick={() => {
                  setCurrencyUnit(currency.name);
                }}
              >
                <CurrencyDescription>
                  <CurrencyIconContainer />
                  <CurrencyIcon>{`${currency.unit}`}</CurrencyIcon>
                  <p>{`${currency.other} - ${currency.name}`}</p>
                </CurrencyDescription>
                {currencyUnit === currency.name && <DoneIcon />}
              </SelectItem>
            );
          })}
        </SelectTable>
      </SelectContainer>
    </PageContainer>
  );
};

export default Modal;
