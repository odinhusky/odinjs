import { useMemo, useState } from 'react';

// ? Types
import { GetUserLuckyWheelRecordsResponseData } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';
import { TInfiniteTableColumn } from '../../../../components-bs/InfiniteTable';

// - Components
import MyRecordsTable from './MyRecordsTable';

// ? Constant
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

// ^ Plugins
import t from 'apps/gambling/src/assets/constant/lang';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import OtherRecordsTable from './OtherRecordsTable';
import { environment } from 'apps/gambling/src/environments/environment';
import LuckyWheelRecordSwitchBtns from './LuckyWheelRecordSwitchBtns';
import { formatDenominatorValue } from '../../../../utils/format';
import capitalizeFirstLetter from '../../../../utils/capitalizeFirstLetter';

export type RecordBtnStateType = 'other' | 'my';

export interface RecordBtnType {
  id: string;
  label: string;
  state: RecordBtnStateType;
}

interface LuckyWheelRecordsProps {}

export const LuckyWheelRecords = ({}: LuckyWheelRecordsProps) => {
  const [activeRecordBtn, setActiveRecordBtn] =
    useState<RecordBtnStateType>('other');

  const recordBtns: RecordBtnType[] = [
    {
      id: 'otherRecordsBtn',
      label: t['otherRecords'],
      state: 'other',
    },
    {
      id: 'myRecordsBtn',
      label: t['myRecords'],
      state: 'my',
    },
  ];

  // = styles
  const colClassName = cx(
    'text-xs leading-4',
    'tab:text-base tab:leading-6',
    'w-initial',
    'p-1'
  );

  const thClass = cx(
    'h-[66px] phone:h-[40px]',
    {
      'phone:h-[48px]': environment.uVersion === 'u6',
      'bg-[var(--grayscale-15)] phone:h-[58px]': environment.uVersion === 'u7',
    },
    'text-xs leading-4',
    'font-normal'
  );

  const tdClass = cx(
    'h-[56px]',
    'font-normal',
    'text-xs leading-4',
    'tab:text-sm leading-5',
    {
      'bg-[var(--grayscale-20)]': environment.uVersion === 'u7',
    }
  );

  const columns: (
    type: RecordBtnStateType
  ) => TInfiniteTableColumn<GetUserLuckyWheelRecordsResponseData>[] = (type) =>
    useMemo(
      () => [
        {
          title: t['DateAndTime'],
          dataIndex: 'date',
          className: cx(colClassName, 'max-w-[97px] tab:max-w-[206px]'),
          thClassName: thClass,
          tdClassName: tdClass,
          render: (data) => {
            const level = data.level?.toLowerCase() || 'silver';
            return (
              <div
                className={cx(
                  FLEX_CENTER,
                  'gap-[5px] tab:gap-2',
                  'pl-2 tab:pl-0'
                )}
              >
                <img
                  className={cx(
                    'block',
                    'w-[24px] h-[24px]',
                    'tab:w-[40px] tab:h-[40px]'
                  )}
                  src={`assets/${environment.uVersion}/icon_wheel_${level}.png`}
                  alt="Level image"
                />

                <span className={cx('block', 'break-words')}>{data.date}</span>
              </div>
            );
          },
        },
        {
          title:
            type === 'other'
              ? `${t['wheelWinnerDescriptionP1']} ${t['wheelWinnerDescriptionP2']}`
              : t['wheelWinnerDescriptionP2'],
          dataIndex: 'description',
          className: cx(colClassName),
          thClassName: thClass,
          tdClassName: tdClass,
          render: (data) => {
            const desc = data.description?.trim() || '';
            return (
              <div className={cx('text-center')}>
                {type === 'my' ? capitalizeFirstLetter(desc) : data.description}
              </div>
            );
          },
        },
        {
          title: t['Reward'],
          dataIndex: 'rewardAmount',
          className: cx(colClassName),
          thClassName: thClass,
          tdClassName: tdClass,
          render: (data) => {
            return (
              <div
                className={cx({
                  'text-[var(--secondary-assistant)]':
                    environment.uVersion === 'u1',
                })}
              >
                {t['moneyWithRSign'](
                  formatDenominatorValue(data.rewardAmount || 0)
                )}
              </div>
            );
          },
        },
      ],
      [type]
    );

  return (
    <div>
      <LuckyWheelRecordSwitchBtns
        recordBtns={recordBtns}
        activeRecordBtn={activeRecordBtn}
        setActiveRecordBtn={setActiveRecordBtn}
      />

      <div className={cx('mt-4 tab:mt-5')}>
        <OtherRecordsTable
          columns={columns('other')}
          isShow={activeRecordBtn === 'other'}
        />

        <MyRecordsTable
          columns={columns('my')}
          isShow={activeRecordBtn === 'my'}
        />
      </div>
    </div>
  );
};

export default LuckyWheelRecords;
