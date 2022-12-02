// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// ^ Plugins
import FixedFloatInput from "react-fixed-float-input";
import { Link } from "react-router-dom";

// = Styled Component
import styled from "styled-components";

import { ResetBtn } from '@/styled-components/index';

export const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f4f4f6;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;
export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  align-content: center;
`;
export const TitleLeftButton = styled.p`
  width: 81px;
  height: 30px;
  font-weight: 600;
  font-size: 20px;
  color: #383743;
  margin-right: 24px;
  line-height: 1.5;
`;
export const TitleRightButton = styled.p`
  width: 66px;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  color: #8f8da2;
  line-height: 2;
`;

export const DealPairContainer = styled.div`
  width: 100%;
  padding: 16px 16px 0px 16px;
  align-items: space-between;
  background: transparent;
  margin-bottom: 10px;
`;

export const DealPairChange = styled.p<{ nowChange: number }>`
  color: ${p => p.nowChange >= 0 ? COLORS.Green : COLORS.Red};
  fontSize: 13px;
  marginTop: 5px;
  marginBottom: 8px;
  fontWeight: 600;
  fontFamily: "Open Sans";
  marginLeft: 8px;
`;

export const ContractContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  align-items: space-between;
  background: #fff;
  border-radius: 16px 16px 0 0;
  margin-bottom: 10px;
`;
export const CurrentContractContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;
export const CurrentContractName = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 16;
  font-weight: 700;
  color: #383743;
  font-family:Open Sans;
`;
export const CurrentContractImageList = styled.div`
  display: flex;
`;
export const CurrentContractImage = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 24px;
`;
export const CurrentContractButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;
export const CurrentContractButton = styled.button`
  width: auto;
  padding: 6px;
  background: #f4f4f6;
  border-radius: 4px;
  color: #5f5c70;
  font-size: 14px;
  font-weight: 600;
  border: none;
  font-family:Open Sans;
`;

export const TradeUnitButton = styled.button`
  width: 100%;
  padding: 6px;
  background: #f4f4f6;
  border-radius: 4px;
  color: #5f5c70;
  font-size: 14px;
  font-weight: 600;
  border: none;
  font-family:Open Sans;
`;

export const TradeUnitButtonHalf = styled.button<{ isActive }>`
  width: 50%;
  padding: 6px;
  background: ${p => p.isActive ? COLORS.Primary : COLORS.EXLight_gray};
  border-radius: 4px;
  color: ${p => p.isActive ? COLORS.White : COLORS.Gray};
  font-size: 14px;
  font-weight: 600;
  border: none;
  font-family:Open Sans;
`;

export const OperateContainer = styled.div<{
  orderTypeSelect: number;
}>`
  width: 100%;
  height: ${(props) => (props.orderTypeSelect === 2 ? "501px" : "453px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 16px 16px 16px;
  align-items: space-between;
  background: #fff;
  margin-bottom: 10px;
`;
export const OperateButtonList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  font-weight: 500;
  font-size: 14px;
  color: #8f8da2;
  height: 43px;
`;
export const TradeFunctionContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
`;
export const TradeFunctionLeftSide = styled.div`
  width: 54%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const OperateCurrencyButton = styled.div<{
  currencyOption: number;
  index: number;
}>`
  border-top: ${(props) =>
    props.currencyOption === props.index ? "2px solid #5f5c70" : "none"};
  padding: 10px 20px;
`;

export const OperateDealBgContainer = styled.div<{
  currencyOption: number;
}>`
  width: 54%;
  padding: 10px 20px;
  margin: 6px 0;
  display: flex;
  align-items: center;
  background-position: 0% 41%;
  background-repeat: no-repeat;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const OperateLeftButton = styled.div<{
  currencyOption: number;
  index: number;
}>`
  color: ${(props) => props.currencyOption === 0 ? COLORS.White : "#29A370"};
  margin-right: auto;
`;

export const OperateRightButton = styled.div<{
  currencyOption: number;
  index: number;
}>`
  color: ${(props) => props.currencyOption === 1 ? COLORS.White : "#d32f2f"};
`;


