import {
  handleMyPageVIPDetailBtnClick,
  handleMyPageVIPRecordBtnClick,
  handleMyPageVIPReportBtnClick,
} from '@mode2/action/actionTypes';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import MyPageTabButton from '@components/MyPageTabButton';
import cx from '@commonUtils/cx';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const MyPageVIPBlock = () => {
  const { t } = useTranslation();
  const { handleMyPageClick } = useMyPageActions();

  const betProgressPercent = useMyPageStore(
    (state) => state.betProgressPercent
  );
  const rechargeAmount = useMyPageStore((state) => state.rechargeAmount);
  const level = useUserProfileStore((state) => state.level);

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <img
          className={'h-12'}
          src={getImgUrl(EResourceLevel.V, `vip_level_${level}`)}
          alt="vip"
        />
        <div className="text-base bgi-text-[var(--grayscale-100)]">
          {t('account_menu_currently_accumulated', {
            rechargeAmount: formatMoney({
              value: rechargeAmount,
              includeDecimal: true,
            }),
          })}
        </div>
      </div>

      <div
        className={cx(
          'text-[var(--grayscale-100)] text-base mobile:text-lg font-medium my-3'
        )}
      >
        <div>
          {t('earn_money_statistics_bonus_info_table_header_bet_amount')}
        </div>

        <Progress
          className="bet-amount-progress"
          style={betProgressPercent > 0 ? { borderColor: 'transparent' } : {}}
          percent={betProgressPercent}
          showInfo={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <MyPageTabButton
          btnText={{ i18nKey: 'account_menu_vip_details' }}
          iconUrl={'ic_vip'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageVIPDetailBtnClick,
            });
          }}
        />

        <MyPageTabButton
          btnText={{ i18nKey: 'leftnav_balance_record' }}
          iconUrl={'ic_balance_record'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageVIPRecordBtnClick,
            });
          }}
        />

        <MyPageTabButton
          btnText={{ i18nKey: 'leftnav_balance_report' }}
          iconUrl={'ic_balance_report'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageVIPReportBtnClick,
            });
          }}
        />
      </div>
    </div>
  );
};

export default MyPageVIPBlock;
