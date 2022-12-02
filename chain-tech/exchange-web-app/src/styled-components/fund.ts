import styled from "styled-components";
import { COLORS } from "@/constants/colors";

export const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Header = styled.div`
  padding: 16px 16px 16px 0px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
`;

export const HeaderButton = styled.button<{ isActive: boolean }>`
  border: none;
  background-color: white;
  color: ${p => p.isActive ? COLORS.Dark_gray : COLORS.Mid_gray};
  font-size: ${p => p.isActive ? '20px' : '16px'};
  font-weight: 600;
  font-family: PingFang TC;
`;

export const HeaderActiveButton = styled.button`
  border: none;
  background-color: white;
  color: ${COLORS.Dark_gray};
  font-size: 20px;
  font-weight: 600;
  font-family: PingFang TC;
`;

export const SpotContainer = styled.div`
  padding: 16px;
  margin-bottom: 8px;
`;
export const SpotContainerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  margin-top: -5px;
`;

export const TransferIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-top: -5px;
`;

export const SpotIconButton = styled.button`
  width: 40px;
  border: none;
  background-color: transparent;
  height: 30px;
  margin-top: -5px;
  display: flex;
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

export const LeftButton = styled.h2`
  width: 45%;
  height: 38px;
  border-radius: 4px;
  background-color: ${COLORS.EXLight_gray};
  color: ${COLORS.Gray};
  font-size: 14px;
  font-weight: 500;
  font-family: PingFang TC;
  text-align: center;
  line-height: 38px;
`;

export const RightButton = styled.h2`
  width: 45%;
  height: 38px;
  border-radius: 4px;
  background-color: ${COLORS.Primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family: PingFang TC;
  text-align: center;
  line-height: 38px;
  margin-left: 16px;
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
  border-bottom: 1px solid ${COLORS.EXLight_gray};
`;

export const CurrencyLeft = styled.div`
  display: flex;
`;

export const CurrencyRight = styled.div``;
export const Currency = styled.div`
  margin-left: 12px;
`;

export const CurrencyImg = styled.img`
  width: 30px;
  height: 30px;
`;

export const CurrencyTopText = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 15px;
  font-weight: 500;
  font-family: Open Sans;
`;

export const CurrencyBottomText = styled.h2`
  color: ${COLORS.Mid_gray};
  font-size: 12px;
  font-weight: 500;
  font-family: Open Sans;
  margin-top: 3px;
`;

export const PriceText = styled.h2`
  color: ${COLORS.Dark_gray};
  font-size: 16px;
  font-weight: 700;
`;

// =====================================
// ! 原本資金內容用到的 styled-component
// const TotalContainer = styled.div`
//   border-radius: 8px;
//   background-color: ${COLORS.Dark_gray};
//   height: 118px;
//   padding: 16px;
//   margin-bottom: 32px;
// `;
// const TotalContainerHeader = styled.div`
//   width: 100%;
// `;

// const TotalTitle = styled.h2`
//   color: white;
//   font-size: 15px;
//   font-weight: 400;
//   font-family: PingFang TC;
//   float: left;
// `;
// const TotalContent = styled.div`
//   margin-top: 40px;
// `;
// const TotalCurrency = styled.span`
//   color: white;
//   font-size: 13px;
//   font-weight: 600;
//   font-family: Open Sans;
//   margin-left: 5px;
// `;

// const TotalUSDTPrice = styled.h2`
//   color: white;
//   font-size: 24px;
//   font-weight: 700;
//   font-family: Open Sans;
//   margin-right: 5px;
// `;

// const TotalTWDPrice = styled.h2`
//   color: ${COLORS.Light_gray};
//   font-size: 13px;
//   font-weight: 600;
//   font-family: Open Sans;
//   margin-top: 5px;
// `;

// const DetailContainer = styled.div`
//   border-radius: 8px;
//   background-color: ${COLORS.EXLight_gray};
//   height: 118px;
//   padding: 16px;
//   margin-bottom: 16px;
// `;
// const DetailContainerHeader = styled.div`
//   width: 100%;
// `;

// const DetailTitle = styled.h2`
//   color: ${COLORS.Dark_gray};
//   font-size: 15px;
//   font-weight: 400;
//   font-family: PingFang TC;
//   float: left;
// `;

// const DetailContent = styled.div`
//   margin-top: 40px;
// `;
// const DetailCurrency = styled.span`
//   color: ${COLORS.Dark_gray};
//   font-size: 13px;
//   font-weight: 600;
//   font-family: Open Sans;
//   margin-left: 5px;
// `;

// const DetailUSDTPrice = styled.h2`
//   color: ${COLORS.Dark_gray};
//   font-size: 24px;
//   font-weight: 700;
//   font-family: SF Pro Display;
//   margin-right: 5px;
//   font-family:Open Sans;
// `;

// const DetailTWDPrice = styled.h2`
//   color: ${COLORS.Mid_gray};
//   font-size: 13px;
//   font-weight: 600;
//   font-family: Open Sans;
//   margin-top: 5px;
// `;

// const NextButton = styled.button`
//   width: 30px;
//   height: 30px;
//   float: right;
//   margin-top: -5px;
//   border: none;
//   background-color: transparent;
//   margin-right: 5px;
// `;

// const NextIcon = styled.img`
//   width: 24px;
//   height: 30px;
// `;