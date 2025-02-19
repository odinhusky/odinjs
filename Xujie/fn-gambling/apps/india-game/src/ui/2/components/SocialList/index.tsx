import cx from '@commonUtils/cx';
import { FLEX_CENTER } from '@libs/constant/style';
import {
  SocialInfo,
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import { get } from 'lodash';
import { useMemo } from 'react';

/**
 * 社交平台列表
 * @constructor
 */
export const SocialList = (props: {
  scenarios: SocialScenarios;
  className?: string;
  iconOuterClassName?: string;
  iconClassName?: string;
  classNameLabel?: string;
  classNameUnit?: string;
  isShowLabelFromProps?: boolean;
  classNameUnitBox?: string;
  isShowLabel?: boolean; // 顯示文本
  children?: React.ReactNode; //
  extraList?: SocialInfo[];
}) => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );
  const isTeamClub = props.scenarios === SocialScenarios.TEAM_CLUB;

  const isClickable: boolean =
    props.scenarios === SocialScenarios.INVITE_PAGE || isTeamClub;

  const isShowLabel = isTeamClub
    ? true
    : get(props, 'isShowLabelFromProps', false);

  const socialList = useMemo(() => {
    return (
      usageScenariosList.find((item) => item.scenarios === props.scenarios)
        ?.socialList || []
    );
  }, [usageScenariosList]);

  return socialList.length > 0 ? (
    <div className={cx('flex justify-center gap-2', props?.className)}>
      {socialList.map((item) => {
        return (
          <div
            key={`${props.scenarios} - ${item.label}`}
            className={cx(
              FLEX_CENTER,
              {
                'flex-col flex-1 gap-1': isShowLabel,
              },
              isClickable ? 'cursor-pointer' : '',
              props?.classNameUnit
            )}
            onClick={isClickable ? item.onActionClick : undefined}
          >
            <div
              key={item.label}
              className={cx('flex justify-center items-center', item.className)}
            >
              <img
                className={cx(
                  'bgi-[var(--base-1-main)] rounded-full',
                  'h-8 w-8 p-0.5',
                  'object-contain'
                )}
                src={item.icon}
                alt={item.icon}
              />
            </div>

            {isShowLabel ? (
              <div
                className={cx(
                  'text-sm text-center',
                  'bgi-text-[var(--grayscale-100)]',
                  props?.classNameLabel
                )}
              >
                {item.label}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  ) : null;
};
