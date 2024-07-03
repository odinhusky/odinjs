import React, { useEffect, useState } from 'react';

import { AppLocalStorage } from '../../../persistant/localstorage';
import { useSelector } from 'react-redux';

import { useAllowLoginRouterRules } from '../../router/hooks/useAllowLoginRouterRules';
import {
  accountPromotedSwingSelector,
  accountPromotedWithdrawableSelector,
  toDepositAccountRemovableSelector,
  toDepositAccountSwingSelector,
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../reduxStore/appSlice';

import { usePageNavigate } from '../../router/hooks/usePageNavigate';
import { renderByUVersion } from '../../utils/renderByUVersion';

import { WalletPage as PWalletPage } from './env/p1/WalletPage';
import { WalletPage as WWalletPage } from './env/wild/WalletPage';
import { WalletPage as CWalletPage } from './env/u1/WalletPage';
import { WalletPage as RWalletPage } from './env/u2/WalletPage';
import { WalletPage as U5WalletPage } from './env/u5/WalletPage';
import { WalletPage as U6WalletPage } from './env/u6/WalletPage';
import { WalletPage as U7WalletPage } from './env/u7/WalletPage';
import { AppLocalStorageKey } from '../../../persistant/AppLocalStorageKey';
import queryString from 'query-string';
import { useLazyGetRechargeQuery } from '../../../external';

export type IPanelType = 'deposit' | 'withdraw' | 'record';
export type IRecordPanelType = 'deposit' | 'withdraw';

import { BalanceSectionValue } from './env/u6/types/walletTypes';
import { useUserDama } from '../../hooks/useUserDama';

export const WalletPage = () => {
  useAllowLoginRouterRules();

  const { onClickToIndex, onClickToWallet } = usePageNavigate();

  // NOTE: querystring
  const panelType =
    queryString.parse(window.location.search)?.panelType || 'deposit';
  const [panelMode, setPanelMode] = useState<IPanelType>(
    panelType as IPanelType
  );

  const [
    triggerGetRecharge,
    { data: rechargeData, isLoading, isSuccess, isError },
  ] = useLazyGetRechargeQuery();

  const { trigger, damaResult } = useUserDama();

  useEffect(() => {
    if (panelMode === 'deposit') {
      triggerGetRecharge(null);
    }

    // NOTE: setPanelMode時，一併更新queryString
    onClickToWallet({ panelType: panelMode });
  }, [panelMode]);

  // NOTE: 依queryString更新panelMode
  useEffect(() => {
    if (panelMode !== panelType) {
      setPanelMode(panelType as IPanelType);
    }
  }, [panelType]);

  useEffect(() => {
    trigger();
  }, []);

  // const { userAmount, user: {withdrawAmount} } = useSelector((state: RootState) => state.app.userStore as IUserStore)

  const [recordPanelMode, setRecordPanelMode] =
    useState<IRecordPanelType>('deposit');

  const totalSectionValues: BalanceSectionValue = {
    total: {
      balance: useSelector(totalBalanceSheetSelector) || 0,
      retrievable: useSelector(totalReasableSelector) || 0,
    },
    deposit: {
      balance: useSelector(toDepositAccountSwingSelector) || 0,
      retrievable: useSelector(toDepositAccountRemovableSelector) || 0,
    },
    promotion: {
      balance: useSelector(accountPromotedSwingSelector) || 0,
      retrievable: useSelector(accountPromotedWithdrawableSelector) || 0,
    },
  };

  return renderByUVersion(
    {
      wild777bet: (
        <WWalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
        />
      ),
      p1: (
        <PWalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          damaResult={damaResult}
        />
      ),
      u1: (
        <CWalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          damaResult={damaResult}
        />
      ),
      u2: (
        <RWalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          totalSectionValues={totalSectionValues}
          damaResult={damaResult}
        />
      ),
      u5: (
        <U5WalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          totalSectionValues={totalSectionValues}
          damaResult={damaResult}
        />
      ),
      u6: (
        <U6WalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          totalSectionValues={totalSectionValues}
          damaResult={damaResult}
        />
      ),
      u7: (
        <U7WalletPage
          onClickToIndex={onClickToIndex}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rechargeData={rechargeData}
          recordPanelMode={recordPanelMode}
          setRecordPanelMode={setRecordPanelMode}
          totalSectionValues={totalSectionValues}
          damaResult={damaResult}
        />
      ),
    },
    <PWalletPage
      onClickToIndex={onClickToIndex}
      panelMode={panelMode}
      setPanelMode={setPanelMode}
      rechargeData={rechargeData}
      recordPanelMode={recordPanelMode}
      setRecordPanelMode={setRecordPanelMode}
      damaResult={damaResult}
    />
  );
};

export default WalletPage;
