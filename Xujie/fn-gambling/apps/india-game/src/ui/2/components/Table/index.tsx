import cx from '@commonUtils/cx';
import Mode2Table from '@mode2/components/Table';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Icon from '@components/Icon';
export * from '@mode2/components/Table';

const Table: typeof Mode2Table = ({ fetchData, ...rest }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  // 如果有給pageSize就使用分頁顯示模式, 還是會一次拿完所有資料,只是動態調整顯示數量
  const displayedEnd = rest.pageSize
    ? page * rest.pageSize
    : rest.dataSource.length;

  const displayedDataSource = rest.dataSource.slice(0, displayedEnd);

  const handleLoadMoreClick = () => {
    if (fetchData) fetchData();

    setPage(page + 1);
  };

  const isLoadMoreButtonDisabled = rest.isFinish;
  const isLoadAllPageDataFinished =
    !rest.pageSize || (rest.pageSize && displayedEnd >= rest.dataSource.length);

  useEffect(() => {
    if (page > 1) {
      setPage(1);
    }
  }, [rest.dataSource]);

  return (
    <>
      <Mode2Table
        {...rest}
        dataSource={displayedDataSource}
        fetchData={undefined}
        classNames={rest?.classNames}
      />
      {(fetchData || !isLoadAllPageDataFinished) && (
        <button
          className={cx(
            'flex flex-row items-center justify-center gap-1 reounded bgi-[var(--grayscale-15)] py-1 px-4 mobile:py-2 mobile:px-4 text-sm mobile:text-base w-full mt-2.5',
            'hover:bgi-[var(--grayscale-20)] active:bgi-[var(--grayscale-10)] disabled:bgi-[var(--transparent-gray-30)]',
            rest.btnClassName?.btnClass
          )}
          disabled={isLoadMoreButtonDisabled}
          onClick={handleLoadMoreClick}
        >
          <div
            className={cx(
              isLoadMoreButtonDisabled
                ? 'bgi-text-[var(--transparent-white-30)]'
                : 'bgi-text-[var(--base-2-main)]',
              rest.btnClassName?.textClass
            )}
          >
            {t('home_btn_load_more')}
          </div>
          <Icon
            className={cx('w-5 h-5', rest.btnClassName?.iconClass)}
            name="ic_arrow_down_2"
            color={
              rest.btnClassName?.iconColor
                ? rest.btnClassName?.iconColor
                : isLoadMoreButtonDisabled
                ? 'var(--transparent-white-30)'
                : 'var(--base-2-main)'
            }
          />
        </button>
      )}
    </>
  );
};
export default Table;
