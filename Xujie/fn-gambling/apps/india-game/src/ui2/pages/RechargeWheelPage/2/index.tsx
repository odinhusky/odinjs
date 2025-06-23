import { cx } from '@libs/commonUtils';
import {
  DEFAULT_BG,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import RechargeWheelHeader from './components/RechargeWheelHeader';
import RechargeWheelScroll from './components/RechargeWheelScroll';
import RechargeWheelTabs from './components/RechargeWheelTabs';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import RechargeWheelProgressAnchors from './components/RechargeWheelProgressAnchors';
import RechargeWheelDepositInfo from './components/RechargeWheelDepositInfo';
import RechargeWheels from './components/RechargeWheels';
import useMode2RechargeWheelPageBase from '@mode2/usecase/page/rechargeWheelPage/useMode2RechargeWheelPageBase';
import { RechargeWheelPageProps } from '../RechargeWheelPageProps';

export const RechargeWheelPage = ({}: RechargeWheelPageProps) => {
  useMode2RechargeWheelPageBase();

  const bgUrl = getImgUrl(EResourceLevel.V, 'deposit_wheel_background_2_m');

  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH)}>
      <div
        className={cx('-mx-4 mobile:-mx-0 h-screen mobile:h-full')}
        style={{
          backgroundImage: `url(${bgUrl})`,
        }}
      >
        <RechargeWheelHeader />

        <RechargeWheelScroll />

        <div
          className={cx(
            FLEX_COL,
            'gap-3',
            'py-3',
            DEFAULT_BG,
            'px-4 mobile:pb-5'
          )}
        >
          <RechargeWheelTabs />

          <RechargeWheelDepositInfo />

          <RechargeWheelProgressAnchors />

          <RechargeWheels />
        </div>
      </div>
    </div>
  );
};

export default RechargeWheelPage;
