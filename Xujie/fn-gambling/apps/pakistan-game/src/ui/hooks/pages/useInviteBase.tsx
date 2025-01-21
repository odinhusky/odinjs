import { useState } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

export interface IInviteBase {
  title: string;
}

export const useInviteBase = () => {
  const [uiState] = useState<IInviteBase>({
    title: 'Invite',
  });
  const [pageIdx, setPageIdx] = useState<number>(1);
  const [isShowRedDot, setIsShowRedDot] = useState(false);
  const tabList = [
    {
      title: 'Earn',
      id: 1,
    },
    {
      title: 'Statistics',
      id: 2,
    },
    {
      title: 'Team data',
      id: 3,
    },
    {
      title: 'Ranking list',
      id: 4,
    },
  ];

  const onTab = (id: number) => {
    setPageIdx(id);
  };

  const earnList = [
    {
      title: 'Share your referral link or QR code below',
      url: getImgUrl(EResourceLevel.V, 'earn_step_1'),
      desc: 'Just copy or screenshot and send to your friends',
    },
    {
      title: 'Share your referral link or QR code below',
      url: getImgUrl(EResourceLevel.V, 'earn_step_2'),
      desc: 'Just copy or screenshot and send to your friends',
    },
    {
      title: 'Share your referral link or QR code below',
      url: getImgUrl(EResourceLevel.V, 'earn_step_3'),
      desc: 'Just copy or screenshot and send to your friends',
    },
  ];

  const onSaveScan = () => {
    console.log('save');
  };

  return {
    pageIdx,
    tabList,
    onTab,
    earnList,
    isShowRedDot,
    onSaveScan,
  };
};
