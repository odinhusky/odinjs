import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER } from '@libs/constant/style';
import { useMode2ActivitySwitchPageStore } from '@mode2/zustand/page/activityPageStore';
import { useTranslation } from 'react-i18next';

export const ActivityPageSwitchBar = () => {
  const switchList = useMode2ActivitySwitchPageStore(
    (state) => state.switchList
  );
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'w-[344px] p-1',
        'flex',
        'rounded-lg',
        'cursor-pointer',
        'mt-2 mobile:mt-5 mb-auto mx-auto',
        'bgi-[var(--grayscale-10)]'
      )}
    >
      {switchList.map((item) => {
        return (
          <div
            key={item.id}
            className={cx('flex-[0.5] py-2', FLEX_CENTER, {
              'rounded-lg bgi-[var(--grayscale-00)] bg-shadow-[var(--drop-shadow)]':
                item.isActive,
            })}
            onClick={() => {
              item.action();
            }}
          >
            <div
              className={cx('text-base mobile:text-lg font-semibold', {
                'bgi-text-[var(--grayscale-50)]': !item.isActive,
                'bgi-text-[var(--base-1-main)]': item.isActive,
              })}
            >
              {renderI18N(item.i18n, t)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityPageSwitchBar;
