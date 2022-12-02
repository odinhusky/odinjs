import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { CURRENCY_UNIT } from "../../constants/currency";
import Cancel from "../../assets/icon/Deal/backArrow.png";
import search from "../../assets/icon/Deal/graySearchIcon.png";
import emptyIcon from "../../assets/icon/Deal/emptyIcon.png";
// import { useTranslation } from "react-i18next";
import { ReactComponent as DoneIcon } from "../../assets/icon/done.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  padding: 16px 20px;
`;

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 4px;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-left: 40%;
`;
const SelectIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const SetButton = styled.div`
  text-align: center;
  color: ${COLORS.Dark_gray};
  font-weight: 600;
`;
const SelectContainer = styled.div`
  flex: 1;
`;
const InputContainer = styled.div`
  position: relative;
`;
const SelectInput = styled.input`
  width: 100%;
  height: 32px;
  font-weight: 400;
  font-size: 15px;
  color: ${COLORS.Dark_gray};
  margin-bottom: 10px;
  background: ${COLORS.EXLight_gray};
  border: none;
  padding: 4px 4px 4px 40px;
`;
const InputIcon = styled.img`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 7px;
  left: 13px;
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
const EmptyIconContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
`;
const EmptyIconContainerIcon = styled.img`
  width: 135px;
  height: 135px;
`;
const EmptyIconContainerTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  color: #bdbcc8;
  margin-top: 24px;
`;

const FiatCurrency = () => {
  const [currencyUnit, setCurrencyUnit] = useState("");
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const resultArray = CURRENCY_UNIT.filter((item) => {
    if (!searchText) {
      return true;
    } else {
      return (
        item.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
        item.other.includes(searchText.trim())
      );
    }
  });

  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderLeft>
          <Link to="/fiat-deal">
            <SelectIcon src={Cancel} alt="cancel" />
          </Link>
        </HeaderLeft>
        <HeaderRight>
          <SetButton>{t("fundFiat")}</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <SelectContainer>
        <InputContainer>
          <InputIcon src={search} alt="find" />
          <SelectInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜尋法幣"
          />
        </InputContainer>
        <SelectTable>
          {resultArray.map((currency) => {
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
          {resultArray.length === 0 && (
            <EmptyIconContainer>
              <EmptyIconContainerIcon src={emptyIcon} alt="empty icon" />
              <EmptyIconContainerTitle>無結果</EmptyIconContainerTitle>
            </EmptyIconContainer>
          )}
        </SelectTable>
      </SelectContainer>
    </PageContainer>
  );
};

export default FiatCurrency;
