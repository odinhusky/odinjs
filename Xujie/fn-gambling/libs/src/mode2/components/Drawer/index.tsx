import { Drawer, DrawerProps } from 'antd';
import React, { useEffect } from 'react';

const ModeDrawer = (props: DrawerProps) => {
  useEffect(() => {
    if (props.open) {
      document.querySelector('body')?.classList.add('overflow-hidden');
    } else {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    }
    return () => {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    };
  }, [props.open]);

  return props.open ? (
    <Drawer
      closable={false}
      rootClassName={'fixed'}
      maskClosable
      getContainer={false}
      bodyStyle={{ padding: 0 }}
      rootStyle={{ outline: 'none' }}
      {...props}
    >
      {props.children}
    </Drawer>
  ) : null;
};
export default ModeDrawer;