export const OperateUnitButton = styled.div<{ currencyOption: number; index: number }>`
  height: 100%;
  width: 88px;
  text-align: center;
  line-height: 2.3;
  color: #383743;
  border-top: ${(props) =>
    props.currencyOption === props.index ? "2px solid #5f5c70" : "none"};
`;
export const DrawerFullWarehouseTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const DrawerFullWarehouseImage = styled.img`
  width: 28px;
  height: 28px;
`;
export const DrawerFullWarehouseTitle = styled.p`
  flex: 1;
  height: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;
export const DrawerFullWarehouseSelectContainer = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
`;
export const DrawerFullWarehouseSelectButton = styled.button<{
  isChecked: any;
  type: any;
}>`
  display: flex;
  border: 1px solid
    ${(props) => (props.isChecked === props.type ? "#5f5c70" : "#DEDDE3")};
  width: 47%;
  height: 44px;
  border-radius: 4px;
  padding: 11px 16px;
  justify-content: space-between;
  background: #fff;
`;
export const DrawerFullWarehouseSelectTitle = styled.p<{
  isChecked: any;
  type: any;
}>`
  font-weight: 800;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) =>
    props.isChecked === props.type
      ? COLORS.Dark_gray
      : COLORS.Mid_gray};
`;
export const DrawerFullWarehouseContent = styled.p`
  width: 100%;
  height: 72px;
  background: ${COLORS.Primary_bg};
  padding: 16px;
  border-radius: 8px;
  color: #5f5c70;
  font-weight: 700;
  font-size: 13px;
  line-height: 20px;
`;
export const DrawerFullWarehouseContentTitle = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #d32f2f;
  margin-bottom: 14px;
`;
export const DrawerFullWarehouseContentDescription = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #5f5c70;
`;
export const DrawerFullWarehouseConfirm = styled.div`
  width: 100%;
  height: 44px;
  background: ${COLORS.Primary};
  border-radius: 4px;
  text-align: center;
  line-height: 44px;
  color: #fff;
`;
export const DrawerLeverButtonContainer = styled.div`
  width: 100%;
  height: 48px;
  background: rgb(244, 244, 246, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 4px;
`;
export const DrawerLeverButtonTitle = styled.p`
  width: 239px;
  height: 20px;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;
export const DrawerLeverButtonImg = styled.img`
  width: 28px;
  height: 28px;
`;
export const DrawerLeverSliderScale = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const DrawerLeverSliderScaleText = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #8f8da2;
  font-family:Open Sans;
`;
export const TradeFunctionLeftContainer = styled.div<{ orderTypeSelect: number }>`
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
`;
export const TradeFunctionLeftItem = styled.div`
  width: 100%;
  height: 36px;
  border-radius: 4px;
  padding: 10px 10px;
  background: #f4f4f6;
  color: ${COLORS.Mid_gray};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom:5px;
`;
export const CounterPriceItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// export const TradeFunctionCheckBoxContainer = styled.div`
//   width: 189px;
//   height: 20px;
//   display: flex;
//   color: #5f5c70;
//   font-weight: 500;
//   font-size: 14px;
//   align-items: center;
//   margin: 0 0 5px 0;
// `;

// export const TradeFunctionCheckBox = styled.div<{ check: boolean }>`
//   width: 15px;
//   height: 15px;
//   background-color: ${(props) => (props.check ? "#5F5C70" : "#fff")};
//   border: 1.5px solid #dedde3;
//   border-radius: 7.5px;
//   margin: 0 10.3px 0 4px;
// `;

// export const TradeFunctionCheckBoxLabel = styled.label`
//   color: #5f5c70;
//   font-weight: 500;
//   font-size: 14px;
//   line-height: 22px;
// `;

export const TradeFunctionDisplayContainer = styled.div`
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;
  color: #8f8da2;
  font-weight: 400;
`;

export const TradeFunctionDisplayItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TradeFunctionButtonContainer = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: space-between;
  color: #fff;
`;

export const TradeLeftFunctionButton = styled.div`
  width: 100%;
  height: 38px;
  text-align: center;
  background: ${COLORS.Primary};
  line-height: 38px;
  border-radius: 4px;
`;

export const WareHousedPriceInputContainer = styled.div<{ content: string }>`
  position: relative;
  width: 100%;
  &::after {
    content: "${(props) => props.content}";
    position: absolute;
    top: 6px;
    right: 0;
    color: #8f8da2;
    font-size: 16px;
    font-weight:500;
    font-family:Open Sans;
  }
`;

export const WareHousedPriceInput = styled.input<{ overprice: boolean }>`
  border: none;
  background: #f4f4f6;
  width: 75%;
  position: relative;
  color: ${(props) => (props.overprice ? COLORS.Red : "#8f8da2")};
  font-weight:500;
  font-family:Open Sans;
  &:focus {
    outline: none;
  }
`;

export const WareHousedCountInput = styled(FixedFloatInput)`
  border: none;
  background: #f4f4f6;
  width: 75%;
  position: relative;
  &:focus {
    outline: none;
  }
`;

export const WarehouseFunctionContainer = styled.div`
  width: 100%;
  padding: 0 16px 0 16px;
  display: flex;
  flex-direction: column;
  background: #fff;
  justify-content: space-between;
`;

export const WarehouseTransferContainer = styled.div`
 /* display: flex;
  justify-content: space-between; */
  width: 100%;
  height: 40px;
