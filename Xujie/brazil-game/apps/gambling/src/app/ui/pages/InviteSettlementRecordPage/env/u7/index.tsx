import moment, { Moment } from 'moment/moment';
import { DatePicker } from 'antd';
import { useAllowLoginRouterRules } from '../../../../router/hooks/useAllowLoginRouterRules';
import { useNavigate } from 'react-router';
import { useLazyGetUserInviteRewardRecordQuery } from '../../../../../external';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { formatLocaleMoney } from '../../../../utils/format';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { PageContainer } from '../../../../components-bs/PageContainer';
import RangeDatePicker from '../../../../components-bs/DatePickers/RangeDatePicker';
import { environment } from '../../../../../../environments/environment';
import { datePickerStyle } from '../../../../components-bs/DatePickers/DatePicker';
import '../u7/index.scss';
import cx from '../../../../utils/cx';
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from '../../../../components-bs/InfiniteTable';
import { GetRewardRecordData } from '../../../../../external/endpoint/invite/userInvite/GetUserInviteEndpoint';
import { ClockCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

type IInviteSettlementRecord = {
  key: string;
  updateDate: string;
  bonus: string;
};

const TableHeader = ['Hora De Entrada', 'Bônus'];

export const InviteSettlementRecordPage = () => {
  useAllowLoginRouterRules();

  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const [triggerGetUserInviteReward, { currentData }] =
    useLazyGetUserInviteRewardRecordQuery();
  const min = moment().subtract(7, 'days');
  const max = moment();
  const dateFormat = 'YYYY-MM-DD hh:mm:ss';
  const [dates, setDates] = useState([min, max]);

  const refresh = useCallback((startTime: string, endTime: string) => {
    if (!AppLocalStorage.getItem(AppLocalStorageKey.userId)) return;
    triggerGetUserInviteReward({
      userId: AppLocalStorage.getItem(AppLocalStorageKey.userId) || '',
      pageNum: '1',
      pageSize: '10000',
      startTime,
      endTime,
    });
  }, []);

  const columns: TInfiniteTableColumn<IInviteSettlementRecord>[] = [
    {
      title: TableHeader[0],
      thClassName: `px-5`,
      dataIndex: 'updateDate',
      className: `py-2 text-[var(--grayscale-80)]`,
      render: (record: any) => `${record.updateDate}`,
    },
    {
      title: TableHeader[1],
      thClassName: `px-5 `,
      dataIndex: 'bonus',
      className: `py-2 text-[var(--grayscale-80)]`,
      render: (record: any) => `${record.bonus}`,
    },
  ];

  useEffect(() => {
    refresh(dates[0].format(dateFormat), dates[1].format(dateFormat));
  }, [dates]);

  const transformData = (
    records: GetRewardRecordData[]
  ): IInviteSettlementRecord[] => {
    return records.map((item: GetRewardRecordData, index: number) => {
      return {
        key: `${index}`,
        updateDate: moment(item.updateTime).format('DD.MM-YYYY HH:mm:ss'),
        bonus: `R$: ${formatLocaleMoney(item.reward / 100)}`,
      };
    });
  };

  const datasource = useMemo(() => {
    return transformData(currentData?.rows || []);
  }, [currentData?.rows]);

  return (
    <PageContainer id={'game-record-section'} className="text-white">
      <BackNavigation onClick={() => navigate(-1)} />
      <div
        className={cx(
          'flex mobile:flex-row flex-col justify-between gap-3 items-center',
          'mt-8 mb-5 '
        )}
      >
        <button
          className={cx(
            'border-popup-button linear-2-button rounded-full',
            'flex justify-center items-center',
            'py-2 px-5',
            'text-[var(--grayscale-100)] text-sm font-bold'
          )}
          onClick={() => {
            refresh(dates[0].format(dateFormat), dates[1].format(dateFormat));
          }}
        >
          {'Registros de liquidação'}
        </button>

        {isMobile && (
          <div
            className={
              'text-sm font-medium flex items-center rounded-full bg-[var(--grayscale-15)] py-2 px-3 hover:bg-[var(--grayscale-30)] focus-within:bg-[var(--grayscale-20)]'
            }
          >
            <ClockCircleFilled
              className={'text-xl text-[var(--grayscale-100)] -mt-1'}
            />
            <RangeDatePicker
              min="2023-01-01"
              max={max.format('YYYY-MM-DD')}
              className={
                'text-sm !text-[var(--grayscale-70)] bg-[var(--grayscale-15)]'
              }
              onConfirm={(values) =>
                setDates([
                  moment(values[0], 'YYYY-MM-DD'),
                  moment(values[1], 'YYYY-MM-DD'),
                ])
              }
              value={[
                dates[0].format('YYYY-MM-DD'),
                dates[1].format('YYYY-MM-DD'),
              ]}
            />
          </div>
        )}
        {!isMobile && (
          <RangePicker
            value={[dates[0], dates[1]]}
            allowClear={false}
            format="YYYY-MM-DD"
            separator={' - '}
            onChange={(dates) => {
              if (dates) {
                setDates(dates as Moment[]);
              }
            }}
            suffixIcon={false}
            className="bg-[var(--grayscale-15)] hover:bg-[var(--grayscale-30)] focus-within:bg-[var(--grayscale-20)] 
            focus-within:shadow-none before:translate-y-0.5 
            before:mr-2 before:content-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADkSURBVHgBrZWNDYIwEIWvTIAb1A3cxG5QNtANYAMcQSdgFEaoG+gG552p4UfoXQlf8mjSvHsh16MALICIJakidaSAA33c86CFzI70QpkgBpPhhvk0a2ENbqedh1VCwYV0FTyOs0wMDLTYRDds9IaE5006Fvx2QpiWknQu+AH74TjQwn6cDHdTYbQg9/BLAToOxpgnrQ/RidNPaw322Oi/J3w9GzrUERShnWaoc0L972bRXAaT0Fg32R/30WEeAf9b5eeH0+J26rUTrzGfVhqjCnWjxH13oAWHX0A/Cglxz5PKpboPs8FL0YwrZ74AAAAASUVORK5CYII=')]"
            style={datePickerStyle}
            disabledDate={(current) => current > max}
          />
        )}
      </div>

      <div
        className={cx(
          'flex flex-col',
          'rounded-lg border-stroke-popup h-[500px]'
        )}
      >
        <InfiniteTable<IInviteSettlementRecord>
          className={'bg-linear-4-main'}
          headerClassName={'text-[var(--grayscale-100)] font-medium text-pretty text-xs tablet:text-sm bg-[var(--transparent-black-10)]'}
          tbodyTrClassName={''}
          rowKey="key"
          datasource={datasource}
          columns={columns}
          totalCount={datasource.length}
        />
      </div>
    </PageContainer>
  );
};
