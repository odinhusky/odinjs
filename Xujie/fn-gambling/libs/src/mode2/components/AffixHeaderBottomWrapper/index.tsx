import { cx, useBreakPoint } from '@libs/commonUtils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { Affix } from 'antd';
import React, { ReactNode, useState } from 'react';

interface AffixHeaderBottomWrapperProps {
  notAffixContainerClass?: string;
  affixContainerClass?: string;
  rootClassName?: string;
  offsetTop?: number;
  offset?: number;
  onChange?: (affixed?: boolean) => void;
  children: ReactNode;
}

/**
 * @author Odin
 * @param {string} notAffixContainerClass - 當非浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} affixContainerClass - 當浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} rootClassName - Affix 元件的客製化樣式。
 * @param {number} offsetBottom - 直接給予 offsetBottom 的屬性，權重次高，跟 hasBottomNav 併用則此 prop 設定無效。
 * @param {number} offset - 可為正整數或負整數，用於調節細微無法計算的部分。
 * @param {Function} onChange -  Affix 元件的客製化方法。
 * @description //! 特別需要注意的是，在外部使用時，如果針對 children 有針對 y 軸的 margin(mt || my) 進行操作，則應該將該操作的樣式包在 AffixHeaderBottomWrapper 外層之容器，否則會造成浮動時的樣式不如預期，例如過高或是過低被 Header 擋住。
 * @example <div className={cx('mt-6')}>
 *  <AffixHeaderBottomWrapper>
 *    <BasePrimaryBtn
 *      className={cx(...)}
 *      children={'Test btn'}
 *    />
 *  </AffixBottomWrapper>
 * </div>
 */
export const AffixHeaderBottomWrapper = ({
  notAffixContainerClass = '',
  affixContainerClass = '',
  rootClassName: rootClassNameProps,
  offsetTop: offsetTopProps,
  offset = 0,
  onChange: onChangeProps,
  children,
}: AffixHeaderBottomWrapperProps) => {
  const { isMobile, isTablet } = useBreakPoint();

  const AffixWrapper = isMobile || isTablet ? Affix : React.Fragment;

  const [isAffixed, setIsAffixed] = useState(false);

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const offsetTop = offsetTopProps ? offsetTopProps : headerElMetrics.height;
  const rootClassName = rootClassNameProps ? rootClassNameProps : '';
  const onChange = onChangeProps instanceof Function ? onChangeProps : () => {};

  const shouldAffixBp = isMobile || isTablet;

  const givenProps = shouldAffixBp
    ? {
        offsetTop: offsetTop + offset,
        rootClassName,
        onChange: (affixed?: boolean) => {
          setIsAffixed(!!affixed);
          onChange(affixed);
        },
      }
    : {};

  return (
    <AffixWrapper {...givenProps}>
      <div
        className={cx({
          [affixContainerClass]: shouldAffixBp && isAffixed,
          [notAffixContainerClass]: !shouldAffixBp || !isAffixed,
        })}
      >
        {children}
      </div>
    </AffixWrapper>
  );
};

export default AffixHeaderBottomWrapper;
