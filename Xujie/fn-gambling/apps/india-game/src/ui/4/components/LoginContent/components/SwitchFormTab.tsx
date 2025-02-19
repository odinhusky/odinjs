import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useIsShowLoginModalStore } from '@libs/mode2/zustand/loginStore';
import { Fragment } from 'react';

const SwitchFormTab = () => {
  const formTabs = useIsShowLoginModalStore((state) => state.formTabs);

  return (
    <div className={cx('mt-5', 'flex justify-between ')}>
      {formTabs.map((item, index) => {
        const isLastItem = index === formTabs.length - 1;
        return (
          <Fragment key={index}>
            <div
              className={cx(
                'text-sm flex-1 text-center cursor-pointer',
                'bgi-text-[var(--base-2-variant2)]'
              )}
              onClick={item.onAction}
            >
              <div>{item.label}</div>
            </div>

            {!isLastItem && (
              <img
                src={getImgUrl(EResourceLevel.ICONS, 'divider')}
                alt="separator"
                className="w-1.5 h-5"
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default SwitchFormTab;
