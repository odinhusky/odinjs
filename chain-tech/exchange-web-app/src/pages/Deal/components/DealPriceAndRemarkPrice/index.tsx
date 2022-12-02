import React from 'react'

// = Styled Component
import {
  DealPriceBlockContainer,
  DealPriceCurrentPrice,
  DealPriceRemarkPrice
} from '@/styled-components/deal';

interface DealPriceAndRemarkPriceProps {
  price: string;
  remarkPrice: string;
}

export const  DealPriceAndRemarkPrice = ({
  price,
  remarkPrice
}: DealPriceAndRemarkPriceProps) => {
  return (
    <DealPriceBlockContainer>
      <DealPriceCurrentPrice>
        {
          (parseFloat(price) < 10 && parseFloat(price) > 1)
            ? price.slice(0, -3)
            : parseFloat(price) < 10
              ? price.slice(0, -2)
              : price.slice(0, -4)
        }
      </DealPriceCurrentPrice>

      <DealPriceRemarkPrice>
        {
          (parseFloat(remarkPrice) < 10 && parseFloat(remarkPrice) > 1)
            ? remarkPrice.slice(0, -3)
            : parseFloat(remarkPrice) < 10
              ? remarkPrice.slice(0, -2)
              : remarkPrice.slice(0, -4)
        }
      </DealPriceRemarkPrice>
    </DealPriceBlockContainer>
  )
}

export default DealPriceAndRemarkPrice;
