import { cx, useBreakPoint } from '@libs/commonUtils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { Affix } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';

interface AffixHeaderBottomWrapperProps {
  notAffixContainerClass?: string;
  affixContainerClass?: string;
  rootClassName?: string;
  offsetTop?: number;
  offset?: number;
  onChange?: (affixed?: boolean) => void;
  children: ReactNode;
  isAllBpAffix?: boolean;
}

/**
 * @author Odin
 * @param {string} notAffixContainerClass - 當非浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} affixContainerClass - 當浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} rootClassName - Affix 元件的客製化樣式。
 * @param {number} offsetBottom - 直接給予 offsetBottom 的屬性，權重次高，跟 hasBottomNav 併用則此 prop 設定無效。
 * @param {number} offset - 可為正整數或負整數，用於調節細微無法計算的部分。
 * @param {Function} onChange -  Affix 元件的客製化方法。
 * @param {boolean} isAllBpAffix -  是否所斷點都需要 affix
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
  isAllBpAffix = false,
  children,
}: AffixHeaderBottomWrapperProps) => {
  const { isMobile, isTablet } = useBreakPoint();
  const isDefaultBreakPoint = isMobile || isTablet;

  const [isAffixed, setIsAffixed] = useState(false);

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const offsetTop = offsetTopProps ? offsetTopProps : headerElMetrics.height;
  const rootClassName = rootClassNameProps ? rootClassNameProps : '';
  const onChange = onChangeProps instanceof Function ? onChangeProps : () => {};

  const shouldAffixBp = isAllBpAffix ? true : isDefaultBreakPoint;

  const AffixWrapper =
    isAllBpAffix || isDefaultBreakPoint ? Affix : React.Fragment;

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

  // 監聽 Resize 變化，重新取得當下內容的寬高
  const [affixKey, setAffixKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setAffixKey((prevKey) => prevKey + 1); // 重新渲染 Affix
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AffixWrapper key={affixKey} {...givenProps}>
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
