import cx from '@commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';

interface BoxDataTable {
  headTitle: I18NContent;
  subtitle?: string;
  boxClass?: string;
  headClass?: string;
  bodyClass?: string;
  bodyBoxClass?: string;
  headTitleClass?: string;
  subtitleClass?: string;
  bodyTitleClass?: string;
  bodyValueClass?: string;
  bodyData: {
    bodyTitle: I18NContent;
    bodyValue: number | string;
  }[];
  renderBody?: (data: number | string) => JSX.Element;
}

export const TeamDataTableBox = ({
  headTitle = { i18nKey: '' },
  subtitle = '',
  boxClass = '',
  headClass = '',
  bodyClass = '',
  bodyBoxClass = '',
  headTitleClass = '',
  subtitleClass = '',
  bodyTitleClass = '',
  bodyValueClass = '',
  bodyData = [],
  renderBody = (value: number | string) => <div>{value.toLocaleString()}</div>,
}: BoxDataTable) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        'w-full',
        'tablet:rounded-lg rounded',
        'font-medium text-center',
        'bgi-[var(--grayscale-100)]',
        'px-3 py-2 mobile:px-6 mobile:py-3',
        boxClass
      )}
    >
      <div
        className={cx(
          'border-b-[var(--grayscale-80)]',
          'border-b border-solid',
          'w-full',
          FLEX_ITEMS_CENTER,
          'flex-row justify-between',
          'pb-1 mobile:pb-3',
          'mb-3',
          headClass
        )}
      >
        <div
          className={cx(
            'text-sm mobile:text-lg',
            'bgi-text-[var(--grayscale-50)]',
            'font-medium text-center',
            headTitleClass
          )}
        >
          {renderI18N(headTitle, t)}
        </div>

        <div
          className={cx(
            'text-xs mobile:text-sm',
            'bgi-text-[var(--grayscale-50)]',
            'text-center',
            subtitleClass
          )}
        >
          {subtitle}
        </div>
      </div>
      <div
        className={cx(
          'w-full grid',
          {
            'grid-cols-3': bodyData.length === 3,
            'grid-cols-2': bodyData.length === 2,
          },
          'gap-2 mobile:gap-3',
          bodyClass
        )}
      >
        {bodyData.map((data, index) => {
          return (
            <div
              className={cx(bodyBoxClass)}
              key={renderI18N(data.bodyTitle, t)}
            >
              <div
                className={cx(
                  /**
                   * 參照舊包v2判斷方式
                   */
                  {
                    'text-sm mobile:text-base tablet:text-lg':
                      String(data.bodyValue).length > 12,
                    'text-xs mobile:text-sm tablet:text-base':
                      String(data.bodyValue).length < 12 &&
                      String(data.bodyValue).length > 8,
                    'text-xl mobile:text-2xl':
                      String(data.bodyValue).length < 8,
                  },
                  'bgi-text-[var(--grayscale-00)]',
                  'font-medium text-center',
                  'break-words',
                  bodyValueClass
                )}
              >
                {renderBody != undefined
                  ? renderBody(data.bodyValue)
                  : data.bodyValue}
              </div>

              <div
                className={cx(
                  'text-xs mobile:text-sm',
                  'bgi-text-[var(--grayscale-70)]',
                  bodyTitleClass
                )}
              >
                {data.bodyTitle ? renderI18N(data.bodyTitle, t) : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDataTableBox;
