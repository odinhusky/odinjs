import React, { useState, useEffect } from "react";

// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";
import { FiatRate } from '@/constants/type';

// - Images
import Cancel from "@/assets/icon/cancel.png";
import { ReactComponent as DoneIcon } from "@/assets/icon/done.svg";

// ^ Plugins
import { useTranslation } from "react-i18next";
import {
  isEmpty,
  // get,
  // isNil
} from "lodash";

// = Styled Components
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
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
const SelectIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 7px;
`;

const SetButton = styled.div`
  text-align: center;
  color: #8f8da2;
  font-weight: 600;
  margin-right: 16px;
`;
const SelectContainer = styled.div`
  flex: 1;
  padding: 11px 16px;
  flex: 1;
`;
const SelectTitle = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #383743;
  margin-bottom: 18px;
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

interface ChangeCurrencyModalProps {
  currencyUnit: string;
  onClose: () => void;
  changeUnit: (currency: string) => void;
  rateObj: FiatRate | {};
}

export const ChangeCurrencyModal = ({
  currencyUnit: globalCurrencyUnit,
  changeUnit,
  onClose,
  rateObj,
}: ChangeCurrencyModalProps) => {

  // $ init data
  const { t } = useTranslation();

  // # state
  const [currencyUnit, setCurrencyUnit] = useState("");
  const [currencyList, setCurrencyList] = useState<string[]>([]);

  // - methods
  const handleSetCurrency = () => {
    changeUnit(currencyUnit);
    onClose();
  };

  // * hooks
  useEffect(() => {
    setCurrencyUnit(globalCurrencyUnit);
  }, [globalCurrencyUnit]);

  /**
   * @author odin
   * @description 根據 API 取得的 rateObj 製作出有哪些幣別的陣列選單
  */
  useEffect(() => {
    if (isEmpty(rateObj)) return;

    const arr: string[] = Object.keys(rateObj).sort().map((key) => key);

    setCurrencyList(arr);
  }, [rateObj]);

  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            src={Cancel}
            alt="cancel"
            onClick={onClose}
          />
        </HeaderLeft>
        <HeaderRight>
          <SetButton onClick={handleSetCurrency}>{t("set")}</SetButton>
        </HeaderRight>
      </HeaderContainer>
      <SelectContainer>
        <SelectTitle>{t("selectCurrency")}</SelectTitle>
        <SelectTable>
          {currencyList.map((currency) => {
            return (
              <SelectItem
                key={currency}
                onClick={() => {
                  setCurrencyUnit(currency);
                }}
              >
                <CurrencyDescription>
                  <CurrencyIconContainer />
                  <CurrencyIcon>{"$"}</CurrencyIcon>
                  <p>{currency}</p>
                </CurrencyDescription>
                {currencyUnit === currency && <DoneIcon />}
              </SelectItem>
            );
          })}
        </SelectTable>
      </SelectContainer>
    </>
  );
};

export default ChangeCurrencyModal;
