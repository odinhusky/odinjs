import React from 'react';

// ? Self-packed Components || Functions
// import { COLORS } from '@/constants/colors';

// = Styled Component
import {
  DealPriceLinesContainer,
  DealPriceLine,
  DealPriceLinePrice,
  DealPriceLineQuantity,
  DealPriceLineProgress
} from '@/styled-components/deal';

interface DealPriceAsksProps {
  asksArray: Array<string[]> | any;
}

export const  DealPriceAsks = ({ asksArray }: DealPriceAsksProps) => {
  return (
    <DealPriceLinesContainer>
      {asksArray.map((e: string, i) => {
        return (
          <DealPriceLine
            key={i.toString()}
          >
            {/* 價格 */}
            <DealPriceLinePrice type="red">
              {
                (parseFloat(e[0]) < 10 && parseFloat(e[0]) > 1)
                  ? e[0].slice(0, -5)
                  : parseFloat(e[0]) < 10
                    ? e[0].slice(0, -4)
                    : e[0].slice(0, -6)
              }
            </DealPriceLinePrice>

            {/* 數量 */}
            <DealPriceLineQuantity>
              {e[1].slice(0, -5)}
            </DealPriceLineQuantity>

            {/* 背景進度條 */}
            <DealPriceLineProgress
              type="red"
              style={{
                width: `${parseInt((parseFloat(e[0].slice(0, 2) + e[0].slice(2, -9)) * parseFloat(e[1].slice(0, -5)) + 20).toString().slice(-2))}%`,
              }}
            />
          </DealPriceLine>
        );
      })}
    </DealPriceLinesContainer>
  )
}

export default DealPriceAsks;
