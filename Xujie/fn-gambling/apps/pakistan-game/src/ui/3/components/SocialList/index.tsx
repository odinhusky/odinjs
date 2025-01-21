import cx from '@commonUtils/cx';
import {
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import { memo, useMemo } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

interface SocialIconProps {
  label: string;
  isClickable: boolean;
  className?: string;
  imgClassName?: string;
  onClick: () => void;
  icon: string;
}

const SocialIcon = memo((props: SocialIconProps) => {
  return (
    <div
      key={props.label}
      className={cx(
        'flex justify-center items-center',
        props.isClickable ? 'cursor-pointer' : '',
        props.className
      )}
      onClick={props.onClick}
    >
      <img
        className={cx(
          props.isClickable ? '' : 'bgi-[var(--base-1-main)] p-0.5',
          'rounded-full',
          'h-8 w-8 mobile:h-9 mobile:w-9',
          'object-contain',
          {
            'hover:brightness-[1.15] active:brightness-[0.85]':
              props.isClickable,
          },
          props.imgClassName
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
  imgClassName?: string;
}) => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );
  const isClickable: boolean = props.scenarios === SocialScenarios.INVITE_PAGE;

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
          icon: iconMapping[item.label] || item.icon,
        }))
      : list;
  }, [usageScenariosList, isClickable]);

  return socialList.length > 0 ? (
    <div className={cx('flex justify-center gap-2', props.className)}>
      {socialList.map((item) => {
        return (
          <SocialIcon
            key={`${item.label.toLowerCase()}_${item.icon}`}
            {...item}
            imgClassName={props.imgClassName}
            isClickable={isClickable}
            onClick={() => {
              if (isClickable) {
                item.onActionClick();
              }
            }}
          />
        );
      })}
    </div>
  ) : null;
};
