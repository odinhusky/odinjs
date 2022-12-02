// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// ^ Plugins
// import FixedFloatInput from "react-fixed-float-input";
import { Link } from "react-router-dom";

// = Styled Component
import styled from "styled-components";

import { ResetBtn } from '@/styled-components/index';

// - Orders start =========================

export const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const OrderHeadContainer = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
`;

export const OrderHeadActiveTag = styled.span`
  display: block;
  margin-right: 12px;
  color: ${COLORS.Dark_gray};
  font-size: 20px;
`;

export const OrderHeadIconBtn = styled(ResetBtn)<{ isOpen: boolean }>`
  display: block;
  width: 20px;
  height: 20px;
  color: ${COLORS.Dark_gray};
  font-size: 20px;
  transition: all 0.5s;
  transform: rotate(${p => p.isOpen ? `0deg` : `180deg`});
`;

export const SwitchCategoryItem = styled(Link)<{ active: boolean }>`
  width: 100%;
  padding: 20px 16px;
  font-size: 16px;
  color: ${p => p.active ? COLORS.Primary : COLORS.Mid_gray};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid ${COLORS.Light_gray};
`;

export const TitleContainer = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  padding: 25px 14px 10px 14px;
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

export const OperateButtonList = styled.div`
  height: 52px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background: #fff;
  font-weight: 500;
  font-size: 14px;
  color: #8f8da2;
  border-top: 1px solid ${COLORS.Primary}
`;

export const OperateCurrencyButton = styled.div<{
  currencyOption: number;
  index: number;
}>`
  display: inline-block;
  height: 100%;
  width: 100px;
  text-align: center;
  line-height: 53px;
  position: relative;
  &:before {
    content: "";
    height: ${props => (props.currencyOption === props.index ? "2px " : "0")};
    width: 55%;
    background-color: #5f5c70;
    position: absolute;
    bottom: 0;
    left: 20%;
    border-radius: 1px 1px 0 0;
  }
`;

// - FiatOrders start =========================
export const CurrencyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${COLORS.Primary};
`;
export const CurrencyTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16px 16px 0px 0px;
  border-bottom: 1px solid #f4f4f6;
`;
export const CurrencyTitleButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px 16px 0px 0px;
`;
export const CurrencyTitleButton = styled.div<{ status: string; detail: string }>`
  display: flex;
  align-items: center;
  height: 56px;
  background: #fff;
  color: ${props =>
    props.status === props.detail
      ? COLORS.Dark_gray
      : COLORS.Mid_gray};
  font-weight: 600;
  padding: 16px;
  border-radius: 16px 16px 0px 0px;
`;
export const CurrencyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 6px 16px 80px 16px;
`;
export const NoDealContainer = styled.div`
  height: 80vh;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

export const CurrencyListCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  background: #fff;
  padding: 6px;
`;

export const CurrencyListCardTitle = styled.div<{ index: number; isBuy: boolean }>`
  color: ${props => (props.isBuy ? "#D32F2F" : "#29A370")};
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.002em;
  font-weight: 700;
  font-family: Open Sans;
`;

export const CurrencyCardContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
export const CurrencyCardContentName = styled.div`
  display: flex;
  align-items: center;
`;
export const CurrencyCardKey = styled.p`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.004em;
  color: ${COLORS.Mid_gray};
`;
export const CurrencyCardKeyDescription = styled.p`
  font-size: 12px;
  font-weight: 700;
  line-height: 15px;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
  margin-left: 8px;
  font-family: Open Sans;
`;
export const CurrencyCardTotalAmount = styled.p`
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.002em;
  color: ${COLORS.Dark_gray};
  margin-left: 4px;
  font-family: Open Sans;
`;

export const CurrencyCardContentDescription = styled.div`
  display: flex;
  align-items: center;
`;

export const CardFooterPayStatusComplete = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Mid_gray};
`;

export const CardFooterPayTime = styled.p`
  flex: 1;
  margin-left: 8px;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${COLORS.Dark_gray};
`;

export const CardFooterButton = styled.button<{ status: number }>`
  height: 30px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.012em;
  color: ${props =>
    props.status === 0 ? COLORS.Text_white : COLORS.Gray};
  background: ${props =>
    props.status === 0 ? COLORS.Red : COLORS.EXLight_gray};
`;

export const CardSplit = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
  margin: 12px 0 19px 0;
`;

export const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;

export const DrawerTitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
`;

export const CancelIcon = styled.img`
  width: 28px;
  height: 28px;
`;

export const PayContentDesContainerItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PayContentItemName = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.004em;
  color: #5f5c70;
  display: flex;
  flex-direction: column;
`;

export const PayContentItemContent = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  letter-spacing: 0.004em;
  display: flex;
  align-items: flex-end;
`;

export const PayContentItemSplit = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.EXLight_gray};
  margin: 19px 0 16px 0;
`;

export const PayStatusText = styled.p`
  font-size: 15px;
  line-height: 24px;
  text-align: right;
  letter-spacing: 0.004em;
  color: ${COLORS.Dark_gray};
  font-weight: 500;
  font-family: Open Sans;
`;

export const NoItemIcon = styled.img`
  width: 130px;
  height: 135px;
  margin: 56px 0 24px 0;
`;

export const NoItemStatus = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.4px;
  color: ${COLORS.Dark_gray};
  margin-bottom: 8px;
`;

export const NoItemDes = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: ${COLORS.Light_gray};
  margin-bottom: 60px;
`;

export const PayConfirmButton = styled.button`
  border: none;
  width: 100%;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background: ${COLORS.Red};
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.012em;
  color: #fff;
  opacity: 1;
`;