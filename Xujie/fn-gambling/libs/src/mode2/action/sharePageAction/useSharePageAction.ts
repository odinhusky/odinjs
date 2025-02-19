import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  handleSharePageClipboardClick,
  handleSharePageSaveImageClick,
} from './actionType';
import handleGlobalClick from '../handleGlobalClick';
import { RefObject, useEffect } from 'react';
import { useClipboard, useDownloadSnapshotElement } from '@libs/commonUtils';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import { useMode2InviteEarnStore } from '@libs/mode2/zustand/page/invitePageStore';
import {
  SharePosterType,
  useMode2SharePageStore,
} from '@libs/mode2/zustand/page/sharePageStore';
import { formatMoney } from '@mode2/utils';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { useToastStore } from '@mode2/zustand/components/toastStore';

type ActionClickPayloadMap = {
  [handleSharePageSaveImageClick]: { asImageRef: RefObject<HTMLDivElement> };
  [handleSharePageClipboardClick]: void;
};

export interface HandleSharePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSharePageAction = () => {
  const { downloadElementAsImage } =
    useDownloadSnapshotElement<HTMLDivElement>();

  const { clipboard, copyToClipboard } = useClipboard();

  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);
  const currentShareType: SharePosterType = useMode2SharePageStore(
    (state) => state.currentShareType
  );

  const maxWheelReward = usePlatformDynamicConfigStore(
    (state) => state.maxWheelReward
  );

  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {}, [clipboard]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSharePageSaveImageClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleSharePageSaveImageClick,
        callback: () => {
          downloadElementAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME'],
            { scale: 3 }
          );
          showToast('Picture saved to album');
        },
      });
    },
    [handleSharePageClipboardClick]: () => {
      handleGlobalClick({
        target: handleSharePageClipboardClick,
        callback: () => {
          // TODO Ronan [IN][V6]文案是否有所不同
          const copywriter = {
            [SharePosterType.SHARETEAMCLUB]: `Your friend has sent you ${formatMoney(
              inviteDailyRule.commission
            )}. Claim an additional ${formatMoney(
              inviteDailyRule.validInviteRebates
            )} with your first deposit.Claim now by clicking this link ${
              referralInfo.link
            }.`,
            [SharePosterType.SHAREINVITE]: `Do you want to unlock your ${formatMoney(
              maxWheelReward
            )} reward right away? Click the link ${
              referralInfo.link
            } and have fun!`,
          };
          const link = copywriter[currentShareType];
          copyToClipboard(link).then((state) => {
            console.log(state);
          });
        },
      });
    },
  };

  const handleSharePageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSharePageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSharePageClick,
  };
};

export default useSharePageAction;
