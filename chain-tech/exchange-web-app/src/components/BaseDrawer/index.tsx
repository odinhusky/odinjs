import { ReactNode } from 'react';

// ? Self-packed Components || Functions
import { COLORS } from '@/constants/colors';
import { ResetBtn } from '@/styled-components';

// ^ Plugins
import { Drawer } from "antd";
import { CloseOutlined } from '@ant-design/icons';

// = Styled Component
import styled from 'styled-components';

const DrawerTitleBox = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const DrawerCloseBtn = styled(ResetBtn)`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const DrawerTitle = styled.div`
  width: calc(100% - 40px);
  font-size: 20px;
  font-weight: bold;
  color: ${COLORS.Black}
`;

const DrawerContentBox = styled.div`
  width: 100%;
`;


interface BaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: string | number;
  bodyStyle?: object | {};
  isShowTitleBox?: boolean;
  isShowCancel?: boolean;
  cancelIconStyle?: object | {};
  placement?: string | any;
}

/**
 * @author odin
 * @level components/BaseDrawer
 * @description 自製 Drawer，預設為下方往上
*/
export const BaseDrawer = ({
  isOpen,
  onClose,
  title = '',
  children,
  height = 378,
  bodyStyle = {},
  isShowTitleBox = true,
  isShowCancel = true,
  cancelIconStyle = {},
  placement = 'bottom'
}: BaseDrawerProps) => {

  // - methods
  const renderBorderRadius = (placement: string) => {
    switch(placement) {
      case 'top':
        return '0 0 16px 16px';
      case 'left':
        return '0 16px 16px 0';
      case 'right':
        return '16px 0 0 16px';
      case 'bottom':
        return '16px 16px 0 0';
    }
  };

  return (
    <Drawer
      placement={placement}
      onClose={onClose}
      visible={isOpen}
      closable={false}
      height={height}
      drawerStyle={{ background: "rgba(0, 0, 0, 0.45)" }}
      bodyStyle={{
        background: COLORS.White,
        borderRadius: renderBorderRadius(placement),
        ...bodyStyle
      }}
    >
      <>
        {
          isShowTitleBox && (
            <DrawerTitleBox>
              {/* 關閉按鈕 */}
              {
                isShowCancel && (
                  <DrawerCloseBtn type="button" onClick={onClose}>
                    <CloseOutlined style={{
                      fontSize: 20,
                      color: COLORS.Dark_gray,
                      ...cancelIconStyle
                    }} />
                  </DrawerCloseBtn>
                )
              }

              {/* 標題 */}
              <DrawerTitle>
                { title }
              </DrawerTitle>
            </DrawerTitleBox>
          )
        }

        <DrawerContentBox>
          {children}
        </DrawerContentBox>
      </>
    </Drawer>
  );
};

export default BaseDrawer;
