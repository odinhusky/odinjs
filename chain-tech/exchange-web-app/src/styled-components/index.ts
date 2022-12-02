import styled from "styled-components";
import { COLORS } from "@/constants/colors";

export const FlexAlignCenterDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const FlexDirectionRowDiv = styled.div`
  display: flex;
  flex-direction: roe;
`;

export const CtrlBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 10px;
`;

export const CtrlBarBtn = styled.button<{ active: boolean }>`
  border: none;
  background-color: ${COLORS.White};
  color: ${p => (
    p.active ? COLORS.Dark_gray : COLORS.Mid_gray)};
  font-size: ${p => (
    p.active ? `20px` : `16px`)};
  font-weight: 600;
  font-family: PingFang TC;
`;

export const DealList = styled.div`
  overflow: scroll;
`;

export const DealTitle = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${COLORS.Mid_gray};
  font-size: 12px;
  font-weight: 500;
  padding: 10px 12px;
`;

export const DealFavBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
  border: none;
  background-color: transparent;
`;

export const DealListItem = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  color: ${COLORS.Dark_gray};
`;

export const DealLastValue = styled.p`
  fontWeight: 600;
  fontFamily: "Open Sans";
`;

export const DealName = styled.p`
  fontWeight: 600;
  fontSize: 15px;
  fontFamily: "Open Sans";
`;

export const DealOrderUnit = styled.p`
  fontWeight: 500;
  fontSize: 12px;
  color: ${COLORS.Mid_gray};
  marginTop: 3px;
  marginLeft: 4px;
  fontFamily: ${COLORS.Mid_gray};
`;

export const DealRatio = styled.div<{ change: number }>`
  width: 82px;
  height: 30px;
  border-radius: 4px;
  background-color: ${props => (props.change < 0 ? COLORS.Red : COLORS.Green)};
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  line-height: 29px;
  text-align: center;
  font-family: Open Sans;
`;

// ^ Reset Series
export const ResetBtn = styled.button`
  border-radius: 0px;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
`;
