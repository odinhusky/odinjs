import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MyPageBtnListScenarios,
  useMyPageStore,
} from '@mode2/zustand/page/myPageStore';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import RedDot from '@components/RedDot';

const QuickLineCellButtons = memo(() => {
  const { t } = useTranslation();
  const usageScenariosList = useMyPageStore(
    (state) => state.usageScenariosList
  );
  const lineBtnList =
    usageScenariosList.find((item) => {
      return item.scenarios === MyPageBtnListScenarios.GIFT_CODE;
    })?.usageScenariosList || [];

  return (
    <div
      className={cx(
        'flex flex-col my-4 bgi-[var(--grayscale-10)] rounded p-3',
        'text-sm font-medium mobile:text-base'
      )}
    >
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx('', {
              'bgi-border-b-[var(--base-2-main)] pb-px': item.isBorder,
            })}
            onClick={item.onAction}
          >
            <div className="bgi-[var(--grayscale-10)] rounded-b-lg flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Icon
                  className="w-6 h-6"
                  name={`ic_${item.iconName}`}
                  color={item && item.color ? item.color : 'var(--base-2-main)'}
                />
                <span className="bgi-text-[var(--base-2-main)]">
                  {renderI18N(item.name, t)}
                </span>
              </div>

              <div className="item-txt flex items-center gap-1">
                {item.isShowRedDot ? (
                  <RedDot size="8" className={'animate-none w-2 h-2'} />
                ) : null}
              </div>

              {item.isShowArrow ? (
                <Icon
                  className="w-4 h-4"
                  name="ic_arrow_right_1"
                  color="var(--base-2-main)"
                />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default QuickLineCellButtons;
