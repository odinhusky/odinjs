import { IBackBtn } from './types';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';

const BackBtn = (props: IBackBtn) => {
  const { onClick, title, mTitle, className } = props;
  const { isDesktop } = useBreakPoint();
  return (
    <div>
      {isDesktop ? (
        <button
          className={cx('backBtn', FLEX_ITEMS_CENTER, 'gap-2', 'z-[1]')}
          onClick={() => {
            if (onClick) {
              onClick();
            } else {
              // TODO 返回
            }
          }}
        >
          <Icon name="ic_arrow_left_1" />
          <span
            className={cx(
              'backBtnTxt',
              'text-xl leading-7',
              'font-medium text-left',
              'bgi-text-[var(--grayscale-100)]',
              className
            )}
          >
            {title}
          </span>
        </button>
      ) : (
        <div
          className={cx(
            'm-backBtn',
            'flex justify-between',
            'bgi-[var(--grayscale-00)]',
            'fixed tpo-[3%] left-0 right-0 z-[1]',
            'py-2 px-6'
          )}
        >
          <button
            className={cx(
              'back-btn',
              'flex gap-2',
              'bgi-text-[var(--base-2-main)]'
            )}
            onClick={() => {
              if (onClick) {
                onClick();
              } else {
                // TODO 返回
              }
            }}
          >
            <div className={cx('w-5 h-5 mobile:w-6 mobile:h-6')}>
              <Icon
                name="ic_arrow_left_1"
                className={cx('w-full h-full')}
                color="var(--base-2-main)"
              />
            </div>
            <div>{mTitle}</div>
          </button>
          <button
            onClick={() => {
              // TODO 返回主页
            }}
          >
            <Icon name="icon_home" color="var(--base-2-main)" />
          </button>
        </div>
      )}
    </div>
  );
};
export default BackBtn;
