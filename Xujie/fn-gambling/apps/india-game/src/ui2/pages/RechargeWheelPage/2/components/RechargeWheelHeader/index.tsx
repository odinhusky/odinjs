import {
  handleRechargeDataIconClick,
  handleRechargeDepositNowButtonClick,
  handleRechargeQuestionIconClick,
} from '@mode2/action/actionTypes';
import useRechargeWheelAction from '@mode2/action/rechargeWheel/useRechargeWheelAction';
import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { DEFAULT_BG, FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import Icon from '@components/Icon';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';

interface RechargeWheelHeaderProps {}

export const RechargeWheelHeader = ({}: RechargeWheelHeaderProps) => {
  const { t } = useTranslation();

  const bgUrl = `url(${getImgUrl(
    EResourceLevel.V,
    'deposit_wheel_background_1_m'
  )})`;

  const { handleRechargeWheelClick } = useRechargeWheelAction();

  const rechargeWheelMaxReward = useMode2RechargeWheelPageStore(
    (state) => state.rechargeWheelMaxReward
  );

  return (
    <div
      className={cx('w-full', 'min-h-[160px]', 'relative', DEFAULT_BG)}
      style={{
        backgroundImage: bgUrl,
      }}
    >
      {/* Icon Buttons */}
      <div
        className={cx(
          FLEX_COL,
          'gap-3',
          'absolute top-[14px] right-[18px] z-[1]'
        )}
      >
        <div>
          <Icon
            name="ic_tips"
            className={cx('w-6 h-6 cursor-pointer')}
            color="var(--transparent-white-70)"
            onClick={() => {
              handleRechargeWheelClick({
                actionName: handleRechargeQuestionIconClick,
              });
            }}
          />
        </div>

        <div>
          <Icon
            name="ic_team_data"
            className={cx('w-6 h-6 cursor-pointer')}
            color="var(--transparent-white-70)"
            onClick={() => {
              handleRechargeWheelClick({
                actionName: handleRechargeDataIconClick,
              });
            }}
          />
        </div>
      </div>

      {/* 內容 */}
      <div className={cx('w-full h-full', 'p-3')}>
        <div className={cx(FLEX_COL, 'gap-2')}>
          <div className={cx(FLEX_COL, 'gap-1')}>
            <div className={cx(FLEX_CENTER)}>
              <img
                src={getImgUrl(EResourceLevel.V, 'deposit_wheel_title_1')}
                alt="Deposit wheel title image"
                className={cx('w-[145px]')}
              />
            </div>

            <div className={cx(FLEX_CENTER, 'gap-1')}>
              <div className="">
                <img
                  src={getImgUrl(EResourceLevel.V, 'deposit_wheel_title_2')}
                  alt="Reward up to title image"
                  className={cx('block w-[130px]')}
                />
              </div>

              <AnimationFlipNumbers
                numbers={`${rechargeWheelMaxReward}`}
                height={32}
              />
            </div>
          </div>

          <div className={cx('max-w-[256px]', 'w-full', 'mx-auto')}>
            <p
              className={cx(
                'block w-full',
                'text-center text-xs',
                'bgi-text-[var(--grayscale-70)]'
              )}
            >
              {t('deposit_wheel_max_prize_note', {
                maxReward: formatMoney({ value: rechargeWheelMaxReward }),
              })}
            </p>
          </div>

          <div className={cx(FLEX_CENTER)}>
            <BasePrimaryBtn
              className={cx('max-w-[168px] text-sm')}
              children={t('sign_up_popup_bonus_button')}
              onClick={() => {
                handleRechargeWheelClick({
                  actionName: handleRechargeDepositNowButtonClick,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeWheelHeader;
