import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

export interface WithdrawBottomTipsProps {
  isShow: boolean;
  messages: string[];
  dismissCallback?: () => void;
}

const BOTTOM_TIPS_DISPLAY_DURATION = 3000;
export const WithdrawBottomTips = () => {
  const [isDisplay, setDisplay] = useState(false);
  const withdrawBottomTipsState = useWalletPageStore(
    (state) => state.withdrawBottomTipsState
  );

  useEffect(() => {
    if (withdrawBottomTipsState.isShow) {
      setDisplay(true);
      const timer = setTimeout(() => {
        // props.dismissCallback?.();
        // setDisplay(false);
      }, BOTTOM_TIPS_DISPLAY_DURATION); // 3 秒后隐藏
      return () => clearTimeout(timer);
    } else {
      setDisplay(false);
    }
  }, [withdrawBottomTipsState]);
  return (
    <AnimatePresence>
      {isDisplay && (
        <motion.div
          initial={{ y: 50, opacity: 0 }} // 初始状态：在底部 + 隐藏
          animate={{ y: 0, opacity: 1 }} // 动画到可见状态
          exit={{ y: 50, opacity: 0 }} // 退出动画：向下消失
          transition={{ duration: 0.12, ease: 'easeOut' }} // 动画时间
          className={cx(
            'w-screen',
            MOBILE_BREAK_POINT_MAX_WIDTH,
            '-mx-4 fixed bottom-0',
            'px-4 py-5',
            'bgi-[var(--state-error-variant1)]',
            'text-sm bgi-text-[var(--grayscale-100)] z-20'
          )}
        >
          {withdrawBottomTipsState.messages.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawBottomTips;
