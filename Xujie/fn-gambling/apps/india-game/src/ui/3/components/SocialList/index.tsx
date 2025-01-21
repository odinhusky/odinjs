import cx from '@commonUtils/cx';
import {
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import { memo, useMemo } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { get } from 'lodash';
import { FLEX_CENTER } from '@libs/constant/style';

interface SocialIconProps {
  label: string;
  isClickable: boolean;
  className?: string;
  iconClassName?: string;
  // onClick: () => void;
  icon: string;
}

const SocialIcon = memo((props: SocialIconProps) => {
  return (
    <div
      key={props.label}
      className={cx('flex justify-center items-center', props.className)}
    >
      <img
        className={cx(
          props.isClickable ? '' : 'bgi-[var(--base-1-main)] p-0.5',
          'rounded-full',
          'h-8 w-8 mobile:h-9 mobile:w-9',
          'object-contain',
          props.iconClassName
        )}
        src={
          props.isClickable
            ? getImgUrl(EResourceLevel.V, `${props.icon}_default`)
            : props.icon
        }
        alt={props.icon}
      />
    </div>
  );
});
/**
 * 社交平台列表[mode3]
 * @constructor
 */
export const SocialList = (props: {
  scenarios: SocialScenarios;
  className?: string;
  iconClassName?: string;
  classNameLabel?: string;
  classNameUnit?: string;
  isShowLabelFromProps?: boolean;
}) => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );

  const isTeamClub = props.scenarios === SocialScenarios.TEAM_CLUB;
  const isShare = props.scenarios === SocialScenarios.SHARE;

  const isClickable: boolean =
    props.scenarios === SocialScenarios.INVITE_PAGE || isTeamClub || isShare;

  const isShowLabel =
    isTeamClub || isShare ? true : get(props, 'isShowLabelFromProps', false);

  const iconMapping: Record<string, string> = {
    telegram: 'fab_telegram',
    instagram: 'fab_instagram',
    youtube: 'fab_youtube',
    whatsapp: 'fab_whatsapp',
    facebook: 'fab_facebook',
    tiktok: 'fab_tiktok',
    twitter: 'fab_twitter',
  };

  const socialList = useMemo(() => {
    const list =
      usageScenariosList.find((item) => item.scenarios === props.scenarios)
        ?.socialList || [];
    return isClickable
      ? list.map((item) => ({
          ...item,
          icon: iconMapping[item.label.toLowerCase()] || item.icon,
        }))
      : list;
  }, [usageScenariosList, isClickable]);

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
                'hover:brightness-[1.15] active:brightness-[0.85] cursor-pointer':
                  isClickable,
              },
              props?.classNameUnit
            )}
            onClick={() => {
              if (isClickable) {
                item.onActionClick();
              }
            }}
          >
            <SocialIcon
              key={`${item.label.toLowerCase()}_${item.icon}`}
              {...item}
              isClickable={isClickable}
              iconClassName={props.iconClassName}
            />

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
