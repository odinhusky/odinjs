import { cx, useBreakPoint } from '@libs/commonUtils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { Affix } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDeviceStore } from '@mode2/zustand/deviceStore';

interface AffixBottomWrapperProps {
  affixContainerClass?: string;
  notAffixContainerClass?: string;
  rootClassName?: string;
  hasBottomNav?: boolean;
  offsetBottom?: number;
  offset?: number;
  onChange?: (affixed?: boolean) => void;
  children: ReactNode;
}
/**
 * @author Odin
 * @param {string} affixContainerClass - 當浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} notAffixContainerClass - 當非浮動起來的時候，該 children 外層的 container 會吃到的 className。
 * @param {string} rootClassName - Affix 元件的客製化樣式。
 * @param {boolean} hasBottomNav - 是否有 bottomNavigation，有的話會去取得目前 bottomNavigation 得高度，權重最高。
 * @param {number} offsetBottom - 直接給予 offsetBottom 的屬性，權重次高，跟 hasBottomNav 併用則此 prop 設定無效。
 * @param {number} offset - 可為正整數或負整數，用於調節細微無法計算的部分。
 * @param {Function} onChange -  Affix 元件的客製化方法。
 * @description //! 特別需要注意的是，在外部使用時，如果針對 children 有針對 y 軸的 margin(mt || mb || my) 進行操作，則應該將該操作的樣式包在 AffixBottomWrapper 外層之容器，否則會造成浮動時的樣式不如預期，例如過高或是過低被 bottomNavigation 擋住。
 * @example <div className={cx('mt-6')}>
 *  <AffixBottomWrapper hasBottomNav>
 *    <BasePrimaryBtn
 *      className={cx(...)}
 *      children={'Test btn'}
 *    />
 *  </AffixBottomWrapper>
 * </div>
 */
export const AffixBottomWrapper = ({
  affixContainerClass = '',
  notAffixContainerClass = '',
  rootClassName: rootClassNameProps,
  hasBottomNav = false,
  offsetBottom: offsetBottomProps,
  offset = 0,
  onChange: onChangeProps,
  children,
}: AffixBottomWrapperProps) => {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const [isAffixed, setIsAffixed] = useState(false);

  const AffixWrapper = isMobile ? Affix : React.Fragment;

  const offsetBottom = hasBottomNav
    ? bottomNavigationElMetrics.height
    : offsetBottomProps
    ? offsetBottomProps
    : 0;

  const rootClassName = cx(
    '!h-auto',
    rootClassNameProps ? rootClassNameProps : ''
  );

  const onChange: (affixed?: boolean) => void =
    onChangeProps instanceof Function ? onChangeProps : () => {};

  const givenProps = isMobile
    ? {
        offsetBottom: offsetBottom + offset,
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
          [affixContainerClass]: isMobile && isAffixed,
          [notAffixContainerClass]: !isMobile || !isAffixed,
        })}
      >
        {children}
      </div>
    </AffixWrapper>
  );
};

export default AffixBottomWrapper;
