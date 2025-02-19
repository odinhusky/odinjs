import { FLEX_CENTER, FLEX_JUSTIFY_CENTER } from '@libs/constant/style';
import Modal from '@libs/mode2/components/Modal';
import { useGameLoadingStore } from '@libs/mode2/zustand/components/gameLoadingStore';
import { cx } from '@libs/commonUtils';

/**
 * 游戏页面-加载页
 * @returns
 */
export const GameLoading = () => {
  const barClassName = 'w-2 h-16 rounded-[2px] animate-loadingWave';
  const loadingBars = [
    '[animation-delay:0.1s] bgi-[#F22610]',
    '[animation-delay:0.2s] bgi-[#F24E12]',
    '[animation-delay:0.3s] bgi-[#F36914]',
    '[animation-delay:0.4s] bgi-[#F48C17]',
    '[animation-delay:0.3s] bgi-[#F6AF1A]',
  ];

  const isShowGameLoading = useGameLoadingStore(
    (state) => state.isShowGameLoading
  );
  return isShowGameLoading ? (
    <Modal className={cx('bgi-[var(--bg-main)]', FLEX_CENTER)}>
      <div className="flex justify-center items-center">
        <div
          className={cx(
            'w-auto h-auto',
            FLEX_JUSTIFY_CENTER,
            'items-center gap-1.5'
          )}
        >
          <div className={cx(barClassName, loadingBars[0])} />
          <div className={cx(barClassName, loadingBars[1])} />
          <div className={cx(barClassName, loadingBars[2])} />
          <div className={cx(barClassName, loadingBars[3])} />
          <div className={cx(barClassName, loadingBars[4])} />
          <div className={cx(barClassName, loadingBars[3])} />
          <div className={cx(barClassName, loadingBars[2])} />
          <div className={cx(barClassName, loadingBars[1])} />
          <div className={cx(barClassName, loadingBars[0])} />
        </div>
      </div>
    </Modal>
  ) : null;
};
