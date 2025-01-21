import './index.scss';
import isEqual from 'lodash/isEqual';
import Icon from '@libs/mode2/components/Icon';
import { useMemo } from 'react';
import { Progress } from 'antd';
import { renderI18N } from '@libs/commonUtils/renderI18N';
import { formatMoney } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useRecordPageBalanceReportStore } from '@libs/mode2/zustand/page/recordPageStore';

const BetBalanceReportProgress = () => {
  const { t } = useTranslation();
  const reportGameList = useRecordPageBalanceReportStore(
    (state) => state.reportGameList
  );

  const selectProgressInfo = useRecordPageBalanceReportStore(
    (state) => state.selectProgressInfo
  );

  const setSelectProgressInfo = useRecordPageBalanceReportStore(
    (state) => state.setSelectProgressInfo
  );

  const selectProgressInfoName = useMemo(
    () =>
      typeof selectProgressInfo?.name === 'string'
        ? selectProgressInfo.name
        : selectProgressInfo
        ? renderI18N(selectProgressInfo?.name, t)
        : '',
    [selectProgressInfo, t]
  );

  const handleClickOutside = () => {
    setSelectProgressInfo(null);
  };

  return (
    <div
      className="flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="flex gap-8">
        {reportGameList.map((data, index) => {
          return (
            <div
              key={index}
              className="relative flex flex-col gap-1 items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectProgressInfo(data);
              }}
            >
              <div className="my-progress relative w-full mobile:h-[198px] h-[156px]">
                <Progress
                  className="report-amount-progress"
                  percent={(data.balance / data.totalBalance) * 100}
                  showInfo={false}
                  style={
                    isEqual(selectProgressInfo?.name, data.name)
                      ? {
                          borderRadius: '4px',
                          border: '1px solid var(--grayscale-70)',
                        }
                      : {border: '1px solid #00000000'}
                  }
                />
              </div>

              <Icon
                className="w-6 h-6 mobile:w-9 mobile:h-9"
                name={data.icon}
              />
              {selectProgressInfo?.name === data.name ? (
                <div
                  className="absolute flex flex-col bgi-[var(--base-1-main)]
                      top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
                      text-center rounded
                      mobile:py-1 mobile:px-4 p-1
                      shadow-[0px_0px_4px_0px_#00000040]"
                >
                  <div className="mobile:text-sm text-xs font-medium bgi-text-[var(--grayscale-100)]">{selectProgressInfoName}</div>
                  <div className="mobile:text-base text-xs mobile:font-medium font-semibold bgi-text-[var(--linear-2)]">
                    {formatMoney(selectProgressInfo.balance, true)}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BetBalanceReportProgress;
