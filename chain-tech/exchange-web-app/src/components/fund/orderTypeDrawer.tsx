import React, { useState, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import Drawer from "../UI/Drawer";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;
const DepthItem = styled.div<{ isSelect: number; index: number }>`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #f4f4f6;
  height: 55px;
  line-height: 55px;
  color: ${(props) =>
    props.isSelect === props.index ? COLORS.Red : "#5f5c70"};
`;

const OrderDrawer: React.FC<{
  isVisible: boolean;
  selectVisible: Dispatch<SetStateAction<boolean>>;
  height: number;
  setOrderTypeSelect: Dispatch<SetStateAction<number>>;
  orderTypeSelect: number;
  getPrice
}> = ({
  isVisible,
  selectVisible,
  height,
  setOrderTypeSelect,
  orderTypeSelect,
  getPrice
}) => {
  const [selectOption, setSelectOption] = useState(orderTypeSelect);
  const handleisVisible = () => {
    selectVisible((v) => !v);
  };
  const handleDrawerOption = (item: number) => {
    setSelectOption(item);
    setOrderTypeSelect(item);
    selectVisible((v) => !v);
  };
  const { t } = useTranslation();
  return (
    <Drawer
      isVisible={isVisible}
      selectVisible={handleisVisible}
      height={height}
    >
      <DepthTitle>{t("orderType")}</DepthTitle>
      <DepthItem
        isSelect={selectOption}
        index={0}
        onClick={handleDrawerOption.bind(null, 0)}
      >
        {t("limitedOrder")}
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={1}
        onClick={
          ()=>{
            handleDrawerOption(1)
            getPrice()
          }}
      >
        {t("marketOrder")}
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={2}
        onClick={handleDrawerOption.bind(null, 2)}
      >
        {t("stopLimitOrder")}
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={3}
        onClick={handleDrawerOption.bind(null, 3)}
      >
        {t("stopMarketOrder")}
      </DepthItem>
    </Drawer>
  );
};

export default OrderDrawer;
