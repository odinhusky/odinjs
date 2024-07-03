import {renderByUVersion} from "../../../../utils/renderByUVersion";
import { RecordPanel as CRecordPanel } from "./env/u1/RecordPanel"
import { RecordPanel as P1RecordPanel } from "./env/p1/RecordPanel"
import { RecordPanel as RioRecordPanel } from './env/u2/RecordPanel'

type IRecordPanel = {
  recordPanelMode: 'deposit' | 'withdraw';
}

export const RecordPanel = (props: IRecordPanel) => {

  return renderByUVersion({
    "u1": <CRecordPanel {...props}/>,
    "u2": <RioRecordPanel {...props}/>,
    "p1": <P1RecordPanel {...props}/>,
  }, <CRecordPanel {...props}/>);
}




