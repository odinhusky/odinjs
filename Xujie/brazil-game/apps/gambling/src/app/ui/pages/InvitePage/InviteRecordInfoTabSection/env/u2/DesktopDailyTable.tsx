import { IconTooltip } from "apps/gambling/src/app/ui/components/Tooltips/IconTooltip";
import { QuestionTipsIcon } from "../../../../../components-bs/Icons/QuestionTipsIcon";
import { environment } from "apps/gambling/src/environments/environment";
import {IColumns, Table} from "apps/gambling/src/app/ui/components-bs/Table";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";

interface IDailyType {
  type: string;
  records?: any;
  isProxy: boolean;
}

export const DesktopDailyTable = (props: IDailyType) => {
  const { isTablet } = useBreakpoint()
  const columns: IColumns[] = [
    { title: 'Data', name: 'day', key: 'day' },
    { title: 'Usuário De Recarga', name: 'numRecharge', key: 'numRecharge', isShow: props.type === "1"},
    { title: 'Primeira Recarga Recompensas', name: 'firstRecharge', key: 'firstRecharge', isShow: props.type === "1", render: (i: any) => `R$ ${i.firstRecharge || '0,00'}` },
    { title: 'Valor Da Transação Do Jogo', name: 'gameRecharge', key: 'gameRecharge', render: (i: any) => `R$ ${i.gameRecharge || '0,00'}` },
    {
      title: <div className="flex items-center justify-center">
        <div>Recompensas De Troca De Jogos</div>
        <div className='ml-1 self-start'>
          <IconTooltip
            tooltipStyle={{ fontSize: isTablet ? '14px' : '16px', width: '250px', background: "#999", color: '#333', borderRadius: '8px', zIndex: 10, fontWeight: '500' }}
            id='game-bonus-tooltip-desktop'
            icon={<QuestionTipsIcon className={'text-base'} />}
            content='As recompensas são liquidadas toda segunda-feira'
          />
        </div>
      </div>,
      name: 'gameRechargeReward', key: 'gameRechargeReward', render: (i: any) => `R$ ${i.gameRechargeReward || '0,00'}`
    },
    { title: 'Recompensa Total', name: 'totalReward', key: 'totalReward', render: (i: any) => `R$ ${i.totalReward || '0,00'}` },
  ]
  if(props.isProxy){
    columns.unshift({title: 'Dividends', name: 'dividendos', key: 'dividendos', className:'text-[var(--state-info-main)]', render: (i: any) => `R$ ${i.dividendos || '0,00'}`})
  }

  return (
    <div className=" riojungle777bet-table overflow-x-auto text-white text-center rounded-xl  p-5 bg-[#333]" >
      <Table
        containerClassName={`min-w-[500px] max-h-[400px]`}
        className={'w-full overflow-x-auto border-r-0 '}
        titleStyle={`font-normal text-xs lg:text-sm`}
        contentStyle={`border-b text-sm`}
        dataSource={props.records !== undefined && props.records?.length > 0 ? props.records : []}
        columns={columns}
        dataCount={0}
      />
    </div>
  )
}
