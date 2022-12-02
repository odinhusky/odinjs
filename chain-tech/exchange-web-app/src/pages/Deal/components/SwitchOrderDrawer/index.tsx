
import React from 'react';

// ? Self-packed Components || Functions
import { COLORS } from '@/constants/colors';
import { BaseDrawer } from '@/components/BaseDrawer';

// ^ Plugins
import { isEmpty } from 'lodash';

// = Styled Component
import styled from 'styled-components';

const SwitchOrderItem = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 20px 16px;
  font-size: 16px;
  color: ${p => p.active ? COLORS.Primary : COLORS.Mid_gray};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid ${COLORS.Light_gray};
`;

interface SwitchOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  status: number;
  handleSwitchOrder: (status: number) => void;
}

/**
 * @author odin
 * @level Deal/SwitchOrderDrawer
 * @description 改變交易對顯示的 Drawer
*/
export const SwitchOrderDrawer = ({
  isOpen,
  onClose,
  status,
  handleSwitchOrder
}: SwitchOrderDrawerProps) => {

  // $ init data
  const options = [
    {
      key: 0,
      text: 'Default'
    },
    {
      key: 1,
      text: 'Buy Order'
    },
    {
      key: 2,
      text: 'Sell Order'
    }
  ];

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      isShowTitleBox={false}
      height={171}
      bodyStyle={{
        padding: 0
      }}
    >
      {
        !isEmpty(options) && (
          options.map(item => (
            <SwitchOrderItem
              key={item.key}
              children={item.text}
              active={item.key === status}
              onClick={() => {
                handleSwitchOrder(item.key);
              }}
            />
          ))
        )
      }
    </BaseDrawer>
  );
};

export default SwitchOrderDrawer;
