import cx from '@commonUtils/cx';
import {
  SocialInfo,
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { FLEX_CENTER } from '@libs/constant/style';

export enum SocialUnitImageType {
  ICON = 'icon',
  IMG = 'img',
}

/**
 * 社交平台列表[mode4]
 * @constructor
 */
export const SocialList = (props: {
  scenarios: SocialScenarios;
  className?: string;
  iconOuterClassName?: string;
  iconClassName?: string;
  classNameLabel?: string;
  classNameUnitBox?: string;
  classNameUnit?: string;
  isShowLabel?: boolean; // 顯示文本
  srcType?: SocialUnitImageType; // 圖片類型 [彩色 ｜ 透明染色的icon]
  children?: React.ReactNode; //
  extraList?: SocialInfo[];
}) => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );

  const socialList =
    usageScenariosList.find((item) => item.scenarios === props.scenarios)
      ?.socialList || [];

  const list = [...socialList, ...(props.extraList || [])];

  console.log('@@===> list', list);

  return list.length > 0 ? (
    <div className={cx('flex justify-center gap-2', props?.className)}>
      {list.map((item) => {
        return (
          <div className={cx(FLEX_CENTER, props?.classNameUnitBox)}>
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
                  src={
                    props.srcType === SocialUnitImageType.IMG
                      ? getImgUrl(EResourceLevel.ICONS, `${item.icon}_default`)
                      : item.icon
                  }
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
