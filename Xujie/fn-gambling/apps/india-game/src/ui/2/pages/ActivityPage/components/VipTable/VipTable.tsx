import { cx } from '@libs/commonUtils';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';

export interface VipTableProps {
  theadTitles: string[];
  datas: Array<number[]>;
  styles?: React.CSSProperties[];
  isVipIcon?: boolean;
  style?: React.CSSProperties;
}

export const VipTable = ({
  theadTitles,
  datas,
  styles,
  isVipIcon, // 是否是需要顯示vip icon的table
  style,
}: VipTableProps) => {
  const renderColData = (index: number, value: number, rowIndex: number) => {
    if (isVipIcon) {
      if (index === 0) {
        return `VIP ${value}`;
      }

      const isLevelZeroIcon = rowIndex === 0 && value === 0;

      const iconSrc = isLevelZeroIcon
        ? 'vip_level_0_no_icon'
        : 'vip_level_' + value;
      return (
        <>
          <img
            className="h-[40px] w-[48px]"
            src={getImgUrl(EResourceLevel.V, iconSrc)}
            alt="vip"
          />
          {value > 0 && (
            <div
              className={cx(
                'ml-[8px] font-normal flex h-3 w-5 mobile:h-4 mobile:w-9 rounded bgi-[var(--base-2-main)] justify-center items-center bgi-text-[var(--grayscale-10)]',
                'text-xxxs mobile:text-xxs'
              )}
            >
              {`V${value}`}
            </div>
          )}
        </>
      );
    } else {
      const colData = index === 0 ? `VIP ${value}` : formatMoney(value);
      return colData;
    }
  };

  return (
    <div
      className="inline-flex flex-col justify-between w-full"
      style={{ WebkitBackgroundClip: 'text', ...style }}
    >
      <div className="flex justify-between items-center gap-1 mobile:gap-3 p-1 mobile:p-3 rounded-t-lg bgi-[var(--grayscale-15)] border-b border-[var(--grayscale-30)] text-xs mobile:text-base font-medium bgi-text-[var(--grayscale-50)]">
        {theadTitles.map((name, index) => {
          return (
            <div key={index} className="w-full text-center">
              {name}
            </div>
          );
        })}
      </div>
      {datas.map((rowData, rowIndex) => {
        const rowDataContainerClass =
          'flex justify-between gap-3 py-2 px-3 text-xs font-medium mobile:text-base';
        return (
          <div
            key={rowIndex}
            className={cx(rowDataContainerClass, {
              'bgi-[var(--grayscale-20)]': rowIndex % 2 === 0,
              'bgi-[var(--grayscale-25)]': rowIndex % 2 !== 0,
            })}
          >
            {rowData.map((colData: number, colIndex: number) => {
              return (
                <div
                  key={colIndex}
                  className="flex w-full justify-center items-center"
                  style={styles?.[colIndex]}
                >
                  {renderColData(colIndex, colData, rowIndex)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default VipTable;
