import {
  SocialScenarios,
  useSocialListStore,
} from '@mode2/zustand/components/socialListStore';
import useSocialAction, {
  ActionType,
} from '@mode2/action/components/socialList/useSocialListAction';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { AppSchemeData, SchemeData } from '@constant/AppSchemeData';
import { handleSocialActionClick } from '@mode2/action/components/socialList/acitonType';
import { useEffect } from 'react';

export const useSocialListBase = () => {
  const usageScenariosList = useSocialListStore(
    (state) => state.usageScenariosList
  );
  const setUsageScenariosList = useSocialListStore(
    (state) => state.setUsageScenariosList
  );

  const { handleSocialClick } = useSocialAction();

  const whatsappIcon = {
    label: 'Whatsapp',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_whatsapp'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['whatsapp'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.POST,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const facebookIcon = {
    label: 'Facebook',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_facebook'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['facebook'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.LINK,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const tiktokIcon = {
    label: 'Tiktok',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_tiktok'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['tiktok'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.LINK,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const twitterIcon = {
    label: 'Twitter',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_twitter'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['twitter'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.POST,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const telegramIcon = {
    label: 'Telegram',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_telegram'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['telegram'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.POST,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const instagramIcon = {
    label: 'Instagram',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_instagram'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['instagram'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.LINK,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  const plus18Icon = {
    label: '18+',
    icon: getImgUrl(EResourceLevel.SHARED, 'icon_18_plus'),
    onActionClick: () => {
      // handleSocialClick({
      //   actionName: handleSocialActionClick,
      //   payload: { isLink: true, target: '' },
      // });
    },
  };

  const youtubeIcon = {
    label: 'Youtube',
    icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_youtube'),
    onActionClick: () => {
      const data: SchemeData | null = AppSchemeData['youtube'];
      if (data) {
        handleSocialClick({
          actionName: handleSocialActionClick,
          payload: {
            type: ActionType.LINK,
            appScheme: data,
            target: '',
          },
        });
      }
    },
  };

  useEffect(() => {
    if (usageScenariosList.length <= 0) {
      const footerList = {
        scenarios: SocialScenarios.FOOTER,
        socialList: [
          plus18Icon,
          youtubeIcon,
          whatsappIcon,
          facebookIcon,
          tiktokIcon,
          twitterIcon,
        ],
      };

      const inviteList = {
        scenarios: SocialScenarios.INVITE_PAGE,
        socialList: [
          telegramIcon,
          instagramIcon,
          youtubeIcon,
          whatsappIcon,
          facebookIcon,
          tiktokIcon,
          twitterIcon,
        ],
      };

      const teamClubList = {
        scenarios: SocialScenarios.TEAM_CLUB,
        socialList: [whatsappIcon, facebookIcon, telegramIcon, instagramIcon],
      };

      const shareList = {
        scenarios: SocialScenarios.SHARE,
        socialList: [telegramIcon, whatsappIcon],
      };

      const v6VersionShareList = {
        scenarios: SocialScenarios.V6_VERSION_SHARE,
        socialList: [whatsappIcon, telegramIcon, facebookIcon],
      };

      const aboutUsList = {
        scenarios: SocialScenarios.ABOUT_US,
        socialList: [
          telegramIcon,
          whatsappIcon,
          instagramIcon,
          twitterIcon,
          youtubeIcon,
        ],
      };

      setUsageScenariosList([
        footerList,
        inviteList,
        teamClubList,
        shareList,
        v6VersionShareList,
        aboutUsList,
      ]);
    }
  }, [usageScenariosList]);
};
