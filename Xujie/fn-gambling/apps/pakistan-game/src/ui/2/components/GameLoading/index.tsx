import { FLEX_CENTER, FLEX_JUSTIFY_CENTER } from '@libs/constant/style';
import './index.scss';
import Modal from '@libs/mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useGameLoadingStore } from '@libs/mode2/zustand/components/gameLoadingStore';
import { cx } from '@libs/commonUtils';

/**
 * 游戏页面-加载页
 * @returns
 */
export const GameLoading = () => {
  const isShowGameLoading = useGameLoadingStore(
    (state) => state.isShowGameLoading
  );
  return isShowGameLoading ? (
    <Modal className={cx('bgi-[var(--bg-main)]', FLEX_CENTER)}>
      <div>
        <div>
          <img
            className="tablet:w-[275px] mobile:w-[205px] w-[123px]"
            src={getImgUrl(EResourceLevel.LOGO, 'game_logo_1')}
            alt="logo"
          />
        </div>
        <div className="flex mobile:mt-3 mt-2 justify-center">
          <div
            className={cx('w-[100px] h-10', FLEX_JUSTIFY_CENTER, 'items-end')}
          >
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
};
