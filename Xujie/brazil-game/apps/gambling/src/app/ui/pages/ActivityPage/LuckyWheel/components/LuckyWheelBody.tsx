import { usePostLuckyWheelSpinMutation } from 'apps/gambling/src/app/external';
import { LevelType } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/PostLuckyWheelSpinEndpoint';
import { WheelConfigsType } from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelConfigTransform';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { environment } from 'apps/gambling/src/environments/environment';
import { isArray, isEmpty, isNumber } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import LuckyWheelCoinImages from './LuckyWheelCoinImages';
import LuckyWheelFixedParts from './LuckyWheelFixedParts';
import { appSlice } from 'apps/gambling/src/app/reduxStore/appSlice';
import { useDispatch } from 'react-redux';
import { notification } from 'antd';
import useDeepEffect from '../../../../hooks/useDeepEffect';
import useLuckyWheelUserRecordsTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelUserRecordsTransform';
import {
  REWARD_AMOUNT_SHOW_TIME,
  SPIN_ANIMATION_TOTAL_TIME,
} from '../LuckyWheelConst';
import { rouletteClass } from '../luckyWheelStyle';
import { useLuckyWheelCtx } from '../LuckyWheelContext';
import { formatDenominatorValue } from '../../../../utils/format';
import LuckyWheelCoinsDropAnimation from './LuckyWheelCoinsDropAnimation';
import { LuckyWheelUnit } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetLuckyWheelConfigEndpoint';
interface LuckyWheelBodyProps {
  activeLevel: LevelType;
  activePerSpinCost?: number;
  currentLuckyValue?: number;
  wheelConfigs?: WheelConfigsType[];
}

