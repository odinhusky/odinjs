import '../index.scss';
import useImgUrlByBreakPoint from '@commonUtils/hooks/useImgUrlByBreakPoint';
import { handleInvitePageEarnTabLeanMoreClick } from '@mode2/action/invitePageAction/actionType';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import EarnReferalLink from './EarnReferalLink';
import EarnShare from './EarnShare';
import EarnHeader from '../components/EarnHeader';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

export const Earn = () => {
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const { handleInvitePageClick } = useInvitePageActions();

  return (
    <div className={cx('earn', FLEX_COL, 'text-base', 'gap-3 mobile:gap-5')}>
      <div className='flex flex-col mobile:gap-3 gap-0'>
        <EarnHeader />

        <EarnReferalLink />
      </div>

      <img
        src={getImgUrlByBreakPoint('learn_more')}
        alt="learn"
        className="cursor-pointer"
        onClick={() => {
          handleInvitePageClick({
            actionName: handleInvitePageEarnTabLeanMoreClick,
          });
        }}
      />

      <EarnShare />
    </div>
  );
};

export default Earn;
