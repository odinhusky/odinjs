import { formatDate, formatNumber } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { useRecordState } from '@pages/RecordPage/RecordStateMapping';
import { useRecordPageBalanceRecordStore } from '@mode2/zustand/page/recordPageStore';
import NoData from '@components/NoData';


const RecordPageRecordTransferTable = () => {
  const { getRecordStateValue } = useRecordState();
  const fundTransferRecordList = useRecordPageBalanceRecordStore(
    (state) => state.fundTransferRecordList
  );
  const itemClass =
    'flex justify-center items-center w-full py-1 bgi-text-[var(--grayscale-100)]';
  const textBaseClass =
    'text-center bgi-text-[var(--grayscale-100)] font-medium text-[12px] leading-[16px] mobile:text-[16px] mobile:leading-[24px]';


  return (
    <div className="bgi-[var(--grayscale-20)] max-h-[576px] overflow-y-auto rounded-b-[8px]">
      {fundTransferRecordList.map((item, index) => {
        return (
          <div
            key={index}
            className={cx(
              'grid grid-cols-[1fr_1fr_2fr] mobile:grid-cols-3 gap-1 mobile:gap-3',
              'h-[48px]'
            )}
          >
            <div
              className={cx(
                itemClass,
                textBaseClass,
                'flex-wrap mobile:flex-nowrap'
              )}
            >
              {formatDate(item.timestamp)}
            </div>
            <div
              className={cx(
                itemClass,
                textBaseClass,
                'flex-wrap mobile:flex-nowrap',
                {
                  'bgi-text-[var(--state-error-main)]': item.isAssetIncreasing,
                  'bgi-text-[var(--state-success-main)]': !item.isAssetIncreasing
                }
              )}
            >
              {
                getRecordStateValue(item.operate)
              }
            </div>
            <div className={cx('text-center', itemClass)}>
              <span className={textBaseClass}>
                {formatNumber(item.beforeBalance, true)}
              </span>

              <span
                className={cx('px-1', textBaseClass, {
                  'bgi-text-[var(--state-error-main)]': item.isAssetIncreasing,
                  'bgi-text-[var(--state-success-main)]': !item.isAssetIncreasing
                })}
              >
                {'>'}
              </span>
              <span className={textBaseClass}>
                {formatNumber(item.afterBalance, true)}
              </span>
            </div>
          </div>
        );
      })}
      {!fundTransferRecordList || fundTransferRecordList.length === 0 ? (
        <NoData />
      ) : null}
    </div>
  );
};

export default RecordPageRecordTransferTable;
