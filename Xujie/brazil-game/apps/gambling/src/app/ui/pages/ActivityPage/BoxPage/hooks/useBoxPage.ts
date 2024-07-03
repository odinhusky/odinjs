import {
  useLazyGetBoxInfoQuery,
  usePostBoxClaimMutation,
} from '../../../../../external';
import { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { appCopy } from '../../../../utils/appCopy';
import { useSelector } from 'react-redux';
import { uiSlice } from 'apps/gambling/src/app/reduxStore/uiSlice';
import { RootState } from 'apps/gambling/src/app/reduxStore';

const useBoxPage = () => {
  const [recordOpen, setRecordOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [getBoxInfo, { data }] = useLazyGetBoxInfoQuery();
  const [claim] = usePostBoxClaimMutation();

  useEffect(() => {
    getBoxInfo(null);
  }, []);

  // 如果 menuDrawer 的 Recomendar 按鈕被按下且導航到 /box-invite 的話，則 record 頁面要切換回 boxPage
  const isBackToBoxPage = useSelector(
    (state: RootState) => state.ui.isBackToBoxPage
  );

  useEffect(() => {
    if (isBackToBoxPage) {
      setRecordOpen(false);
    }
  }, [isBackToBoxPage]);

  const onClickToClaim = async (number: number) => {
    const response = await claim({ inviteNum: number });

    if ('data' in response && response.data?.code === 200) {
      getBoxInfo(null);
      api.success({
        message: 'O bônus foi reivindicado.',
      });
    }
  };

  const onClickToCopy = useCallback(() => {
    appCopy(data?.data.invitationLink);
    api.success({
      message: 'Copiado!',
    });
  }, [data?.data.invitationLink]);

  return {
    bannerContent: data?.data.bannerContext || '',
    inviteLink: data?.data.invitationLink || '',
    inviteNum: data?.data.inviteNum || 0,
    recharge:
      data?.data?.rules?.find((item) => item.rule === 'RECHARGE')?.value || 0,
    betFlow:
      data?.data?.rules?.find((item) => item.rule === 'BET_FLOW')?.value || 0,
    steps: data?.data?.steps || [],
    contentHtml: data?.data?.content || '',
    isInvitationOpen: data?.data?.invitationFlag === 1, // 是否顯示邀請連結區塊
    onClickToClaim,
    onClickToCopy,
    contextHolder,
    recordOpen,
    setRecordOpen,
  };
};

export default useBoxPage;
