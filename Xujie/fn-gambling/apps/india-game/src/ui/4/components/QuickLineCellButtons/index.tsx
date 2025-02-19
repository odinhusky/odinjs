import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MyPageBtnListScenarios,
  useMyPageStore,
} from '@mode2/zustand/page/myPageStore';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import RedDot from '@components/RedDot';
import Icon from '@components/Icon';

const QuickLineCellButtons = memo(() => {
  const { t } = useTranslation();
  const usageScenariosList = useMyPageStore(
    (state) => state.usageScenariosList
  );
  const lineBtnList =
    usageScenariosList.find((item) => {
      return item.scenarios === MyPageBtnListScenarios.V6_VERSION_DEFAULT;
    })?.usageScenariosList || [];

  return (
    <div className="flex flex-col gap-3">
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx(
              'flex items-center justify-between border-b pb-3 border-[var(--transparent-white-10)]'
            )}
            onClick={(e) => {
              e.stopPropagation();
              item.onAction();
            }}
          >
            {/* TODO icon */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bgi-[var(--base-2-variant7)] rounded-full">
                <Icon className="w-6 h-6" name={`ic_${item.iconName}`} />
              </div>

              <div className="text-lg font-medium flex items-center bgi-text-[var(--base-1-variant4)]">
                {renderI18N(item.name, t)}
                {item.isShowRedDot ? (
                  <RedDot className={'animate-none w-2 h-2 ml-1'} />
                ) : null}
              </div>
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
