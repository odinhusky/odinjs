import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import { environment } from "apps/gambling/src/environments/environment";
import { VIPInfoTabListUnitType } from "../../types";
import { useEffect, useRef, useState } from "react";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";

interface VIPGradeTabsProps {
  selected: number,
  vipInfoTabList: VIPInfoTabListUnitType[];
  handleSelected: (value:number | '+' | '-') => void;
}
export const VIPGradeTabs = ({
  selected,
  vipInfoTabList,
  handleSelected
}: VIPGradeTabsProps) => {

  const {isMobile, isTablet, isDesktop} = useBreakpoint();

  const targetRef = useRef<HTMLDivElement>(null);

  const [isAtTop, setIsAtTop] = useState(true);
  const [firstTop, setFirstTop] = useState(0);
  const [currentTop, setCurrentTop] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const result = entry.isIntersecting;
        // console.log('@@ odin',  entry, result)

        setIsAtTop(!result);

        if(result === false && (firstTop > currentTop) === true) {
          setIsAtTop(true);
        } else {
          setIsAtTop(false);
        }
      },
      {
        root: null, // 默认是浏览器视窗
        rootMargin: '-80px',
        threshold: [0], // 当元素的任何部分进入视窗时触发
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // 清除观察
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [firstTop, currentTop]);

  const handleScroll = () => {
    if(targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      console.log('@@ ===> rect.top', rect.top);
      if(rect.top > firstTop) setFirstTop(rect.top);
      setCurrentTop(rect.top);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  const tabContainerClass = cx(
    FLEX_CENTER,
    'gap-2'
  );

  const tabClass = (index: number) => (cx(
    'w-1/4 h-[104px]',
    'px-4 py-[2px]',
    'relative',
    'flex gap-1 items-end justify-center',
    'bg-[var(--grayscale-20)]',
    'text-[var(--grayscale-80)] text-center',
    'cursor-pointer',
    'rounded-t-2xl',
    'hover:bg-[var(--grayscale-50)] hover:text-white',
    'active:bg-gradient-to-b active:from-[#28C5F9] active:to-[var(#1850B3)] active:border-b-[5px] active:text-white border-[var(--grayscale-70)]',
    {
      'bg-linear-1-main border-b-[3px] mobile:border-b-[5px] text-white border-[var(--grayscale-70)]': index === selected,
      'hidden': isMobile,
      'flex w-full': isMobile && index === selected,
      'h-[80px] p-1': isTablet,
      'h-[88px]': isMobile
    }
  ));

  const titleClass = cx(
    'w-full h-[48px]',
    'font-medium text-base',
    'flex items-center justify-center',
    {
      'text-sm': isTablet,
      'w-3/4': isMobile
    }
  );

  const imgBtnClass = cx(
    'block',
    'w-[24px]',
    'absolute bottom-[13px]'
  );

  return (
    <>
      <div
        ref={targetRef}
        className={cx(
          tabContainerClass,
          'mt-[48px]'
        )}
      >
        {
          vipInfoTabList.map((item, index) => (
            <div
              className={cx(
                tabClass(index)
              )}
              onClick={() => {
                if(!isMobile) handleSelected(index);
              }}
            >
              {/* 上方的 icon */}
              <img
                alt={item.title}
                className={cx(
                  'block',
                  'h-[80px]',
                  'absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2',
                  {
                    'h-[64px]': isTablet || isMobile,
                  }
                )}
                src={item.iconSrc}
              />

              {/* 左邊的按鈕 */}
              {
                isMobile ? (
                  <img
                    className={cx(
                      imgBtnClass,
                      'left-[13px]'
                    )}
                    alt='Previous button image'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_left_arrow.png`}
                    onClick={()=> handleSelected('-')}
                  />
                ) : null
              }
              
              {/* 右邊的按鈕 */}
              {
                isMobile ? (
                  <img
                    className={cx(
                      imgBtnClass,
                      'right-[13px]'
                    )}
                    alt='Next button image'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_right_arrow.png`}
                    onClick={()=> handleSelected('+')}
                  />
                ) : null
              }

              <div 
                className={cx(titleClass)}
              >
                {item.title}
              </div>
            </div>
          ))
        }
      </div>

      {/* 往下滑的時候出現 */}
      <div
        className={cx(
          tabContainerClass,
          'fixed top-[64px] left-[50%] -translate-x-1/2 z-[5]',
          {
            'hidden': !isAtTop || (isDesktop || isTablet),
          }
        )}
        style={{
          width: 'calc(100% - 32px)'
        }}
      >
        {
          vipInfoTabList.map((item, index) => (
            <div
              className={cx(
                tabClass(index),
                'h-[auto]',
                'rounded-none'
              )}
              onClick={() => {
                if(!isMobile) handleSelected(index);
              }}
            >

              {/* 左邊的按鈕 */}
              {
                isMobile ? (
                  <img
                    className={cx(
                      imgBtnClass,
                      'left-[13px]'
                    )}
                    alt='Previous button image'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_left_arrow.png`}
                    onClick={()=> handleSelected('-')}
                  />
                ) : null
              }
              
              {/* 右邊的按鈕 */}
              {
                isMobile ? (
                  <img
                    className={cx(
                      imgBtnClass,
                      'right-[13px]'
                    )}
                    alt='Next button image'
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_right_arrow.png`}
                    onClick={()=> handleSelected('+')}
                  />
                ) : null
              }

              <div 
                className={cx(titleClass)}
              >
                {item.title}
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default VIPGradeTabs;