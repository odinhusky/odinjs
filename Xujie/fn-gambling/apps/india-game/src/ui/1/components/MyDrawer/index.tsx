import './index.scss';
import Drawer from '@mode2/components/Drawer';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { cx, useBreakPoint } from '@libs/commonUtils';
import useTemplateLayoutActions from '@mode2/action/templateLayoutAction/useTemplateLayoutActions';
import { handleTemplateLayoutCloseMyDrawerBtnClick } from '@mode2/action/templateLayoutAction/acitonType';
import MyPage from '@pages/MyPage';
import { useEffect, useState } from 'react';

export const MyDrawer = () => {
  const { isMobile } = useBreakPoint();
  const openMyDrawer = useMyPageStore((state) => state.openMyDrawer);
  const { handleTemplateLayoutClick } = useTemplateLayoutActions();

  const [animOut, setAnimOut] = useState('');
  const [openEnd, setOpenEnd] = useState(false);
  const [paddingTop, setPaddingTop] = useState(0);

  const isOpen = openMyDrawer && !isMobile;

  const onClose = () => {
    setAnimOut('animate__animated animate__slideOutRight animate__faster');
  };

  useEffect(() => {
    const animatedBox = document.getElementById('animatedBox');

    const handleAnimationEnd = () => {
      setAnimOut('');
      setOpenEnd(false);
      handleTemplateLayoutClick({
        actionName: handleTemplateLayoutCloseMyDrawerBtnClick,
      });
    };

    if (animatedBox) {
      animatedBox.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      if (animatedBox) {
        animatedBox.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [animOut]);

  useEffect(() => {
    const headerEl = document.getElementsByTagName('header')[0];
    if (headerEl) {
      const rect = headerEl.getBoundingClientRect();
      setPaddingTop(rect.top + headerEl.clientHeight);
    }
  }, [isOpen]);

  return (
    <Drawer
      id="animatedBox"
      closable={false}
      open={isOpen}
      onClose={onClose}
      maskClosable
      placement="right"
      getContainer={false}
      width={360}
      bodyStyle={{ padding: '0' }}
      rootStyle={{ outline: 'none' }}
      className={cx(
        '!bgi-[var(--bg-main)] p-6 !overflow-visible shadow-[-4px_0px_8px_0px_#00000040]',
        animOut
      )}
      afterOpenChange={() => {
        setOpenEnd(true);
      }}
      styles={{
        mask: {
          opacity: 0,
        },
        content: {
          height: `calc(100% - ${paddingTop}px)`,
          position: 'inherit',
          bottom: '0',
        },
      }}
    >
      <div
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
        onClick={onClose}
      >
        <img
          className="w-full"
          src={getImgUrl(
            EResourceLevel.V,
            openEnd ? 'icon_float_close' : 'icon_float_open'
          )}
        />
      </div>
      <MyPage />
    </Drawer>
  );
};
