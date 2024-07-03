import { IPanelType } from '../../../index';
import WalletTab from './WalletTab'

interface WalletTabsGroupProps {
  panelMode: IPanelType;
  setPanelMode: (type: IPanelType) => void;
}

export const WalletTabsGroup = ({
  panelMode,
  setPanelMode
}: WalletTabsGroupProps) => {
  return (
    <div className='flex w-full mobile:w-fit'>
      <WalletTab
        active={panelMode === 'deposit'}
        onClick={()=>setPanelMode('deposit')} title='Depósito' />
      <WalletTab
        active={panelMode === 'withdraw'}
        onClick={()=>setPanelMode('withdraw')} title='Retirar' />
      <WalletTab
        active={panelMode === 'record'}
        onClick={()=>setPanelMode('record')} title='Registro' />
    </div>
  )
}

export default WalletTabsGroup;