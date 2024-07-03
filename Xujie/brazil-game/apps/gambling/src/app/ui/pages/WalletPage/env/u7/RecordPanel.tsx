import { useEffect, useState } from "react";

import WalletSharedRecordPanel from "./components/WalletSharedRecordPanel";
import t from "apps/gambling/src/assets/constant/lang";

export const DepositStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: t['Pending'], // Pending
    color: 'var(--state-warn-main)'
  },
  1: {
    title: t['Completed'], // Completed
    color: 'var(--state-success-main)'
  },
  2: {
    title: t['Pending'], // Pending
    color: 'var(--state-warn-main)'
  },
  3: {
    title: t['Failed'], // Failed
    color: 'var(--state-error-dark-active)'
  },
  4: {
    title: t['Failed'], // Failed
    color: 'var(--state-error-dark-active)'
  },
  5: {
    title: t['Frozen'], //Frozen
    color: 'var(--state-info-main)'
  },
};

export const WithdrawStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: t['Pending'], // Pending
    color: 'var(--state-warn-main)'
  },
  1: {
    title: t['Completed'], // Completed
    color: 'var(--state-success-main)'
  },
  2: {
    title: t['Pending'], // Pending
    color: 'var(--state-warn-main)'
  },
  3: {
    title: t['Failed'], // Failed
    color: 'var(--state-error-dark-active)'
  },
  4: {
    title: t['Failed'], // Failed
    color: 'var(--state-error-dark-active)'
  },
  5: {
    title: t['Frozen'], //Frozen
    color: 'var(--state-info-main)'
  },
};

type IRecordPanel = {
  recordPanelMode: 'deposit' | 'withdraw';
}

export const RecordPanel = (props: IRecordPanel) => {
  const [recordPanelMode, setRecordPanelMode] = useState<
    'deposit' | 'withdraw'
  >('deposit');

  useEffect(() => {
    if(props.recordPanelMode) {
      setRecordPanelMode(props.recordPanelMode);
    }
  }, [props.recordPanelMode])

  return (
    <WalletSharedRecordPanel recordPanelMode={recordPanelMode} setRecordPanelMode={setRecordPanelMode} />
  )
}
