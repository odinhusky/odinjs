import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

import { RechargeWheelRulesPageProps } from '../RechargeWheelRulesPageProps';

export const RechargeWheelRulesPage = ({}: RechargeWheelRulesPageProps) => {
  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'text-white')}>
      RechargeWheelRulesPage
    </div>
  );
};

export default RechargeWheelRulesPage;
