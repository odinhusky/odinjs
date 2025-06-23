import useInboxDetailPageButtons from './useInboxDetailPageButtons';
import useInboxDetailPageHeaderSettingOverride from './useInboxDetailPageHeaderSettingOverride';

export const useMode2InboxDetailPageBase = () => {
  useInboxDetailPageHeaderSettingOverride();
  useInboxDetailPageButtons();
};

export default useMode2InboxDetailPageBase;
