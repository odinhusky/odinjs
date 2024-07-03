import React from 'react';
import {environment} from '../../../../../../environments/environment'
import { isEmpty } from "lodash";
import cx from "classnames";


interface GamePaginationProps {
  currentPage: number;
  paginationList: number[];
  totalPages: number;
  goToPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  containerClass?: string;
}

export const GamePagination = (
  {
    currentPage,
    paginationList,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    containerClass = ''
  }: GamePaginationProps
) => {

  const flexCenterClass = 'flex justify-center items-center';
  const activeClass = 'active:border-[var(--grayscale-100)] active:bg-[var(--grayscale-20)]';
  const borderDefaultClass = 'border border-[var(--grayscale-50)] border-solid';

  return (
    <div className={cx(
        'w-full h-8',
        `${flexCenterClass}`,
        'text-white',
        `${containerClass}`
      )}
    >
      <button 
        className={cx(
          'w-8 h-8',
          `${flexCenterClass}`,
          'rounded-lg',
          `${borderDefaultClass}`,
          `${activeClass}`,
          'mr-3'
        )}
        onClick={
          currentPage === 1 
            ? () => {} 
            : () => { goToPreviousPage() }
        }
      >
        <img className="w-2 h-3" src={`assets/${environment.uVersion}/${environment.mVersion}/icon_pagination_left.png`} />
      </button>

      {
        !isEmpty(paginationList) 
          ? paginationList.map(item => (
            <button 
              key={`page-${item}`}
              className={cx(
                'w-12 h-8',
                `${flexCenterClass}`,
                'rounded-lg',
                `${borderDefaultClass}`,
                'mr-3',
                `${currentPage === item ? 'bg-[var(--grayscale-20)]' : ''}`,
                `${activeClass}`
              )}
              style={currentPage === item ? {borderColor: 'white'} : {}}
              onClick={() => { goToPage(item) }}
            >
              {item}
            </button>
          )) : (
            <button
              className={cx(
                'w-12 h-8',
                `${flexCenterClass}`,
                'rounded-lg',
                `${borderDefaultClass}`,
                'mr-3',
              )}
              onClick={() => { goToPage(1) }}
            >1</button>
          )
      }

      <button 
        className={cx(
          'w-8 h-8',
          `${flexCenterClass}`,
          'rounded-lg',
          `${borderDefaultClass}`,
          `${activeClass}`
        )}
        disabled={currentPage === totalPages}
        onClick={
          currentPage === totalPages 
            ? () => {} 
            : () => { goToNextPage() }
        }
      >
        <img className="w-2 h-3" src={`assets/${environment.uVersion}/${environment.mVersion}/icon_pagination_right.png`} />
      </button>
    </div>
  )
}

export default GamePagination;