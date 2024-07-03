import cx from 'apps/gambling/src/app/ui/utils/cx';
import WalletContent from './WalletContent';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';
import { formatLocaleMoney } from 'apps/gambling/src/app/ui/utils/format';
import { usePageNavigate } from 'apps/gambling/src/app/ui/router/hooks/usePageNavigate';
import { useEffect, useMemo } from 'react';
import { useGetWithdrawLimitMutation } from 'apps/gambling/src/app/external';
import { AppLocalStorage } from 'apps/gambling/src/app/persistant/localstorage';
import { AppLocalStorageKey } from 'apps/gambling/src/app/persistant/AppLocalStorageKey';
import BaseBtn from 'apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn';
import t from 'apps/gambling/src/assets/constant/lang';
import moment from 'moment';

export const duringRestrictWithdrawTime = (begin: string, end: string) => {
  const beginNumber = Number(begin.replace(':', ''));
  const endNumber = Number(end.replace(':', ''));
  const nowGmtMinus3String = moment().utcOffset(-3).format('HH:mm');
  const nowGmtMinus3Number = Number(nowGmtMinus3String.replace(':', ''));

  if (endNumber < beginNumber) {
    // 表示區間有跨日
    return nowGmtMinus3Number >= beginNumber || nowGmtMinus3Number <= endNumber;
  } else {
    return nowGmtMinus3Number >= beginNumber && nowGmtMinus3Number <= endNumber;
  }
};

interface WithdrawPanelTermsProps {}

export const WithdrawPanelTerms = ({}: WithdrawPanelTermsProps) => {
  const withdrawBegin = useSelector(
    (state: RootState) => state.app.withdrawBegin
  );
  const withdrawEnd = useSelector((state: RootState) => state.app.withdrawEnd);
  const vip_level = useSelector((state: RootState) => state.app.vip_level);

  const isDuringRestrictTime = duringRestrictWithdrawTime(
    withdrawBegin,
    withdrawEnd
  );

  const { onClickToVipGrade } = usePageNavigate();

  const [triggerGetWithdrawLimit, currentWithdrawLimitData] =
    useGetWithdrawLimitMutation();
  // console.log("@@ currentWithdrawLimitData", currentWithdrawLimitData);
  useEffect(() => {
    triggerGetWithdrawLimit({
      token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
    });
  }, []);

  const withdrawLimitMin = useMemo(() => {
    if (
      !currentWithdrawLimitData ||
      !currentWithdrawLimitData?.data ||
      !currentWithdrawLimitData?.data?.data ||
      !currentWithdrawLimitData?.data?.data?.withdrawMin
    )
      return 0;
    return (
      parseFloat(
        (currentWithdrawLimitData?.data?.data?.withdrawMin / 100).toFixed(2)
      ) || 0
    );
  }, [currentWithdrawLimitData]);

  const withdrawLimitMax = useMemo(() => {
    if (
      !currentWithdrawLimitData ||
      !currentWithdrawLimitData?.data ||
      !currentWithdrawLimitData?.data?.data ||
      !currentWithdrawLimitData?.data?.data?.withdrawMax
    )
      return 0;
    return (
      parseFloat(
        (currentWithdrawLimitData?.data?.data?.withdrawMax / 100).toFixed(2)
      ) || 0
    );
  }, [currentWithdrawLimitData]);

  if (isDuringRestrictTime) return <></>;

  return (
    <div className="mt-4 mobile:mt-5 tablet:mt-6">
      <div
        className={cx(
          'text-center font-medium',
          'text-base mobile:text-lg tablet:text-2xl',
          'leading-6 tablet:leading-7',
          'mb-3'
        )}
      >
        {t['withdrawTermsTitle']}
      </div>

      <WalletContent
        className={cx(FLEX_CENTER, 'flex-col mobile:flex-row', 'gap-5')}
      >
        <div>
          {t['withdrawTermsP1Span1']}
          <span className="text-[var(--state-warn-main)]">
            {t['VIPLevel'](vip_level)}
          </span>
          {t['withdrawTermsP1Span2']}
          <span className="text-[var(--state-warn-main)]">
            {t['moneyWithRSign'](formatLocaleMoney(withdrawLimitMin))}
          </span>
          {t['withdrawTermsP1Span3']}
          <span className="text-[var(--state-warn-main)]">
            {t['moneyWithRSign'](formatLocaleMoney(withdrawLimitMax))}
          </span>
          {t['dot']}
        </div>

        <BaseBtn
          btnClass={cx(
            'py-2',
            'linear-3-button',
            'mobile:max-w-[156px]',
            'rounded-lg',
            'border-0',
            FLEX_CENTER
          )}
          childrenClass={cx('text-base leading-6 text-white font-medium')}
          children={'Cheque'}
          onClick={onClickToVipGrade}
        />
      </WalletContent>

      <WalletContent>
        {t['withdrawTermsP2Span1']}
        <br />
        {t['withdrawTermsP2Span2']}
      </WalletContent>

      <WalletContent>{t['withdrawTermsP3']}</WalletContent>

      <WalletContent>{t['withdrawTermsP4']}</WalletContent>

      <WalletContent>{t['withdrawTermsP5']}</WalletContent>

      <WalletContent>
        {t['withdrawTermsP6'](withdrawBegin, withdrawEnd)}
      </WalletContent>
    </div>
  );
};

export default WithdrawPanelTerms;
