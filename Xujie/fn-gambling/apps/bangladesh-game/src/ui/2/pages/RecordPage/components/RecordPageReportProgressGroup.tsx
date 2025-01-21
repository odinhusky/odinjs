import { formatMoney } from '@mode2/utils';
import { useRecordPageBalanceReportStore } from '@mode2/zustand/page/recordPageStore';
import { Progress } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@libs/mode2/components/Icon';

export const RecordPageReportProgressGroup = () => {
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
    <div className="tab-progress" onClick={handleClickOutside}>
      <div className="progress-group">
        {reportGameList.map((data, index) => {
          return (
            <div
              key={index}
              className="progress-item"
              onClick={(e) => {
                e.stopPropagation();
                setSelectProgressInfo(data);
              }}
            >
              <div className="progress">
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
                      : {}
                  }
                />
              </div>

              <Icon
                className="w-6 h-6 mobile:w-9 mobile:h-9"
                name={data.icon}
                color="var(--base-2-main)"
              />
              {selectProgressInfo?.name === data.name ? (
                <div className="tips">
                  <div className="tips_txt1">{selectProgressInfoName}</div>
                  <div className="tips_txt2">
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

export default RecordPageReportProgressGroup;
