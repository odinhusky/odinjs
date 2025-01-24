import { useBreakPoint } from '@libs/commonUtils';
import {
  BasePagePathObj,
  BasePagePathOrders,
  BasePagePaths,
} from '@libs/mode2/routerTypes/types';
import { ReactNode, memo, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { isEqual } from 'lodash';

interface TemplatePageContentProps {
  children?: ReactNode;
}

const BLACK_LIST_PATH_NAMES: BasePagePaths[] = [
  BasePagePathObj.GamePage,
  BasePagePathObj.GameLobbyPage,
];

export const TemplatePageContent = memo(
  ({ children }: TemplatePageContentProps) => {
    const location = useLocation();
    const { isDesktop } = useBreakPoint();
    const [direction, setDirection] = useState(0);
    const [prevPath, setPrevPath] = useState(location.pathname);
    const prevPathRef = useRef<string>(location.pathname);

    useEffect(() => {
      const prevPathHere = prevPathRef.current;
      setPrevPath(prevPathHere);

      const currentIndex =
        BasePagePathOrders.indexOf(location.pathname) === -1
          ? -2
          : BasePagePathOrders.indexOf(location.pathname);

      const previousIndex = prevPath
        ? BasePagePathOrders.indexOf(prevPathHere)
        : 0;

      // 計算出方向
      const calculatedDirection =
        currentIndex === previousIndex
          ? 0
          : currentIndex > previousIndex
          ? 1
          : -1;

      setDirection(calculatedDirection);

      // 更新 上一個路徑是誰
      prevPathRef.current = location.pathname;
    }, [location.pathname]);

    // 是否要啟動動畫
    const isActiveShiftPageAnimation =
      !isDesktop &&
      !BLACK_LIST_PATH_NAMES.includes(location.pathname as BasePagePaths);

    return (
      <div className={'m-auto max-w-[1240px] px-4 mobile:px-5 overflow-hidden'}>
        {/* <div className="text-white">direction: {direction}</div> */}
        {children ? (
          <AnimatePresence initial={false} custom={direction}>
            {isActiveShiftPageAnimation ? (
              <>
                <motion.div
                  key={`${location.pathname} ${direction}`}
                  variants={{
                    initial: () => {
                      // console.log('!! direction x=>', direction);
                      return {
                        x: direction > 0 ? '100%' : '-100%',
                        opacity: 0,
                      };
                    },
                    animate: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        x: { duration: 0.3, ease: 'easeInOut' },
                        opacity: { duration: 0.3, ease: 'easeInOut' },
                      },
                    },
                    exit: () => {
                      return {
                        x: direction > 0 ? '-100%' : '100%',
                        opacity: 0,
                      };
                    },
                  }}
                  animate="animate"
                  initial="initial"
                  exit="exit"
                  custom={direction}
                >
                  {children}
                </motion.div>
              </>
            ) : (
              <div>{children}</div>
            )}
          </AnimatePresence>
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default TemplatePageContent;
