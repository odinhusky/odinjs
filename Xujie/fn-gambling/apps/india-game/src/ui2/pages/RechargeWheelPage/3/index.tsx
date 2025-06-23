import { cx } from '@libs/commonUtils';
import {
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
  remToPx,
} from '@libs/constant/style';
import RechargeWheelHeader from './components/RechargeWheelHeader';
import RechargeWheelScroll from './components/RechargeWheelScroll';
import RechargeWheelTabs from './components/RechargeWheelTabs';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import RechargeWheelProgressAnchors from './components/RechargeWheelProgressAnchors';
import RechargeWheelDepositInfo from './components/RechargeWheelDepositInfo';
import RechargeWheels from './components/RechargeWheels';
import useMode2RechargeWheelPageBase from '@mode2/usecase/page/rechargeWheelPage/useMode2RechargeWheelPageBase';
import useRechargeWheelHeaderOverride from './hooks/useRechargeWheelHeaderOverride';
import RechargeWheelExtraBgs from './components/RechargeWheelExtraBgs';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import RechargeWinFeedBack from './components/RechargeWinFeedBack';
import { RechargeWheelPageProps } from '../RechargeWheelPageProps';

export const RechargeWheelPage = (props: RechargeWheelPageProps) => {
  useMode2RechargeWheelPageBase();

  useRechargeWheelHeaderOverride();

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'mobile:-mx-4')}>
      <div
        className={cx(
          '-mx-4 mobile:-mx-0 -mb-4',
          'h-screen mobile:h-full',
          'bg-contain'
        )}
        style={{
          marginTop: `-${(headerElMetrics?.height || 80) / remToPx}rem`,
          paddingTop: `${(headerElMetrics?.height || 80) / remToPx}rem`,
        }}
      >
        <RechargeWheelHeader />

        <RechargeWheelScroll />

        <div className={cx('bgi-[var(--base-2-variant11)]', 'pt-4')}>
          <RechargeWheelTabs />

          <div className={cx('bgi-[var(--base-2-variant16)]')}>
            <div
              className={cx(
                'w-full h-full',
                'px-4 mobile:px-5',
                FLEX_COL,
                'gap-2'
              )}
            >
              <RechargeWheelDepositInfo />

              {/* 可以試著查看效果 */}
              {/* <div className={cx(FLEX_CENTER, 'w-full')}>
                <BasePrimaryBtn
                  children={'抽中金錢399'}
                  onClick={() => {
                    console.log('!! 有點到抽中金錢399');
                    openWinMoney(399);
                  }}
                />
                <BaseSecondaryBtn
                  children={'抽中銀盤旋轉次數 +2'}
                  onClick={() => {
                    console.log('!! 有點到抽中銀盤旋轉次數 +2');

                    openWinSpin(RechargeWheelSpinLevelType.SILVER, 2);
                  }}
                />
              </div> */}

              <RechargeWheelProgressAnchors />

              <div className="relative">
                <RechargeWheels />

                <RechargeWheelExtraBgs />

                <RechargeWinFeedBack />
              </div>
            </div>

            {/* 底部金幣圖 */}
            <div className={cx('w-full')}>
              <img
                src={getImgUrl(
                  EResourceLevel.V,
                  'deposit_wheel_background_coins'
                )}
                alt="Bottom background_image"
                className={cx('w-full', 'relative z-[0]')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeWheelPage;
