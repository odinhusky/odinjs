import cx from '@commonUtils/cx';
import { useSocialListStore } from '@mode2/zustand/components/socialListStore';
import { EResourceLevel, getIconName, getImgUrl } from '@mode2/utils';
import { FLEX_CENTER } from '@libs/constant/style';
import SocialListProps from '../SocialListProps';
import { SocialUnitImageType } from '@mode2/zustand/components/socialListStore';

/**
 * 社交平台列表[mode4]
 * @constructor
 */
export const SocialList = (props: SocialListProps) => {
  const { srcType = SocialUnitImageType.FILL } = props;
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );

  const socialList =
    usageScenariosList.find((item) => item.scenarios === props.scenarios)
      ?.socialList || [];

  const list = [...socialList, ...(props.extraList || [])];

  return list.length > 0 ? (
    <div className={cx('flex justify-center gap-2', props?.className)}>
      {list.map((item, index) => {
        const iconName = getIconName(item.icon);

        return (
          <div
            key={`SocialListItem - ${item.icon} - ${item.className} - ${item.label} - ${index}`}
            className={cx(FLEX_CENTER, props?.classNameUnitBox)}
          >
            <div
              key={`${props.scenarios} - ${item.label}`}
              className={cx(FLEX_CENTER, props?.classNameUnit)}
              onClick={() => {
                item.onActionClick && item.onActionClick();
              }}
            >
              <div className={cx(props.iconOuterClassName)}>
                <img
                  className={cx(
                    'rounded-full',
                    'h-8 w-8 mobile:h-9 mobile:w-9',
                    'object-contain',
                    props.iconClassName
                  )}
                  src={getImgUrl(
                    EResourceLevel.ICONS,
                    `${iconName}_${srcType}`
                  )}
                  alt={item.icon}
                />
              </div>

              {props.isShowLabel ? (
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

            {props.children ? props.children : null}
          </div>
        );
      })}
    </div>
  ) : null;
};
