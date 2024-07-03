import BaseBtn from "apps/gambling/src/app/ui/components-bs/Buttons/BaseBtn";
import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { Dispatch, SetStateAction } from "react";

interface WalletRecordTableControlProps {
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const WalletRecordTableControl = ({
  page,
  totalPage,
  setPage,
}: WalletRecordTableControlProps) => {

  const handlePrevPage = () => {
    if(page <= 1) return;
    setPage(prev => prev - 1)
  };

  const handleNextPage = () => {
    if(page < totalPage) {
      setPage(prev => prev + 1)
    }
  };

  const btns = [
    {
      id: 1,
      label: t['Back'],
      active: page >= 2,
      onClick: () => {
        if(page >= 2) {
          handlePrevPage();
        }
      }
    },
    {
      id: 2,
      label: t['Next'],
      active: page < totalPage,
      onClick: () => {
        if(page < totalPage) {
          handleNextPage();
        }
      }
    }
  ];

  return (
    <div 
      className={cx(
        'w-full',
        'flex justify-end items-center',
        'mobile:mt-4 tablet:mt-6'
      )}
    >
      {/* Page */}
      <div className={cx('flex items-center mobile:mr-[36px]')}>
        <span className={cx(
          'block',
          'text-xs leading-4 text-[var(--grayscale-80)',
          'mr-2'
        )}>{t['Page']}</span>

        <span className={cx(
          'block',
          FLEX_CENTER,
          'w-[35px] h-[28px]',
          'bg-[var(--grayscale-40)]',
          'rounded',
          'text-xs leading-4 text-[var(--grayscale-80)'
        )}>{page}</span>

        <span className={cx(
          'block',
          'mx-1',
          'text-xs leading-4 text-[var(--grayscale-80)'
        )}>/</span>      

        <span className={cx(
          'block',
          FLEX_CENTER,
          'w-[35px] h-[28px]',
          'text-xs leading-4 text-[var(--grayscale-90)'
        )}>{totalPage}</span>
      </div>

      {/* Buttons */}
      <div className={cx('flex items-center gap-3')}>
        {
          btns.map(btn => (
            <BaseBtn
              key={btn.id}
              btnClass={cx(
                'border-0',
                'rounded-lg',
                'bg-[var(--transparente-20)]',
                'min-w-[120px] h-[40px]',
                'cursor-default',
                FLEX_CENTER,
                {
                  'linear-2-button cursor-pointer': btn.active
                }
              )}
              childrenClass={cx(
                'text-[var(--grayscale-70)]',
                { 'text-white': btn.active }
              )}
              children={btn.label}
              onClick={btn.onClick}
            />
          ))
        }
      </div>
    </div>
  )
}

export default WalletRecordTableControl;