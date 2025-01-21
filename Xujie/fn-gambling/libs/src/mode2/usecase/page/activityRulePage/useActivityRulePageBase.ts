import { useActivityRulePageHeaterSetting } from '@mode2/usecase/page/activityRulePage/useActivityRulePageHeaterSetting';
import useActivityRulePageFooterSetting from '@mode2/usecase/page/activityRulePage/useActivityRulePageFooterSetting';
import useActivityRulePageInit from '@mode2/usecase/page/activityRulePage/useActivityRulePageInit';
import { useMode2PageResetFloatActionButton } from '@mode2/usecase/page/useMode2PageResetFloatActionButton';

export const useActivityRulePageBase = () => {
  useActivityRulePageInit();

  useActivityRulePageHeaterSetting();

  useActivityRulePageFooterSetting();

  // ==== ActivityRulePage FloatActionButton reset
  useMode2PageResetFloatActionButton();
};
