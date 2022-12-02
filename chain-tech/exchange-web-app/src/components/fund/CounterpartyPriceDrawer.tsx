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

const CounterPartyPriceDrawer: React.FC<{
  isVisible: boolean;
  selectVisible: Dispatch<SetStateAction<boolean>>;
  height: number;
  setOrderTypeSelect: Dispatch<SetStateAction<number>>;
  orderTypeSelect: number;
}> = ({
  isVisible,
  selectVisible,
  height,
  setOrderTypeSelect,
  orderTypeSelect,
}) => {
  const [selectOption, setSelectOption] = useState(orderTypeSelect);
  const { t } = useTranslation();
  const handleisVisible = () => {
    selectVisible((v) => !v);
  };
  const handleDrawerOption = (item: number) => {
    setSelectOption(item);
    setOrderTypeSelect(item);
    selectVisible((v) => !v);
  };

  return (
    <Drawer
      isVisible={isVisible}
      selectVisible={handleisVisible}
      height={height}
    >
      <DepthTitle>{t("price")}</DepthTitle>
      <DepthItem
        isSelect={selectOption}
        index={0}
        onClick={handleDrawerOption.bind(null, 0)}
      >
        對手價
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={5}
        onClick={handleDrawerOption.bind(null, 5)}
      >
        最優 5 檔
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={10}
        onClick={handleDrawerOption.bind(null, 10)}
      >
        最優 10 檔
      </DepthItem>
      <DepthItem
        isSelect={selectOption}
        index={20}
        onClick={handleDrawerOption.bind(null, 20)}
      >
        最優 20 檔
      </DepthItem>
    </Drawer>
  );
};

export default CounterPartyPriceDrawer;
