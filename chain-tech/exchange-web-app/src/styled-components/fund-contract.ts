import styled from "styled-components";
import { COLORS } from "@/constants/colors";

export const Container = styled.div``;

export const SpotContainer = styled.div`
  height: 118px;
  padding: 16px;
  margin-bottom: 8px;
`;
export const SpotContainerHeader = styled.div`
  width: 100%;
`;

export const SpotTitle = styled.h2`
  color: ${COLORS.Gray};
  font-size: 15px;
  font-weight: 400;
  font-family: PingFang TC;
  float: left;
`;
export const FundIcon = styled.img`
  width: 30px;
  height: 30px;
  float: right;
  margin-top: -5px;
`;

export const SpotContent = styled.div`
  margin-top: 40px;
`;
export const SpotCurrency = styled.span`
  color: ${COLORS.Dark_gray};
  font-size: 13px;
  font-weight: 600;
  font-family: Open Sans;
  margin-left: 5px;
`;

export const SpotUSDTPrice = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 24px;
  font-weight: 700;
  font-family: Open Sans;
  margin-right: 5px;
`;

export const SpotTWDPrice = styled.h2`
  color: ${COLORS.Mid_gray};
  font-size: 13px;
  font-weight: 600;
  font-family: Open Sans;
  margin-top: 5px;
`;

export const RightButton = styled.h2`
  width: 100%;
  height: 38px;
  border-radius: 4px;
  background-color: ${COLORS.Primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family: PingFang TC;
  text-align: center;
  line-height: 38px;
  margin-top: 8px;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 16px 16px;
`;

export const Line = styled.div`
  height: 8px;
  background-color: ${COLORS.EXLight_gray};
`;

export const CurrencyContainer = styled.div`
  width: 100%;
  height: 73px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid ${COLORS.EXLight_gray};
`;

export const CurrencyLeft = styled.div`
  display: flex;
`;

export const CurrencyRight = styled.div``;
export const Currency = styled.div`
  margin-left: 12px;
`;

export const CurrencyTopText = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 16px;
  font-weight: 700;
`;

export const CurrencyBottomText = styled.h2`
  color: ${COLORS.Mid_gray};
  font-size: 12px;
  font-weight: 500;
  margin-top: 3px;
  font-family: Open Sans;
`;

export const PriceText = styled.h2`
  color: ${COLORS.Gray};
  font-size: 15px;
  font-weight: 400;
`;

export const CurrencyText = styled.span`
  color: ${COLORS.Dark_gray};
  font-size: 12px;
  font-weight: 600;
  font-family: Open Sans;
`;
export const SpotIconButton = styled.button`
  width: 40px;
  border: none;
  background-color: transparent;
  height: 30px;
  float: right;
  margin-top: -5px;
`;