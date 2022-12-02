import React from 'react';

// ? Self-packed Components || Functions
import { switchOrderSrc } from '@/pages/Deal/constant';

// = Styled Component
import {
  SwitchOrderBtn,
  SwitchOrderImg,
  DealPriceFootContainer
} from '@/styled-components/deal';

interface DealPriceFootProps {
  switchStatus: number;
  setIsOpenOrderDrawer: Function;
}

export const  DealPriceFoot = ({
  switchStatus,
  setIsOpenOrderDrawer
}: DealPriceFootProps) => {

  return (
    <DealPriceFootContainer>
      <SwitchOrderBtn
        onClick={() => { setIsOpenOrderDrawer(true); }}
      >
        <SwitchOrderImg src={switchOrderSrc[switchStatus]} />
      </SwitchOrderBtn>
    </DealPriceFootContainer>
  )
}

export default DealPriceFoot;
