import {useState} from "react";
import {IMobileTotalTable} from "../../index";
import {QuestionTipsIcon} from "../../../../../components-bs/Icons/QuestionTipsIcon";
import {TabItem} from "../../../../../components-bs/TabItem/env/u2/TabItem";
import {MobileTableListItem} from "./components/MobileTableListItem";
import {IconTooltip} from "apps/gambling/src/app/ui/components/Tooltips/IconTooltip";


export const MobileTotalTable = (props: IMobileTotalTable) => {
  const {level1RechargeData} = props;
  const [inviteBonusInfoOpen, setInviteBonusInfoOpen] = useState(false);

  return (
    <div className={"flex flex-col rounded-2xl text-[#ffffff] text-left"}>
      <div className={"flex flex-col justify-center items-center flex-wrap my-3 px-4"}>
        <div id={"tab-item"} className="w-full flex justify-center items-center ">
          <div className="w-full bg-[var(--grayscale-20)] flex flex-row rounded-[100px] ">
            <TabItem active={props.type === "1"} onClick={() => props.onClick("1")} name={'Nível 1'} />
            <TabItem active={props.type === "2"} onClick={() => props.onClick("2")} name={'Nível 2'} />
            <TabItem active={props.type === "3"} onClick={() => props.onClick("3")} name={'Nível 3'} />
          </div>
        </div>
        <div className='text-base font-bold text-[var(--white)] mt-2'>Dados totais</div>
        <div className={"text-sm lg:text-base text-center lg:text-right mt-2 lg:mt-0 font-bold"}>
          <div className="text-[var(--state-warn-main)]">Atualize a cada 30 minutos</div>
          {props.type === "1" && level1RechargeData.isShowDividends && <div className="text-[var(--state-info-main)]">{level1RechargeData.dividendsText}</div>}
          {props.type === "1"&& level1RechargeData.isAvgAmountShow && <div className="text-[var(--state-info-main)]">{level1RechargeData.avgAmountText}</div>}
        </div>
      </div>
      <div className={'border-solid border-[var(--grayscale-40)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-20)] flex flex-col justify-center w-full px-2 py-1 border rounded-lg'}>
        {props.type === "1" &&
          <MobileTableListItem textClassName="font-bold" title={'Usuário de recarga'} text={props.data.numRecharge || 0} />
        }
        {props.type === "1" &&
          <MobileTableListItem title={'Primeira Recarga Recompensas'} textClassName="font-bold" text={`R$ ${props.data.firstRecharge || '0,00'} `} />
        }
        <MobileTableListItem textClassName="font-bold" title={'Valor da transação do jogo'} text={`R$ ${props.data.gameRecharge || '0,00'} `} />
        <MobileTableListItem textClassName="font-bold" title={
            <div className='flex items-center gap-2'>
              <div className="text-[var(--grayscale-70)]">{'Recompensas De Troca De Jogos'}</div>
              <div className='mr-1 self-start' onClick={() => setInviteBonusInfoOpen(true)}>
                <IconTooltip
                  tooltipStyle={{ fontSize: '14px', width: '200px', background: "#999", color: '#333', borderRadius: '8px', zIndex: 10, fontWeight: '500' }}
                  id='game-bonus-tooltip-desktop'
                  icon={<QuestionTipsIcon className={'text-base text-[#F59E0B]'} />}
                  content='As recompensas são liquidadas toda segunda-feira'
                />
              </div>
            </div>
        } text={`R$ ${props.data.gameRechargeReward}` || '0,00'}
        />
        <MobileTableListItem textClassName="font-bold" title={'Recompensa Total'} text={`R$ ${props.data.totalReward}` || '0,00'} bottomLine={false} />
      </div>
    </div>
  )
}
