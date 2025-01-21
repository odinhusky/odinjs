import {
  slideBothPageLeft,
  slideBothPageRight,
  slideLeft,
  slideRight,
} from '@libs/constant/frameMotion';
import { BasePagePathOrders } from '@libs/mode2/routerTypes/types';
import { FunctionComponent, Suspense, useRef } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { AuthRouter } from './AuthRouter';
import TemplateLayout from '@templates/TemplateLayout';

export const Layout: FunctionComponent<{
  component: FunctionComponent;
  hasTemp?: boolean;
}> = ({ component: Component, hasTemp = true }) => {
  const location = useLocation();

  const previousPathRef = useRef<string | null>(null); // 记录上一个路径
  const previousPath = previousPathRef.current;
  previousPathRef.current = location.pathname;

  // 确定当前路径和之前路径的索引
  const currentIndex = BasePagePathOrders.indexOf(location.pathname);
  const previousIndex = previousPath
    ? BasePagePathOrders.indexOf(previousPath)
    : -1;

  console.log('!! currentIndex', currentIndex);
  console.log('!! previousIndex', previousIndex);

  const isGoingForward = currentIndex > previousIndex; // 判断是否前进

  // const slideDirection =
  //   currentIndex === 0 || previousIndex === 0
  //     ? isGoingForward
  //       ? slideBothPageLeft
  //       : slideBothPageRight
  //     : isGoingForward
  //     ? slideLeft
  //     : slideRight;

  const slideDirection =
    currentIndex === 0 || previousIndex === 0
      ? currentIndex === 0
        ? {
            initial: { x: '-100%', opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: '100%', opacity: 0 },
          }
        : {
            initial: { x: '100%', opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: '-100%', opacity: 0 },
          }
      : isGoingForward
      ? {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0 },
        }
      : {
          initial: { x: '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 },
        };
  console.log('!! location.pathname', location.pathname);
  console.log('!! previousPath', previousPath);
  console.log('!! slideDirection', slideDirection);

  return (
    // <Suspense fallback={<Loading />}>

    <Suspense
      fallback={<div className={'h-full w-full bgi-[var(--bg-main)]'} />}
    >
      <MotionConfig transition={{ duration: 0.5 }}>
        <AnimatePresence mode="wait" initial={false}>
          <AuthRouter key={location.pathname}>
            {hasTemp ? (
              <TemplateLayout>
                <motion.div key={location.pathname} {...slideDirection}>
                  <Component />
                </motion.div>
              </TemplateLayout>
            ) : (
              <motion.div key={location.pathname} {...slideDirection}>
                <Component />
              </motion.div>
            )}
          </AuthRouter>
        </AnimatePresence>
      </MotionConfig>
    </Suspense>
  );
};
