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
      return item.scenarios === MyPageBtnListScenarios.DEFAULT;
    })?.usageScenariosList || [];

  return (
    <div className="btnItems">
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx('item', {
              'item-border': item.isBorder,
            })}
            onClick={item.onAction}
          >
            <Icon
              className="w-6 h-6"
              name={`ic_${item.iconName}`}
              color={item && item.color ? item.color : 'var(--base-2-main)'}
            />

            <div className="item-txt flex items-center gap-1">
              {renderI18N(item.name, t)}
              {item.isShowRedDot ? (
                <RedDot className={'animate-none w-2 h-2'} />
              ) : null}
            </div>

            {item.isShowArrow ? (
              <Icon
                className="w-4 h-4"
                name="ic_arrow_right_1"
                color="var(--base-2-main)"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
});

export default QuickLineCellButtons;