export const LuckyWheelBody = ({
  activeLevel,
  activePerSpinCost,
  wheelConfigs,
  currentLuckyValue,
}: LuckyWheelBodyProps) => {
  const dispatch = useDispatch();
  const { isAnimatingObj, setIsAnimatingObj } = useLuckyWheelCtx();
  const [api, contextHolder] = notification.useNotification();

  const rouletteRefs = {
    Silver: useRef<HTMLDivElement>(null),
    Gold: useRef<HTMLDivElement>(null),
    Diamond: useRef<HTMLDivElement>(null),
  };

  // 指定到特定的轉盤特定的格子裡
  const goToSpecificWheelBlock = (index: number, level: LevelType) => {
    const ref = rouletteRefs[level];
    const additionalDeg = 90 + (index * -36 + -18);
    const totalDeg = BASE_ROTATE_DEG + additionalDeg;

    if (!ref || !ref.current) return;
    ref.current.style.transform = `rotate(${totalDeg}deg)`;
  };

  // 找出轉盤 config 中最小金額的 index(暫時沒用到)
  const findMinRewardAmountIndex = (configs: LuckyWheelUnit[]) => {
    if (configs.length === 0) return -1;

    let minIndex = 0;
    for (let i = 1; i < configs.length; i++) {
      const current = configs[i].rewardAmount || 0;
      const prevMin = configs[minIndex].rewardAmount || 0;

      if (current < prevMin) {
        minIndex = i;
      }
    }

    return minIndex;
  };

  // 元件初始化先找到該輪盤中最小的數值選項並且轉到該位置
  useEffect(() => {
    if (!isEmpty(wheelConfigs)) {
      wheelConfigs?.forEach((item) => {
        const level = item.level;
        // const minIndex = findMinRewardAmountIndex(item.rewardConfigs || []);
        const minIndex = 0;

        if (level) goToSpecificWheelBlock(minIndex, level);
      });
    }
  }, [wheelConfigs]);

  const { userRecords } = useLuckyWheelUserRecordsTransform();

  // 再來，取得上一次得獎紀錄的金額，並且指到其金額，如果找不到金額則不做此功能。
  // 若金額重複則找到其中一個符合的金額即可。
  useDeepEffect(() => {
    if (!isEmpty(userRecords) && !isEmpty(wheelConfigs)) {
      const userRecordsReverse = isArray(userRecords)
        ? [...userRecords].reverse()
        : userRecords;
      const firstUserRecord = userRecordsReverse[0];
      const firstUserRewardedLevel = firstUserRecord.level;
      const firstUserRewardedAmount = firstUserRecord.rewardAmount;

      const config = wheelConfigs?.find(
        (item) => item.level === firstUserRewardedLevel
      );
      if (!config || !config.rewardConfigs) return;

      const amountIndex = config.rewardConfigs.findIndex(
        (item) => item.rewardAmount === firstUserRewardedAmount
      );
      if (amountIndex === -1) return;

      if (firstUserRewardedLevel)
        goToSpecificWheelBlock(amountIndex, firstUserRewardedLevel);
    }
  }, [userRecords, wheelConfigs]);

  const lowerCaseLevelArr = ['silver', 'gold', 'diamond'];
  const BASE_ROTATE_DEG = 7200;
  const loopAnimationOptions = {
    // fill: 'forward',
    duration: SPIN_ANIMATION_TOTAL_TIME,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  };

  const [triggerSpin, { isSuccess: isSpinSuccess, data: spinResData }] =
    usePostLuckyWheelSpinMutation();

  const [showRewardAmount, setShowRewardAmount] = useState(0);

  // showRewardAmount 變動的時候進行顯示，五秒後自動關掉
  useEffect(() => {
    if (showRewardAmount > 0) {
      setShowRewardAmount(showRewardAmount);

      let x = setTimeout(() => {
        setShowRewardAmount(0);
      }, REWARD_AMOUNT_SHOW_TIME);

      return () => {
        clearTimeout(x);
      };
    }
  }, [showRewardAmount]);

  // 處理轉盤動畫
  const handleWheelSpinAnimation = (
    selectedIdx: number,
    rewardAmount: number
  ) => {
    const ref = rouletteRefs[activeLevel];
    // const selectedIdx = Math.floor(Math.random() * 9);
    const additionalDeg = 90 + (selectedIdx * -36 + -18);
    const totalDeg = BASE_ROTATE_DEG + additionalDeg;
    const loopAnimation = [
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${totalDeg}deg)` },
    ];
    if (ref.current) {
      const animation = ref.current.animate(
        loopAnimation,
        loopAnimationOptions
      );

      animation.onfinish = () => {
        if (ref.current) {
          // 結束後設定在停止的地方
          ref.current.style.transform = `rotate(${totalDeg}deg)`;
          // 設定 rewardAmount 使其在動畫結束後出現
          setShowRewardAmount(rewardAmount);
          // isAnimating 狀態個別更新
          setIsAnimatingObj((obj) => ({ ...obj, [activeLevel]: false }));
        }
      };
    }
  };

  // 獲得從 API 拿到的獎金金額去找出對應的 Index 是多少，再觸發轉盤動畫
  const handleFindSelectedIndex = (rewardAmount: number) => {
    if (!wheelConfigs || isEmpty(wheelConfigs)) return;

    if (rewardAmount) {
      const currentWheelConfigs = wheelConfigs.find(
        (item) => item.level === activeLevel
      ) as WheelConfigsType;

      const rewardConfigs = currentWheelConfigs.rewardConfigs;
      const selectedRewardIdx = rewardConfigs
        ? rewardConfigs.findIndex((item) => item.rewardAmount === rewardAmount)
        : -1;

      // console.log('@@ selectedRewardIdx', selectedRewardIdx)

      if (selectedRewardIdx !== -1) {
        handleWheelSpinAnimation(selectedRewardIdx, rewardAmount);
      }
    }
  };

  // 觸發 API 去拿到對應的獎金金額
  const onClickTrigger = async () => {
    // 判斷幸運值是否足夠，如果不足則顯示彈窗
    if (
      !isNumber(currentLuckyValue) ||
      !isNumber(activePerSpinCost) ||
      activePerSpinCost === undefined ||
      activePerSpinCost === null
    )
      return;

    if (currentLuckyValue < activePerSpinCost) {
      dispatch(
        appSlice.actions.setIsShowLuckyWheelLuckyValueInsufficientModal(true)
      );
      return;
    }

    // 不能連續點擊
    if (isAnimatingObj[activeLevel]) return;
    setIsAnimatingObj((obj) => ({ ...obj, [activeLevel]: true }));

    // 打 API 得到金額
    try {
      const spinResData = await triggerSpin({ level: activeLevel });
      console.log('@@ spinResData', spinResData);

      if ('data' in spinResData && spinResData.data) {
        const rewardAmount = spinResData.data.data.rewardAmount as number;

        handleFindSelectedIndex(rewardAmount);
      } else if ('error' in spinResData) {
        api.error({ message: t['Error'] });
      } else {
        api.error({ message: t['Error'] });
      }
    } catch (e) {
      api.error({ message: t['Error'] });
    }
  };

  return (
    <>
      {contextHolder}
      <div className={cx(FLEX_CENTER, 'relative', 'z-[5]')}>
        {!isEmpty(wheelConfigs) && wheelConfigs
          ? wheelConfigs.map(
              (
                { id, level, rewardConfigs }: WheelConfigsType,
                index: number
              ) => {
                const lowerCaseLevel =
                  level?.toLowerCase() || lowerCaseLevelArr[index];

                return (
                  <div
                    key={id}
                    className={cx('relative', rouletteClass, {
                      hidden: activeLevel !== level,
                    })}
                  >
                    {/* 會轉動的部分 */}
                    <div
                      ref={rouletteRefs[level as LevelType]}
                      className={cx('relative', rouletteClass)}
                    >
                      {/* 輪盤的底 */}
                      <img
                        className={cx('block', 'w-full h-full')}
                        src={`assets/${environment.uVersion}/wheel_${lowerCaseLevel}.png`}
                        alt="Wheel image"
                      />

                      {/* 10 個區塊 */}
                      {rewardConfigs && !isEmpty(rewardConfigs)
                        ? rewardConfigs.map((item, index) => {
                            const rewardAmount = formatDenominatorValue(
                              item.rewardAmount || 0
                            );

                            const handleDigitClass = `${
                              rewardAmount.length >= 5
                                ? 'text-[14px] tab:text-[16px] tablet:text-[18px]'
                                : rewardAmount.length >= 7
                                ? 'text-[12px] tab:text-[14px] tablet:text-[16px]'
                                : ''
                            }`;
                            return (
                              <div
                                key={`${id} - ${item.rewardAmount} - ${index}`}
                                className={cx(
                                  rouletteClass,
                                  'absolute top-0 left-0',
                                  'rounded-[50%]'
                                )}
                                style={{
                                  clipPath:
                                    'polygon(0% 14%, 50% 50%, 0% 50%, 0% 0%)',
                                  transform: `rotate(${36 * index}deg)`,
                                }}
                              >
                                {/* 獎金數字 */}
                                <div
                                  className={cx(
                                    rouletteClass,
                                    'absolute',
                                    'top-[6%] left-[7%]',
                                    'se:top-[19px] se:left-[19px]',
                                    'tab:top-[23px] tab:left-[30px]',
                                    'text-white font-bold text-center',
                                    'text-base leading-6',
                                    'tab:text-[22px] tab:leading-7',
                                    'tablet:text-[24px] tablet:leading-[30px]',
                                    'rotate-[-72deg]',
                                    'pl-[25px]',
                                    handleDigitClass
                                  )}
                                >
                                  {formatDenominatorValue(
                                    item.rewardAmount || 0
                                  )}
                                </div>

                                {/* 金幣圖 */}
                                <LuckyWheelCoinImages rewardItem={item} />
                              </div>
                            );
                          })
                        : null}
                    </div>

                    {/* 不會轉動的部分 指針 & 按鈕 & 獎金提示 */}
                    <LuckyWheelFixedParts
                      isAnimating={isAnimatingObj[activeLevel]}
                      lowerCaseLevel={lowerCaseLevel}
                      showRewardAmount={showRewardAmount}
                      onClickTrigger={() => {
                        onClickTrigger();
                      }}
                    />
                  </div>
                );
              }
            )
          : null}
      </div>

      {/* 金幣的落下動畫 */}
      <LuckyWheelCoinsDropAnimation showRewardAmount={showRewardAmount} />
    </>
  );
};

export default LuckyWheelBody;
