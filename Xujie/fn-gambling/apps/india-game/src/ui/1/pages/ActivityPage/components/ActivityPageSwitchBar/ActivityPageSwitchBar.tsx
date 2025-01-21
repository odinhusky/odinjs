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
        'w-[344px]',
        'flex',
        'rounded',
        'cursor-pointer',
        'mt-5 mb-auto mx-auto',
        'bgi-[var(--grayscale-20)]'
      )}
    >
      {switchList.map((item) => {
        return (
          <div
            key={item.id}
            className={cx('flex-[0.5]', FLEX_CENTER, 'px-6 py-2', {
              'rounded bgi-[var(--base-1-main)]': item.isActive,
            })}
            onClick={() => {
              item.action();
            }}
          >
            <div
              className={cx('font-semibold', 'text-lg leading-6', {
                'bgi-text-[var(--grayscale-70)]': !item.isActive,
                'bgi-text-[var(--grayscale-100)]': item.isActive,
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
