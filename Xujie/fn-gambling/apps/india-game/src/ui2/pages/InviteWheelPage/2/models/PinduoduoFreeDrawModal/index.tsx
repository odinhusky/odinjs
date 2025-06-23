import { cx } from '@libs/commonUtils';
import Modal from '@libs/mode2/components/Modal';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useState } from 'react';
import { usePinduoduoFreeDrawModalStore } from '@libs/mode2/zustand/components/pinduoduoFreeDrawModalStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';
import usePinduoduoFreeDrawModalBase from '@mode2/usecase/modal/pinduoduoFreeDrawModal/usePinduoduoFreeDrawModalBase';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';

const RewardBoxOpenContent = () => {
  const isRewardGetSuccess = usePinduoduoFreeDrawModalStore(
    (state) => state.isRewardGetSuccess
  );
  const rewardNum = usePinduoduoFreeDrawModalStore((state) => state.rewardNum);

  return isRewardGetSuccess === 1 ? (
    <div
      className={cx(
        'absolute w-[100vw] h-[100vh] bgi-[var(--transparent-gray-60)] backdrop-blur',
        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'animate__animated animate__fadeIn animate__faster'
      )}
    >
      <img
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto m-auto w-full max-w-[600px]"
        src={getImgUrl(EResourceLevel.V, 'cash_everyday_background_2_m')}
        alt=""
      />

      <div
        className={
          'absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2'
        }
      >
        <AnimationFlipNumbers
          height={64}
          numbers={`${formatMoney({
            value: rewardNum,
            includeDecimal: true,
            showCurrency: false,
          })}`}
        />
      </div>
      {/*<RewardNumber num={rewardNum} />*/}
    </div>
  ) : null;
};

export const PinduoduoFreeDrawModal = () => {
  usePinduoduoFreeDrawModalBase();
  const boxStyle = 'max-w-[120px] max-h-[120px]';
  const { t } = useTranslation();
  const [fingerIndex, setFingerIndex] = useState(0); //是否第一次进入
  const [intervalTime, setIntervalTime] = useState(1000); //倒计时

  const modalAnim = usePinduoduoFreeDrawModalStore((state) => state.modalAnim);
  const setModalAnim = usePinduoduoFreeDrawModalStore(
    (state) => state.setModalAnim
  );
  const setParticipateNumber = usePinduoduoFreeDrawModalStore(
    (state) => state.setParticipateNumber
  );
  const isRewardGetSuccess = usePinduoduoFreeDrawModalStore(
    (state) => state.isRewardGetSuccess
  );

  const pinduoduoFreeDrawModalVisible = usePinduoduoFreeDrawModalStore(
    (state) => state.pinduoduoFreeDrawModalVisible
  );

  const resetState = usePinduoduoFreeDrawModalStore(
    (state) => state.resetState
  );

  const selectBoxIndex = usePinduoduoFreeDrawModalStore(
    (state) => state.selectBoxIndex
  );
  const setSelectBoxIndex = usePinduoduoFreeDrawModalStore(
    (state) => state.setSelectBoxIndex
  );

  // 开启盒子
  const openBox = (index: number) => {
    setParticipateNumber();
    setSelectBoxIndex(index);
  };

  useEffect(() => {
    if (isRewardGetSuccess === 1) {
      setFingerIndex(0);
      setTimeout(() => {
        setTimeout(() => {
          setModalAnim('animate__animated animate__fadeOut animate__faster');
        }, 3000);
      }, 100);
    }
  }, [isRewardGetSuccess]);

  useEffect(() => {
    if (modalAnim) {
      const el = document.getElementById('pinduoduoFreeDrawElement');
      const func = () => {
        // 动画结束
        resetState();
      };
      el?.addEventListener('animationend', func);
      return () => {
        resetState();
        el?.removeEventListener('animationend', func);
      };
    }
  }, [modalAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectBoxIndex > 0) {
        setFingerIndex(0);
        clearInterval(interval);
        return;
      }
      if (fingerIndex === 0) {
        setIntervalTime(5000);
      }
      setFingerIndex(Math.floor(Math.random() * 4) + 1);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  return pinduoduoFreeDrawModalVisible ? (
    <Modal>
      <div
        id="pinduoduoFreeDrawElement"
        className={cx(
          'relative w-full h-full max-w-[600px]',
          modalAnim
            ? modalAnim
            : 'animate__animated animate__fadeIn animate__faster'
        )}
      >
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={getImgUrl(EResourceLevel.V, 'cash_everyday_background_1_m')}
          alt=""
        />
        <div className="relative w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute flex flex-col w-full -top-32 justify-center items-center">
            <img
              className="h-12"
              src={getImgUrl(EResourceLevel.V, 'invitation_wheel_gift_title')}
              alt=""
            />
            <div className="text-base bgi-text-[var(--grayscale-100)] font-semibold drop-shadow-[0px_0px_10px_0px_#E36318]">
              {renderI18N({ i18nKey: 'spin_and_share_wheel_choose_reward' }, t)}
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-9">
            {new Array(4).fill(0).map((_, index) => {
              const seat = index + 1;
              return (
                <div key={index} className="relative">
                  <img
                    className={cx(boxStyle, {
                      'animate__animated animate__faster animate__zoomOut':
                        selectBoxIndex === seat,
                      'animate__animated animate__heartBeat animate__faster animate__delay-1s':
                        selectBoxIndex === 0,
                    })}
                    src={getImgUrl(
                      EResourceLevel.V,
                      'invitation_wheel_gift_box'
                    )}
                    onClick={() => {
                      openBox(seat);
                    }}
                  />
                  <img
                    className={cx(
                      'absolute size-24 -bottom-12 -right-6 pointer-events-none',
                      {
                        hidden: !(fingerIndex === seat),
                        block: fingerIndex === seat,
                      }
                    )}
                    src={getImgUrl(
                      EResourceLevel.V,
                      `invitation_wheel_finger`,
                      '.gif'
                    )}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 領取後畫面 */}
        <RewardBoxOpenContent />
      </div>
    </Modal>
  ) : null;
};
