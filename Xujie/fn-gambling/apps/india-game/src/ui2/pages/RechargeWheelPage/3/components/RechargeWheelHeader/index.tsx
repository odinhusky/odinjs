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
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import BaseBadgeBtn from '@components/BaseBadgeBtn';

interface RechargeWheelHeaderProps {}

export const RechargeWheelHeader = (props: RechargeWheelHeaderProps) => {
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
      {/* 左側的兩個連結 */}
      <div
        className={cx(FLEX_COL, 'gap-[28px]', 'absolute top-4 left-0 z-[1]')}
      >
        <div>
          {/* Rules */}
          <BaseBadgeBtn
            onClick={() => {
              handleRechargeWheelClick({
                actionName: handleRechargeQuestionIconClick,
              });
            }}
            children={t('deposit_wheel_rules_page_title')}
          />
        </div>

        <div>
          <BaseBadgeBtn
            onClick={() => {
              handleRechargeWheelClick({
                actionName: handleRechargeDataIconClick,
              });
            }}
            children={t('deposit_history_page_title')}
          />
        </div>
      </div>

      {/* 內容 */}
      <div className={cx('w-full h-full', 'p-3')}>
        <div className={cx(FLEX_COL, 'gap-3')}>
          <div className={cx(FLEX_COL, 'gap-1')}>
            <div className={cx(FLEX_COL, 'gap-1')}>
              <div className={cx(FLEX_CENTER)}>
                <img
                  src={getImgUrl(EResourceLevel.V, 'deposit_wheel_title_1')}
                  alt="Deposit wheel title image"
                  className={cx('h-9')}
                />
              </div>

              <div className={cx(FLEX_CENTER, 'gap-1')}>
                <div className="">
                  <img
                    src={getImgUrl(EResourceLevel.V, 'deposit_wheel_title_2')}
                    alt="Reward up to title image"
                    className={cx('block h-9')}
                  />
                </div>

                <AnimationFlipNumbers
                  numbers={`${rechargeWheelMaxReward}`}
                  height={28}
                />
              </div>
            </div>

            <div className={cx('max-w-[256px]', 'w-full', 'mx-auto')}>
              <p
                className={cx(
                  'block w-full',
                  'text-center text-xs',
                  'bgi-text-[var(--base-2-variant1)]'
                )}
              >
                {t('deposit_wheel_max_prize_note', {
                  maxReward: formatMoney({ value: rechargeWheelMaxReward }),
                })}
              </p>
            </div>
          </div>

          <div className={cx(FLEX_CENTER)}>
            <BasePrimaryBtn
              className={cx('w-[237px] h-[48px]', 'text-sm', 'rounded-full')}
              classNameText={cx('text-lg font-medium')}
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
