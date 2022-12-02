// ? Self-packed Components || Functions
import { COLORS } from "@/constants/colors";

// ^ Plugins
// import FixedFloatInput from "react-fixed-float-input";
import { Link } from "react-router-dom";

// = Styled Component
import styled from "styled-components";

// import { ResetBtn } from '@/styled-components/index';

export const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &[type="checkbox"] {
    -webkit-appearance: none;
    ~ label {
      display: inline-block;
      font-weight: normal;
      margin: 0;
    }
  }
`;

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