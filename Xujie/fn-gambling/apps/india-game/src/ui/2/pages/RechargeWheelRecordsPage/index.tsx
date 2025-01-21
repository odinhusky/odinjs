import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

interface RechargeWheelRecordsPageProps {}

export const RechargeWheelRecordsPage = ({}: RechargeWheelRecordsPageProps) => {
  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'text-white')}>
      RechargeWheelRecordsPage
    </div>
  );
};

export default RechargeWheelRecordsPage;
