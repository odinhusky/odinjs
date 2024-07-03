import cx from 'apps/gambling/src/app/ui/utils/cx';
import { RecordBtnStateType, RecordBtnType } from './LuckyWheelRecords';
import { renderByUVersion } from '../../../../utils/renderByUVersion';
import { Dispatch, SetStateAction } from 'react';

import LuckyWheelRecordSwitchBtnsP1 from '../env/p1/LuckyWheelRecordSwitchBtnsP1';
import LuckyWheelRecordSwitchBtnsU1 from '../env/u1/LuckyWheelRecordSwitchBtnsU1';
import LuckyWheelRecordSwitchBtnsU2 from '../env/u2/LuckyWheelRecordSwitchBtnsU2';
import LuckyWheelRecordSwitchBtnsU5 from '../env/u5/LuckyWheelRecordSwitchBtnsU5';
import LuckyWheelRecordSwitchBtnsU6 from '../env/u6/LuckyWheelRecordSwitchBtnsU6';
import LuckyWheelRecordSwitchBtnsU7 from '../env/u7/LuckyWheelRecordSwitchBtnsU7';

export interface LuckyWheelRecordSwitchBtnsProps {
  recordBtns: RecordBtnType[];
  activeRecordBtn: RecordBtnStateType;
  setActiveRecordBtn: Dispatch<SetStateAction<RecordBtnStateType>>;
}

export const LuckyWheelRecordSwitchBtns = (
  props: LuckyWheelRecordSwitchBtnsProps
) => {
  return renderByUVersion(
    {
      p1: <LuckyWheelRecordSwitchBtnsP1 {...props} />,
      u1: <LuckyWheelRecordSwitchBtnsU1 {...props} />,
      u2: <LuckyWheelRecordSwitchBtnsU2 {...props} />,
      u5: <LuckyWheelRecordSwitchBtnsU5 {...props} />,
      u6: <LuckyWheelRecordSwitchBtnsU6 {...props} />,
      u7: <LuckyWheelRecordSwitchBtnsU7 {...props} />,
    },
    <LuckyWheelRecordSwitchBtnsU1 {...props} />
  );
};

export default LuckyWheelRecordSwitchBtns;
