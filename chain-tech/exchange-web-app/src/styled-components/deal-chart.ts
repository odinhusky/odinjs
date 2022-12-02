// ? Self-packed Components || Functions
// import { COLORS } from "@/export constants/colors";

// = Styled Component
import styled from "styled-components";

export const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
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

export const ChartContainer = styled.div`
  height: 532px;
  width: 100%;
`;

export const DealListContainer = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 10px;
  padding: 16px;
  background: #fff;
`;

export const DealListTitle = styled.div`
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

export const DealList = styled.div`
  width: 100%;
  height: 33px;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

export const CurrencyListTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
`;

export const DealItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const DealItem = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #5f5c70;
  font-family:Open Sans;
`;

export const DepthTitle = styled.div`
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
`;

export const DepthItem = styled.div<{ isSelect: number; index: number }>`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #f4f4f6;
  height: 55px;
  line-height: 55px;
  color: ${(props) => (props.isSelect === props.index ? "#D32F2F" : "#000")};
`;

export const CancelButton = styled.div`
  width: 100%;
  background: #f4f4f6;
  text-align: center;
  height: 44px;
  line-height: 44px;
  border-radius: 4px;
  font-weight: 500;
`;