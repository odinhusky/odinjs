import cx from '@commonUtils/cx';
import {
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import { useMemo } from 'react';

/**
 * 社交平台列表
 * @constructor
 */
export const SocialList = (props: {
  scenarios: SocialScenarios;
  className?: string;
  imgClassName?: string;
}) => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );
  const isClickable: boolean = props.scenarios === SocialScenarios.INVITE_PAGE;
  const socialList = useMemo(() => {
    return (
      usageScenariosList.find((item) => item.scenarios === props.scenarios)
        ?.socialList || []
    );
  }, [usageScenariosList]);

  return socialList.length > 0 ? (
    <div className={cx('flex justify-center gap-2', props.className)}>
      {socialList.map((item) => {
        return (
          <div
            key={`${props.scenarios} - ${item.label}`}
            className={cx(
              'flex justify-center items-center',
              isClickable ? 'cursor-pointer' : '',
              item.className
            )}
            onClick={isClickable ? item.onActionClick : undefined}
          >
            <img
              className={cx(
                'bgi-[var(--base-1-main)] rounded-full',
                'h-8 w-8 p-0.5',
                'object-contain',
                props.imgClassName
              )}
              src={item.icon}
              alt={item.icon}
            />
          </div>
        );
      })}
    </div>
  ) : null;
};
