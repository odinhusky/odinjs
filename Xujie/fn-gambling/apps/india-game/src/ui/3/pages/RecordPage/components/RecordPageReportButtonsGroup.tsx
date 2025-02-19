import { recordPageReportButtonsGroupColors } from '@mode2/zustand/page/recordPageStore';
import { formatMoney } from '@mode2/utils';
import { useRecordPageBalanceReportStore } from '@mode2/zustand/page/recordPageStore';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@components/Icon';

// TODO Ethan UI Style [RWD] 手機樣式多檢查
export const RecordPageReportButtonsGroup = () => {
  const { t } = useTranslation();
  const reportGameList = useRecordPageBalanceReportStore(
    (state) => state.reportGameList
  );

  return (
    <div className="tab-btns-group">
      {reportGameList.map((data, index) => {
        return (
          <div
            key={index}
            className="group-item"
            style={{
              backgroundImage: `${
                recordPageReportButtonsGroupColors[data.colorKey]
              },linear-gradient(114.3deg,#b3b3b3 2.49%,#808080 20.56%,#f3f3f3 56.7%,#5a5a5a 74.77%,#b4b4b4 92.84%)`,
            }}
          >
            <div className="sj1" />
            <div className="sj2" />
            <div className="item-top">
              {/* <Icon
                      name={data.name
                          .toLowerCase()
                          .replace(
                              /\b[a-z]/g,
                              function (match) {
                                  return match.toLocaleLowerCase();
                              }
                          )}
                  /> */}
              <Icon
                className="w-6 h-6 drop-shadow-[3px_3px_6px_#00000066]"
                name={data.icon}
              />
              <div>{renderI18N(data.name, t)}</div>
            </div>
            <div className="item-bottom items-center">
              <Icon className="w-6 h-6" name="ic_inr" />
              <div>{formatMoney(data.balance, true)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecordPageReportButtonsGroup;
