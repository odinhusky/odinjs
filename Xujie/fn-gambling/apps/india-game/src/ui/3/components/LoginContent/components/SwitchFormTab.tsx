import { cx } from '@libs/commonUtils';
import { useIsShowLoginModalStore } from '@libs/mode2/zustand/loginStore';

const SwitchFormTab = () => {
  const formTabs = useIsShowLoginModalStore((state) => state.formTabs);

  return (
    <div
      className={cx(
        'text-xs mobile:text-sm font-medium mb-4',
        'flex justify-between rounded bgi-text-[var(--grayscale-70)] bgi-[var(--transparent-white-10)]'
      )}
    >
      {formTabs.map((item, index) => {
        return (
          <div
            key={index}
            className={cx(
              'py-1 mobile:py-2 box-border flex-1 text-center rounded cursor-pointer',
              {
                'bgi-text-[var(--grayscale-100)] bgi-[var(--base-1-main)]':
                  item.active,
              }
            )}
            onClick={item.onAction}
          >
            <div>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SwitchFormTab;
