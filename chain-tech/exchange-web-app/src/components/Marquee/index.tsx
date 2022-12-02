import React, { useState, useEffect } from 'react';

// ? Self-packed Components || Functions
import { COLORS } from '@/constants/colors';

// ^ Plugins
import { isEmpty, cloneDeep } from 'lodash';
import { SoundOutlined } from '@ant-design/icons';

// = Styled Component
import styled from "styled-components";

const MarqueeRoot = styled.div`
  width: 100%;
  height: 40px;
  background-color: transparent;
  display: flex;
  align-items: center;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
`;

const MarqueeIconBox = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const MarqueeItemsBox = styled.div`
  width: calc(100% - 24px);
  position: relative;
  bottom: 0px;
  transition: bottom 0.5s linear;
`;

const MarqueeItem = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 2px 10px;
  color: ${COLORS.Black};
  font-size: 14px;
`;

interface MarqueeItemInterFace {
  text: string;
  key: number;
}

interface MarqueeProps {
  data: Array<MarqueeItemInterFace> | any;
  duration?: string;
  delay?: number;
  height?: number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
}

/**
 * @author odin
 * @level Marquee
 * @description 首頁文字的跑馬燈
*/
export const Marquee = ({ data, duration, delay }: MarqueeProps) => {

  // $ init data
  const defaultHeight = 40;
  const defaultDelay = 2000;
  const lastHeightNumber = (data.length * defaultHeight) - defaultHeight;
  const defaultData = [
    {
      key: 0,
      text: 'test1'
    },
    {
      key: 1,
      text: 'test2'
    }
  ];

  // # states
  const [bottomValue, setBottomValue] = useState<number>(0);
  const [showData, setShowData] = useState<Array<MarqueeProps> | any>();

  // * hooks
  useEffect(() => {
    setShowData(cloneDeep(data));
  }, [data]);


  useEffect(() => {
    const delayMiliSecs = delay ? delay : defaultDelay;
    const x = setInterval(() => {
      setBottomValue((prev: number) => {
        const v = lastHeightNumber === prev ? 0 : prev + defaultHeight;

        return v;
      })

    }, delayMiliSecs);

    return function cleanup () { clearInterval(x); }
  }, [delay, lastHeightNumber]);

  return (

    <MarqueeRoot>
      <MarqueeIconBox>
        <SoundOutlined style={{ color: COLORS.Black, fontSize: 16 }} />
      </MarqueeIconBox>

      <MarqueeContainer>
        <MarqueeItemsBox
          style={{
            bottom: bottomValue,
            transitionDuration: duration ? `${duration}s` : '0.3s'
          }}
        >
        {
          !isEmpty(showData) ? (
            showData.map(item => (
              <MarqueeItem key={item.key} children={item.text} />
            ))
          ) : (
            defaultData.map(item => (
              <MarqueeItem key={item.key} children={item.text} />
            ))
          )
        }
        </MarqueeItemsBox>
      </MarqueeContainer>
    </MarqueeRoot>
  )
}

export default Marquee;
