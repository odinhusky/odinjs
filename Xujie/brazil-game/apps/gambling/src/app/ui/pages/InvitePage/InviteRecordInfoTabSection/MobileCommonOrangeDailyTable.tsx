import moment from "moment/moment";
import { ITabType } from "./index";
import { CommonTableTabG } from "../../../components-bs/TabItem/CommonTableTabG";
import { renderByUVersion } from "../../../utils/renderByUVersion";
import DatePicker from "../../../components-bs/DatePickers/DatePicker";
import { useState } from "react";
import ConfirmDrawer from "../../../components-bs/Drawers/ConfirmDrawer";
import { environment } from "apps/gambling/src/environments/environment";
import { TabItem } from "../../../components-bs/TabItem/TabItem";
import { tabItemProps } from "./env/u1/tabItemProps";
import { MobileTableContainer } from "./env/components/MobileTableContainer";
import { QuestionTipsIcon } from "../../../components-bs/Icons/QuestionTipsIcon";



type IMobileCommonOrangeTable = ITabType & { records: any; isProxy: boolean; recordDate: string; onRecordDateSelect: (date: string) => void }


export const MobileCommonOrangeDailyTable = (props: IMobileCommonOrangeTable) => {
  const [inviteBonusInfoOpen, setInviteBonusInfoOpen] = useState(false)
  const isCoco777bet = environment.uVersion === 'coco777bet';
  const TableTabItem = isCoco777bet ? TabItem : CommonTableTabG;
  return (
    <div className={"pb-2 flex flex-col rounded-2xl text-[#ffffff] text-left"}>
      <div className={"flex flex-row text-lg font-bold justify-around mb-2"}>
        <TableTabItem {...tabItemProps(props.type === "1",'mr-2')} active={props.type === "1"} onClick={() => props.onClick("1")} name={'Nível 1'}>Nível 1</TableTabItem>
        <TableTabItem {...tabItemProps(props.type === "2",'mr-2')} active={props.type === "2"} onClick={() => props.onClick("2")} name={'Nível 2'}>Nível 2</TableTabItem>
        <TableTabItem {...tabItemProps(props.type === "3")} active={props.type === "3"} onClick={() => props.onClick("3")} name={'Nível 3'}>Nível 3</TableTabItem>
      </div>



        <div className={"text-[transparent] mb-2"}>
          <DatePicker onConfirm={props.onRecordDateSelect} value={props.recordDate} min={moment().subtract(1, 'days').format('YYYY-MM-DD')} max={moment().format('YYYY-MM-DD')} />
        </div>

        <MobileTableContainer>
          {props.isProxy && (
            <div className={"flex flex-row justify-end"}>
              <span className={"text-xs text-[var(--secondary-assistant)]"}>Dividends: R$ {props.records && props.records[0] && props.records[0].dividendos || "0.00"}</span>
            </div>
          )}
        <div className={"flex flex-col mb-2 mt-2"}>
          <span className={"text-xl text-[#ffffff]"}>R$ {props.records && props.records[0] && props.records[0].totalReward || '0,00'}</span>
          <span className="text-xs font-hairline">Obter bônus</span>
        </div>

        {props.type === "1" && (
          <div className={"flex flex-row justify-around mb-2"}>
            <div className={"flex flex-col flex-1 justify-center"}>
              <span className={"text-sm text-[#ffffff]"}>{props.records && props.records[0] && props.records[0].numRecharge || 0}</span>
              <span className="text-xs font-hairline">Usuário de recarga</span>
            </div>

            <div className={"flex flex-col flex-1 justify-center"}>
              <span className={"text-sm text-[#ffffff]"}>R$ {props.records && props.records[0] && props.records[0].firstRecharge || '0,00'}</span>
              <span className="text-xs font-hairline">Obter bônus</span>
            </div>
          </div>
        )}

        <div className={"flex flex-row justify-around mb-2"}>
          <div className={"flex flex-col flex-1 justify-center"}>
            <span className={"text-sm text-[#ffffff]"}>R$ {props.records && props.records[0] && props.records[0].gameRecharge || '0,00'}</span>
            <span className="text-xs font-hairline">Valor da transação do jogo</span>
          </div>

          <div className={"flex flex-col flex-1"} onClick={() => setInviteBonusInfoOpen(true)}>
            <div className='flex items-center justify-center'>
              <span className={"text-sm text-[#ffffff] mr-1"}>R$ {props.records && props.records[0] && props.records[0].gameRechargeReward || '0,00'}</span>
              <QuestionTipsIcon  className="text-xs  self-baseline" />
            </div>
            <span className="text-xs font-hairline">Obter bônus</span>
            {
              inviteBonusInfoOpen && (
                <ConfirmDrawer
                  onClose={() => setInviteBonusInfoOpen(false)}
                  buttonText='Eu vejo'
                  title='Descrição detalhada'
                  content='As recompensas são liquidadas toda segunda-feira'
                />
              )
            }
          </div>
        </div>
      </MobileTableContainer>
    </div>
  )
}
