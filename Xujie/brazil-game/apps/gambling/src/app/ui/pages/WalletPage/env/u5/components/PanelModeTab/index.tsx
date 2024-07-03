import {IPanelType} from "../../../../index";
import {twMerge} from "tailwind-merge";

const TabItem = ({ title, onClick, active, tabItemClassName }:{title: string; onClick: () => void; active: boolean; tabItemClassName?: string}) => {
  return (
    <button
      className={twMerge(
        'text-white font-bold text-sm py-[10px] w-[160px]',
        active && 'bg-linear-5-main rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,.25)]',
        tabItemClassName
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

interface PanelModeTabProps {
  panelMode: IPanelType;
  setPanelMode: (type: IPanelType) => void;
  tabItemClassName?: string
  className?: string
}

export const PanelModeTab = ({
  panelMode,
  setPanelMode,
  tabItemClassName,
  className
}: PanelModeTabProps) => {
  return (
    <div
      className={twMerge('flex w-fit bg-linear-5-disabled rounded-lg', className)}>
      <TabItem active={panelMode === 'deposit'} title='Depósito' onClick={() => setPanelMode("deposit")} tabItemClassName={tabItemClassName}/>
      <TabItem active={panelMode === 'withdraw'} title='Retirar' onClick={() => setPanelMode("withdraw")} tabItemClassName={tabItemClassName}/>
      <TabItem active={panelMode === 'record'} title='Registro' onClick={() => setPanelMode("record")} tabItemClassName={tabItemClassName}/>
    </div>
  )
}