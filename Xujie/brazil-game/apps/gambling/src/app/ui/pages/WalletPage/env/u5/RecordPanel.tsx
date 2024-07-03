import { useEffect, useState } from "react";

import DesktopRecordPanel from './device/DesktopRecordPanel'
import MobileRecordPanel from './device/MobileRecordPanel'
import { renderByRWD } from "../../../../utils/renderByRWD";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {TabletRecordPanel} from "./device/TabletRecordPanel";


export const DepositStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  1: {
    title: 'Concluido', // Completed
    color: '#10B981'
  },
  2: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  3: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  4: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  5: {
    title: 'Congelada', //Frozen
    color: '#793BF6'
  },
};

export const WithdrawStatusMap: { [key: number]: { title: string; color: string} } = {
  0: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  1: {
    title: 'Concluido', // Completed
    color: '#10B981'
  },
  2: {
    title: 'Pendente', // Pending
    color: '#F59E0B'
  },
  3: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  4: {
    title: 'Falha', // Failed
    color: '#EF4444'
  },
  5: {
    title: 'Congelada', //Frozen
    color: '#793BF6'
  },
};

type IRecordPanel = {
  recordPanelMode: 'deposit' | 'withdraw';
}

export const RecordPanel = (props: IRecordPanel) => {
  const [recordPanelMode, setRecordPanelMode] = useState<
    'deposit' | 'withdraw'
  >('deposit');

  const device = useBreakpoint();

  useEffect(() => {
    if(props.recordPanelMode) {
      setRecordPanelMode(props.recordPanelMode);
    }
  }, [props.recordPanelMode])

  return renderByRWD({
    desktop: <DesktopRecordPanel recordPanelMode={recordPanelMode} setRecordPanelMode={setRecordPanelMode} />,
    mobile: <MobileRecordPanel recordPanelMode={recordPanelMode} setRecordPanelMode={setRecordPanelMode}/>,
    tablet: <TabletRecordPanel recordPanelMode={recordPanelMode} setRecordPanelMode={setRecordPanelMode}/>
  }, device)

}
