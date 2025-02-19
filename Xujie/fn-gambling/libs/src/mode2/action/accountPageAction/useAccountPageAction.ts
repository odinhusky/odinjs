import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleAccountPageCopyClick,
  handleAccountPageInviteChange,
  handleAccountPageLoginPasswordChange,
  handleAccountPageModalClose,
  handleAccountPageNicknameChange,
  handleAccountPageSaveGenderClick,
  handleAccountPageSaveInviteCodeClick,
  handleAccountPageSaveLoginPasswordClick,
  handleAccountPageSaveNicknameClick,
  handleAccountPageShowModalClick,
} from './acitonType';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import {
  AccountPageGenderTypes,
  AccountPageModalTitleTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { message } from 'antd';
import { useClipboard } from '@libs/commonUtils';

type ActionClickPayloadMap = {
  [handleAccountPageShowModalClick]: { value: AccountPageModalTitleTypes };
  [handleAccountPageCopyClick]: { value: string };
  [handleAccountPageModalClose]: void;
  [handleAccountPageSaveInviteCodeClick]: void;
  [handleAccountPageSaveLoginPasswordClick]: void;
  [handleAccountPageSaveGenderClick]: { gender: AccountPageGenderTypes };
  [handleAccountPageNicknameChange]: { value: string };
  [handleAccountPageInviteChange]: { value: string };
  [handleAccountPageLoginPasswordChange]: {
    value: string;
    type: string;
  };
  [handleAccountPageSaveNicknameClick]: void;
};

export interface HandleAccountPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useAccountPageAction = () => {
  // const {} = useNavPageClick();
  const setModalTitle = useAccountPageStore((state) => state.setModalTitle);
  const setShowEditModal = useAccountPageStore(
    (state) => state.setShowEditModal
  );
  const setNickname = useAccountPageStore((state) => state.setNickname);
  const setGender = useAccountPageStore((state) => state.setGender);
  const setReferCode = useAccountPageStore((state) => state.setReferCode);
  const loginForm = useAccountPageStore((state) => state.loginForm);
  const setLoginForm = useAccountPageStore((state) => state.setLoginForm);

  const { copyToClipboard } = useClipboard();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleAccountPageShowModalClick]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageShowModalClick,
        callback: () => {
          setShowEditModal(true);
          setModalTitle(value);
        },
      });
    },
    [handleAccountPageCopyClick]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageCopyClick,
        callback: () => {
          copyToClipboard(value);
        },
      });
    },
    [handleAccountPageModalClose]: () => {
      handleGlobalClick({
        target: handleAccountPageModalClose,
        callback: () => {
          setShowEditModal(false);
        },
      });
    },
    [handleAccountPageSaveInviteCodeClick]: () => {
      handleGlobalClick({
        target: handleAccountPageSaveInviteCodeClick,
        callback: () => {
          // TODO
          message.info(`TODO 綁定邀請碼 `);
        },
      });
    },
    [handleAccountPageSaveLoginPasswordClick]: () => {
      handleGlobalClick({
        target: handleAccountPageSaveLoginPasswordClick,
        callback: () => {
          // TODO
          message.info(`TODO 綁定登錄密碼 `);
        },
      });
    },
    [handleAccountPageSaveGenderClick]: ({ gender }) => {
      handleGlobalClick({
        target: handleAccountPageSaveGenderClick,
        callback: () => {
          // TODO
          message.info(`TODO 修改性別 ${gender}`);
          setShowEditModal(false);
          setGender(gender);
        },
      });
    },
    [handleAccountPageSaveNicknameClick]: () => {
      handleGlobalClick({
        target: handleAccountPageSaveNicknameClick,
        callback: () => {
          // TODO
          message.info(`TODO 編輯暱稱 `);
        },
      });
    },
    [handleAccountPageNicknameChange]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageNicknameChange,
        callback: () => {
          setNickname(value);
        },
      });
    },
    [handleAccountPageInviteChange]: ({ value }) => {
      handleGlobalClick({
        target: handleAccountPageInviteChange,
        callback: () => {
          setReferCode(value);
        },
      });
    },
    [handleAccountPageLoginPasswordChange]: ({ value, type }) => {
      handleGlobalClick({
        target: handleAccountPageLoginPasswordChange,
        callback: () => {
          setLoginForm({ ...loginForm, [type]: value });
        },
      });
    },
  };

  const handleAccountPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleAccountPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleAccountPageClick,
  };
};

export default useAccountPageAction;