`;

// export const WarehouseCountIcon = styled.div`
//   width: 6px;
//   height: 14px;
//   margin-right: 6px;
//   background: #5f5c70;
//   border-radius: 3px;
// `;

// export const DealCardList = styled.div`
//   display: flex;
//   position:absolute;
//   margin-top:10px;
//   right:0;
//   margin-top:0px;
//   margin-right:10px;
// `;

// export const CommissionFunctionContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 0px;
// `;
// export const CommissionFunctionButton = styled.button<{
//   isSelected: number;
//   index: number;
// }>`
//   border: none;
//   background: ${(props) =>
//     props.isSelected === props.index ? "#5F5C70" : "rgb(244, 244, 246, 0.6)"};
//   border-radius: 16px;
//   padding: 4px 12px;
// `;
// export const CommissionFunctionButtonTitle = styled.p<{
//   isSelected: number;
//   index: number;
// }>`
//   font-size: 12px;
//   line-height: 18px;
//   text-align: center;
//   letter-spacing: 0.004em;
//   color: ${(props) =>
//     props.isSelected === props.index ? "#F4F4F6" : COLORS.Mid_gray};
// `;

export const ConfirmContainer = styled.div`
  width: 270px;
  height: 140px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  margin-bottom: 20%;
`;

export const ConfirmContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;

export const ConfirmContentTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #262626;
  margin: 0 0 8px 0;
`;

export const ConfirmContent = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #595959;
`;

export const ConfirmCheckbox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CheckboxCancel = styled.div`
  margin-top: 16px;
  width: 50%;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #8c8c8c;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
`;

export const CheckboxConfirm = styled.div`
  margin-top: 16px;
  width: 50%;
  padding: 12px 51px;
  border-top: 1px solid #d9d9d9;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #296df1;
`;

export const SwitchOrderBtn = styled(ResetBtn)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SwitchOrderImg = styled.img`
  width: 100%;
  height: 100%;
`;

export const DealPriceContainer = styled.div`
  width: 46%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const DealPriceLinesContainer = styled.div`
  width: 100%;
  flex: 1;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
`;

export const DealPriceLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
`;

export const DealPriceLinePrice = styled.p<{ type: string }>`
  color: ${p => p.type === 'red' ? COLORS.Red : COLORS.Primary}
  position: relative;
  z-index: 10;
  font-weight: 600;
  font-family: Open Sans;
`;

export const DealPriceLineQuantity = styled.p`
  color: ${COLORS.Gray}
  position: relative;
  z-index: 10;
  font-weight: 600;
  font-family: Open Sans;
`;

export const DealPriceLineProgress = styled.div<{ type: string }>`
  background-color: ${p => p.type === 'red' ? COLORS.Red : COLORS.Primary};
  height: 100%;
  position: absolute;
  right: 0;
  z-index: 0;
  opacity: 0.2
`;

export const DealPriceBlockContainer = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const DealPriceCurrentPrice = styled.p`
  font-size: 16px;
  color: ${COLORS.Red};
  font-weight: 700;
  line-height: 20px;
  margin-bottom: 5px;
  font-family: Open Sans;
`;

export const DealPriceRemarkPrice = styled.p`
  font-size: 12px;
  color: ${COLORS.Mid_gray};
  font-weight: 600;
  font-family: Open Sans;
`;

export const DealPriceFootContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-left: 16px;
  margin-top: 12px;
`;

// - SearchDeal =============================================
export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid ${COLORS.EXLight_gray};
  padding: 20px 12px 6px 16px;
  position: relative;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
`;
export const LinkText = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #383743;
`;
export const SelectIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 7px;
`;
export const SearchDealTitleContainer = styled.div`
  width: 100%;
  height: 44px;
  border-bottom: 0.5px solid ${COLORS.EXLight_gray};
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
`;
export const TitleButton = styled.div`
  width: 80px;
  height: 24px;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: ${COLORS.Mid_gray};
`;
export const CurrencyList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 12px;
  padding-bottom: 100px;
`;
export const CurrencyItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 16px;
  margin-bottom: 18px;
`;
export const ContractItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 18px;
  width: 30%;
`;
export const LatestItem = styled(Link)`
  font-weight: 600;
  font-size: 13px;
  color: ${COLORS.Gray};
  width: 20%;
  margin-right: 30px;
`;
export const RatioItem = styled(Link)<{ ratio: number }>`
  width: 15%;
  font-weight: 600;
  font-size: 13px;
  color: ${(props) =>
    props.ratio < 0 ? COLORS.Red : COLORS.Green};
  margin-right: 10px;
`;

export const AvailableTitle = styled.div`
  width: 30px;
  margin-right: 20px;
`;

export const AvailableContent = styled.div`
  flexGrow: 1;
  display: flex;
  align-items: center;
`;

