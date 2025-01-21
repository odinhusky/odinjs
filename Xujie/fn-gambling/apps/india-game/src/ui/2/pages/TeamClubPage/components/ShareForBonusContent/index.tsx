import './index.scss';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { InviteLinkBlock } from './InviteLinkBlock';
import { InviteDetailed } from './InviteDetailed';
import { InviteTelegramGroup } from './InviteTelegramGroup';

const ShareForBonusContent = () => {
  return (
    <div
      className={cx(
        'share-for-bonus',
        FLEX_COL,
        'text-base',
        'gap-4'
      )}
    >
      {/* 二维码 */}
      <InviteLinkBlock />

      {/* 说明 */}
      <InviteDetailed />

      {/* 群 */}
      <InviteTelegramGroup/>
      
    </div>
  );
};

export default ShareForBonusContent;
