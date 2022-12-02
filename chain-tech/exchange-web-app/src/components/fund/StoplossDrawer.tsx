import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import Drawer from "../UI/Drawer";
import { COLORS } from "../../constants/colors";
import cancel from "../../assets/icon/cancel.png";
import FixedFloatInput from "react-fixed-float-input";

const DrawerFullWarehouseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;

const DrawerFullWarehouseTitle = styled.p`
  flex: 1;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;

const CancelButton = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #8f8da2;
`;

const WareHousedPriceInputContainer = styled.div<{ content: string }>`
  position: relative;
  width: 100%;
  &::after {
    content: "${(props) => props.content}";
    position: absolute;
    top: 10px;
    right: 16px;
    color: #8f8da2;
    font-size: 16px;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InputLabel = styled.label`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #5f5c70;
  margin-bottom: 4px;
`;

const ConfirmButton = styled.button`
  border: none;
  width: 100%;
  height: 44px;
  background: #d32f2f;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #ffffff;
`;

const WareHousedCountInput = styled(FixedFloatInput)`
  border: none;
  background: #f4f4f6;
  width: 100%;
  height: 48px;
  position: relative;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: #bdbcc8;
  padding-left: 16px;
  &:focus {
    outline: none;
  }
`;

const StopLossDrawer: React.FC<{
  isVisible: boolean;
  selectVisible: Dispatch<SetStateAction<boolean>>;
  height: number;
  stopLoss: number | string;
  setStopLoss: Dispatch<SetStateAction<number | string>>;
  stopLossPrice: number | string;
  setStopLossPrice: Dispatch<SetStateAction<number | string>>;
  stopEarning: number | string;
  setStopEarning: Dispatch<SetStateAction<number | string>>;
  stopEarningPrice: number | string;
  setStopEarningPrice: Dispatch<SetStateAction<number | string>>;
  setFunctionLeftCheckbox: Dispatch<SetStateAction<boolean>>;
}> = ({
  isVisible,
  selectVisible,
  height,
  stopLoss,
  setStopLoss,
  stopLossPrice,
  setStopLossPrice,
  stopEarning,
  setStopEarning,
  stopEarningPrice,
  setStopEarningPrice,
  setFunctionLeftCheckbox,
}) => {
  const handleisVisible = () => {
    setStopLoss(0);
    setStopLossPrice(0);
    setStopEarning(0);
    setStopEarningPrice(0);
  };
  const handleDrawerOption = () => {
    selectVisible((v) => !v);
    setFunctionLeftCheckbox((v) => !v);
  };
  return (
    <Drawer
      isVisible={isVisible}
      selectVisible={handleisVisible}
      height={height}
    >
      <DrawerFullWarehouseTitleContainer>
        <DrawerFullWarehouseImage
          src={cancel}
          alt="cancel"
          onClick={() => selectVisible((v) => !v)}
        />
        <DrawerFullWarehouseTitle>{"止虧/止損"}</DrawerFullWarehouseTitle>
        <CancelButton onClick={handleisVisible}>{`清除`}</CancelButton>
      </DrawerFullWarehouseTitleContainer>
      <ItemContainer>
        <InputLabel htmlFor="">{`止盈價`}</InputLabel>
        <WareHousedPriceInputContainer content="USDT">
          <WareHousedCountInput
            style={{
              color: stopLoss > 6000 ? COLORS.Red : "#8f8da2",
            }}
            value={stopLoss}
            onChangeValue={(value: number) => {
              setStopLoss(value);
            }}
            precision={3}
            placeholder="輸入止盈價格"
          />
        </WareHousedPriceInputContainer>
      </ItemContainer>
      <ItemContainer>
        <InputLabel htmlFor="">{`賣出價`}</InputLabel>
        <WareHousedPriceInputContainer content="USDT">
          <WareHousedCountInput
            style={{
              color: stopLossPrice > 6000 ? COLORS.Red : "#8f8da2",
            }}
            value={stopLossPrice}
            onChangeValue={(value: number) => {
              setStopLossPrice(value);
            }}
            precision={3}
            placeholder="輸入賣出價格"
          />
        </WareHousedPriceInputContainer>
      </ItemContainer>
      <ItemContainer>
        <InputLabel htmlFor="">{`止損價`}</InputLabel>
        <WareHousedPriceInputContainer content="USDT">
          <WareHousedCountInput
            style={{
              color: stopEarning > 6000 ? COLORS.Red : "#8f8da2",
            }}
            value={stopEarning}
            onChangeValue={(value: number) => {
              setStopEarning(value);
            }}
            precision={3}
            placeholder="輸入止損價格"
          />
        </WareHousedPriceInputContainer>
      </ItemContainer>
      <ItemContainer>
        <InputLabel htmlFor="">{`賣出價`}</InputLabel>
        <WareHousedPriceInputContainer content="USDT">
          <WareHousedCountInput
            style={{
              color: stopEarningPrice > 6000 ? COLORS.Red : "#8f8da2",
            }}
            value={stopEarningPrice}
            onChangeValue={(value: number) => {
              setStopEarningPrice(value);
            }}
            precision={3}
            placeholder="輸入賣出價格"
          />
        </WareHousedPriceInputContainer>
      </ItemContainer>
      <ConfirmButton onClick={handleDrawerOption}>確認</ConfirmButton>
    </Drawer>
  );
};

export default StopLossDrawer;
