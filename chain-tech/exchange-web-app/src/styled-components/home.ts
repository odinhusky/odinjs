// ? Self-packed Components || Functions
import { COLORS } from '@/constants/colors';

// ^ Plugins
import { Carousel } from 'antd';

// = Styled Component
import styled from "styled-components";

export const PageContainer = styled.div`
  height: 700px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-bottom: 70px;
  @media (min-width: 1200px) {
    margin-top: 0px;
  }
`;
export const Banner = styled.div`
  display: none;
  @media (min-width: 1200px) {
    display: block;
    width: 100%;
    height: 294px;
    background: #4f4f4f;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  padding: 0 16px;
  margin-top: 24px;
  @media (min-width: 1200px) {
    display: none;
  }
`;

/* list style start */
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ListButton = styled.button<{ currentList: number; listNum: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  background-color: ${props =>
    props.currentList === props.listNum ? COLORS.Black : COLORS.White};
  border-radius: 16px;
  color: ${props =>
    props.currentList === props.listNum ? COLORS.White : COLORS.Black};
  font-size: 14px;
  padding: 5px 12px;
  border: none;
  font-weight: 500;
  font-family: Open Sans;
`;

export const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  /* height: 250px; */
`;

export const ListContentTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #8f8da2;
  font-size: 12px;
  font-weight: 500;
  margin-top: 16px;
`;

export const ItemContainer = styled.div`
  /* height: 200px; */
  overflow: scroll;
`;

export const ListItem = styled.li`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 0;
  color: #383743;
`;

export const ItemPair = styled.div`
  display: flex;
  align-content: center;
`;

export const ItemRatio = styled.div<{ change: number }>`
  width: 82px;
  height: 30px;
  border-radius: 4px;
  background-color: ${props => (props.change < 0 ? "#d32f2f" : "#29A370")};
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  line-height: 29px;
  text-align: center;
  font-family: Open Sans;
`;

export const ItemDeal = styled.div`
  width: 82px;
  height: 30px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  line-height: 29px;
  text-align: right;
`;

/* list style end */
/* desktop thw newest info style start */
export const NewestContainer = styled.div`
  display: none;
  @media (min-width: 1200px) {
    width: 100%;
    flex: 1;
    background: "#ddd";
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const NewestCard = styled.div`
  width: 557px;
  height: 210px;
  box-shadow: 0px 2px 24px rgba(0, 0, 0, 0.07);
  margin: 0 15px;
  border-radius: 3px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const NewestText = styled.p`
  font-weight: 500;
  text-align: center;
`;

export const ContinueReadText = styled.p`
  font-weight: 500;
  text-align: right;
  font-size: 14px;
  width: 100%;
`;

export const IconBtn = styled.button<{ idx: number }>`
  font-weight: 500;
  text-align: right;
  width: calc((100% - 60px) / 4);
  border: none;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${props => props.idx % 4 === 0 ? '0px' : '20px'};
`;

export const IconBtnImg = styled.img`
  width: 50px;
  height: 50px;
`;

export const IconBtnText = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 12px;
  color: ${COLORS.Black};
  margin-top: 4px;
  text-align: center;
`;

export const TradePairContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 16px;
  font-family: Open Sans;
`;

export const TradePairUnit = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TradePairName = styled.p`
  color: ${COLORS.Black};
  font-size: 13px;
  font-weight: 600;
`;

export const TradePairPercentage = styled.p<{ isPlus: boolean }>`
  color: ${p => p.isPlus ? COLORS.Green : COLORS.Red};
  font-size: 13px;
  margin-top: 5px;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const TradePairCurrencyToUsd = styled.p<{ isPlus: boolean }>`
  color: ${p => p.isPlus ? COLORS.Green : COLORS.Red};
  font-size: 20px;
  font-weight: 700;
`;

export const TradePairCurrencyFiatRate = styled.p`
  color: ${COLORS.Mid_gray};
  margin-top: 8px;
  font-size: 14px;
`;

export const HomeCarousel = styled(Carousel)`
  & img {
    border-radius: 8px;
  }
`;