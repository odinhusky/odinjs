import React, {
  useState,
  useMemo
} from 'react';

// ? Self-packed Components || Functions
// import { COLORS } from '@/constants/colors';
import { BaseDrawer } from '@/components/BaseDrawer';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

// = Styled Component

import {
  OrderHeadContainer,
  OrderHeadActiveTag,
  OrderHeadIconBtn,
  SwitchCategoryItem
} from '@/styled-components/order';

interface OrderHeadProps {
  activeTagIdx: number
}

/**
 * @author odin
 * @level Layout/Order | FiatOrder/OrderHead
 * @description 訂單頁面的最上方區塊
*/
export const OrderHead = ({ activeTagIdx }: OrderHeadProps) => {

  // $ init data
  const { t } = useTranslation();

  // # state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // & handled data
  const category: Object = useMemo(() => ([
    {
      key: 0,
      text: t('tradeFutures'),
      link: '/orders'
    },
    {
      key: 1,
      text: t('orderFiat'),
      link: '/fiat-orders'
    }
  ]), [t]);


  return (
    <>
      {/* 最上方的內容 */}
      <OrderHeadContainer onClick={() => { setIsOpen(true) }}>
        <OrderHeadActiveTag>
          { category[activeTagIdx].text }
        </OrderHeadActiveTag>

        <OrderHeadIconBtn
          isOpen={isOpen}
          children={<DownOutlined />}
        />
      </OrderHeadContainer>

      {/* 選擇類別用的 Drawer */}
      <BaseDrawer
        isOpen={isOpen}
        onClose={() => { setIsOpen(false) }}
        isShowTitleBox={false}
        height={114}
        bodyStyle={{ padding: 0 }}
      >
        {
          !isEmpty(category) && (
            Object.entries({ ...category }).map(([idx, { key, text, link }]: any) => (
              <SwitchCategoryItem
                key={key}
                children={text}
                active={key === activeTagIdx}
                to={link}
              />
            ))
          )
        }
      </BaseDrawer>

    </>
  )
}

export default OrderHead;
