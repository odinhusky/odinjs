import React from 'react';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import Icon from '@mode2/components/Icon';

interface GameSectionHeaderProps {
  iconSrc: string;
  title: I18NContent;
  amount: number;
  isShowAmount: boolean;
  onAmountClick: () => void;
}

const GameSectionHeader = (props: GameSectionHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'mb-4',
        'bgi-[var(--linear-4)]',
        '-mx-4 mobile:-mx-5 tablet:mx-0',
        'relative',
        'h-9 mobile:h-11'
      )}
    >
      <img
        className={
          'absolute h-9 mobile:h-11 w-auto backdrop-opacity-50 object-cover'
        }
        src={getImgUrl(EResourceLevel.V, 'home_game_title_2')}
      />

      <img
        className={'absolute h-9 mobile:h-11 w-auto object-cover'}
        src={getImgUrl(EResourceLevel.V, 'home_game_title_1')}
      />

      <div
        className={cx(
          'absolute top-0 bottom-0 left-0 w-full',
          'text-base mobile:text-lg font-semibold',
          'flex items-center',
          'justify-between',
          'h-9 mobile:h-11',
          'px-4',
          'box-border',
          'bg-linear-4'
        )}
      >
        <div className="flex items-center">
          <Icon
            className="w-6 h-6 mobile:w-7 mobile:h-7 tablet:w-9 tablet:h-9 mr-1"
            name={props.iconSrc}
            color="var(--linear-2)"
          />
          <div
            className={cx(
              'bgi-text-[var(--linear-2)]',
              'text-base mobile:text-lg font-semibold',
              'c-linear-2'
            )}
          >
            {renderI18N(props.title, t)}
          </div>

          <div
            className={cx(
              'ml-2 h-auto rounded-full',
              'items-center',
              'text-xs mobile:text-base font-medium text-center',
              'bgi-[var(--transparent-gray-20)] py-0.5 px-2'
            )}
          >
            <div className={'bgi-text-[var(--base-2-main)] h-auto'}>
              {props.amount}
            </div>
          </div>
        </div>

        {props.isShowAmount && (
          <button
            type="button"
            className={cx(
              // 'bgi-[var(--base-1-main)]',
              'bgi-text-[var(--grayscale-100)]',
              'text-sm mobile:text-base',
              'px-4 py-1',
              'rounded',
              'font-medium text-white',
              'bg-base-1-main',
              'cursor-pointer'
            )}
            onClick={props.onAmountClick}
          >
            {t('home_btn_see_all')}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameSectionHeader;
