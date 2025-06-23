import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import useSurpriseRewardModalStore from '@mode2/zustand/modal/SurpriseRewardModal';
import BaseModal from '@libs/components/Modal';
import { cx } from '@libs/commonUtils';
import { useSurpriseRewardModalBase } from '@mode2/usecase/modal/useSurpriseRewardModalBase';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import { useSurpriseRewardModalActions } from '@mode2/action/model/SurpriseRewardModalAction/useSurpriseRewardModalActions';
import { handleSurpriseRewardModalBtnClickAction } from '@mode2/action/actionTypes';

export const SurpriseRewardModal = () => {
  useSurpriseRewardModalBase();

  const { handleSurpriseRewardModalClick } = useSurpriseRewardModalActions();

  const isShowSurpriseRewardModal = useSurpriseRewardModalStore(
    (state) => state.isShowSurpriseRewardModal
  );
  return isShowSurpriseRewardModal ? (
    <BaseModal
      // onClick={() => {
      //   handleSurpriseRewardModalClick({
      //     actionName: handleSurpriseRewardModalCloseClickAction,
      //   });
      // }}
      className="!bgi-[var(--transparent-gray-90)]"
    >
      <BaseCacheImg
        className={cx('w-96 cursor-pointer')}
        src={getImgUrl(EResourceLevel.POPUP_BANNER, 'popup_surprise_reward')}
        imgName="popup_surprise_reward"
        alt={'popup_surprise_reward'}
        onClick={() => {
          handleSurpriseRewardModalClick({
            actionName: handleSurpriseRewardModalBtnClickAction,
          });
        }}
        onLoad={() => {}}
        onError={(e) => {}}
      />
    </BaseModal>
  ) : null;
};

export default SurpriseRewardModal;
