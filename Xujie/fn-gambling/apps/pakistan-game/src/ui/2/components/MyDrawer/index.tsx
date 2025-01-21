import Drawer from '@mode2/components/Drawer';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useBreakPoint } from '@libs/commonUtils';
import useTemplateLayoutActions from '@mode2/action/templateLayoutAction/useTemplateLayoutActions';
import { handleTemplateLayoutCloseMyDrawerBtnClick } from '@mode2/action/templateLayoutAction/acitonType';
import MyPage from '@pages/MyPage';
import Icon from '@libs/mode2/components/Icon';

export const MyDrawer = () => {
  const { isMobile } = useBreakPoint();
  const openMyDrawer = useMyPageStore((state) => state.openMyDrawer);
  const { handleTemplateLayoutClick } = useTemplateLayoutActions();

  const isOpen = openMyDrawer && !isMobile;

  const onClose = () => {
    handleTemplateLayoutClick({
      actionName: handleTemplateLayoutCloseMyDrawerBtnClick,
    });
  };
  return (
    <Drawer
      closable={false}
      open={isOpen}
      onClose={onClose}
      maskClosable
      placement="right"
      getContainer={false}
      width={360}
      bodyStyle={{ padding: 0 }}
      rootStyle={{ outline: 'none' }}
      className="!bgi-[var(--bg-main)] px-6 py-10 relative"
    >
      <div
        className="absolute left-3 top-3 w-6 h-6 cursor-pointer"
        onClick={onClose}
      >
        <Icon className="w-full" name="ic_close" />
      </div>
      <MyPage />
    </Drawer>
  );
};
