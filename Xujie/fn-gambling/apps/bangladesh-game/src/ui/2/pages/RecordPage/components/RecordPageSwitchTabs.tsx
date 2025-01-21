import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import { handleRecordPageTabClick } from '@mode2/action/recordPageAction/acitonType';
import useRecordPageActions from '@mode2/action/recordPageAction/useRecordPageActions';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  RecordPageTabs,
  useRecordPageStore,
} from '@mode2/zustand/page/recordPageStore';

interface PageTabSwitchButtonProps {
  isActive: boolean;
  title: string;
  icon: string;
  onButtonClick: () => void;
}

const PageTabSwitchButton = (props: PageTabSwitchButtonProps) => {
  const { isActive, title, icon, onButtonClick } = props;
  return (
    <button
      key={title}
      className={cx('page-btn', {
        'page-btn-select': isActive,
      })}
      onClick={onButtonClick}
    >
      <img src={icon} alt="record" />
      <div>{title}</div>
    </button>
  );
};

export const RecordPageSwitchTabs = () => {
  const { t } = useTranslation();
  const tabIndex = useRecordPageStore((state) => state.tabIndex);

  const { handleRecordPageClick } = useRecordPageActions();

  return (
    <div>
      <div className="page-tab">
        <PageTabSwitchButton
          isActive={tabIndex === RecordPageTabs.RECORD}
          title={t('leftnav_balance_record')}
          icon={getImgUrl(EResourceLevel.V, 'ic_balance_record')}
          onButtonClick={() => {
            handleRecordPageClick({
              actionName: handleRecordPageTabClick,
              payload: { index: RecordPageTabs.RECORD },
            });
          }}
        />
        <PageTabSwitchButton
          isActive={tabIndex === RecordPageTabs.REPORT}
          title={t('leftnav_balance_report')}
          icon={getImgUrl(EResourceLevel.V, 'ic_balance_report')}
          onButtonClick={() => {
            handleRecordPageClick({
              actionName: handleRecordPageTabClick,
              payload: { index: RecordPageTabs.REPORT },
            });
          }}
        />
      </div>
    </div>
  );
};

export default RecordPageSwitchTabs;
