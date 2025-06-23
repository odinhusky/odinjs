import useTeamClubRulesBase from '@libs/mode2/usecase/useTeamClubRulesBase';
import { useSharePageFooterSetting } from './useSharePageFooterSetting';
import useSharePageHeaderSetting from './useSharePageHeaderSetting';
import { useInviteRecommend } from '@libs/mode2/usecase/useInviteRecommend';
import { useUserState } from '@/usecase/useUserState';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import {
  defaultSharePosterList,
  useMode2SharePageStore,
} from '@libs/mode2/zustand/page/sharePageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useLocation } from 'react-router-dom';
import { EResourceLevel, getImgUrl, getParams } from '@libs/mode2/utils';
import { useEffect } from 'react';

export const useMode2SharePageBase = () => {
  const location = useLocation();

  const setCurrentShareType = useMode2SharePageStore(
    (state) => state.setCurrentShareType
  );
  const setSharePosterList = useMode2SharePageStore(
    (state) => state.setSharePosterList
  );

  const { refreshUserState } = useUserState();
  const id = useUserProfileStore((state) => state.id);
  useDeepEffect(() => {
    if (id === 0) {
      refreshUserState();
    }
  }, [id]);

  useTeamClubRulesBase();

  useInviteRecommend();

  useSharePageHeaderSetting();

  useSharePageFooterSetting();

  const params = getParams(['tab'], location.search, location.state);

  console.log('@@@==> SharePageBase', params);

  const generatePosters = (type: number, prefix: string) => {
    const sharePosters = Array.from({ length: type }, (_, index) =>
      getImgUrl(EResourceLevel.V, `${prefix}${index + 1}`)
    );

    return sharePosters;
  };

  useEffect(() => {
    const data = defaultSharePosterList[(params.tab as number) || 0];
    const list = generatePosters(data.length, data.prefix);

    setSharePosterList(list);
    setCurrentShareType((params.tab as number) || 0);
  }, []);
};

export default useMode2SharePageBase;
