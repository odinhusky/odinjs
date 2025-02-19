import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import { handleSettingPageSwitchClick } from '../settingPageAction/actionType';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import {
  SettingPageMusicSwitchTypes,
  useSettingPageStore,
} from '@libs/mode2/zustand/page/settingPageStore';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleSettingPageSwitchClick]: { value: SettingPageMusicSwitchTypes };
};

export interface HandleSettingPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSettingPageAction = () => {
  const setMusicSwitch = useSettingPageStore((state) => state.setMusicSwitch);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSettingPageSwitchClick]: ({ value }) => {
      handleGlobalClick({
        target: handleSettingPageSwitchClick,
        callback: () => {
          setMusicSwitch(value);
        },
      });
    },
  };

  const handleSettingPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSettingPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSettingPageClick,
  };
};

export default useSettingPageAction;
