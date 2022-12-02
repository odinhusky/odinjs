import React, {  } from 'react';

// % context
import { useGlobalCtx } from '@/components/Layout/GlobalContext';

// ^ Plugins
import { useTranslation } from "react-i18next";
import { RightOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

// = Styled Component
import {
  SpotContainer,
  SpotContainerHeader,
  SpotTitle,
  SpotContent,
  SpotCurrency,
  SpotUSDTPrice,
  SpotTWDPrice,
  Line,
  CurrencyContainer,
  CurrencyLeft,
  CurrencyRight,
  CurrencyTopText,
  PriceText
} from '@/styled-components/fund';

interface FundContentProps {
  total: number;
  setType: Function;
}

export const FundContent = ({ total, setType }: FundContentProps) => {

  // $ init data
  const { t } = useTranslation();
  const list = [
    // 現貨
    {
      key: 0,
      type: 1, // type 是指父層 Component 控制的 state 對應的值
      title: t('fundSpot')
    },
    // 合約
    {
      key: 1,
      type: 2,
      title: t('futuresList')
    },
    // 法幣
    {
      key: 2,
      type: 3,
      title: t('fundFiat')
    },
  ]

  // % context
  const { nowRate, currencyUnit } = useGlobalCtx();

  return (
    <>
      <SpotContainer>
        <SpotContainerHeader>
          <SpotTitle>{t("fundTotal")}</SpotTitle>
        </SpotContainerHeader>

        <SpotContent>
          <SpotUSDTPrice>
            {total}
            <SpotCurrency>USDT</SpotCurrency>
          </SpotUSDTPrice>

          <SpotTWDPrice>
            ≈ {total * nowRate} {currencyUnit}
          </SpotTWDPrice>
        </SpotContent>
      </SpotContainer>

      {/* 分隔線 */}
      <Line></Line>

      {/* 內容 */}
      <div>
        {
          isEmpty(list) ? (
            <CurrencyContainer>
              <CurrencyLeft>
                <CurrencyTopText>{ t('noData') }</CurrencyTopText>
              </CurrencyLeft>
            </CurrencyContainer>
          ) : (
            list.map(item => (
              <CurrencyContainer key={item.key} onClick={() => {
                setType(item.type);
              }}>
                <CurrencyLeft>
                  <CurrencyTopText>{ item.title }</CurrencyTopText>
                </CurrencyLeft>
                <CurrencyRight>
                  <PriceText>
                    <RightOutlined />
                  </PriceText>
                </CurrencyRight>
              </CurrencyContainer>
            ))
          )
        }
      </div>
    </>
  )
}

export default FundContent
