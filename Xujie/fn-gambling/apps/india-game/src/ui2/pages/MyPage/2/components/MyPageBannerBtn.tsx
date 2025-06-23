import { useMemo } from 'react';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { handleMyPageAnnouncementsActionClick } from '@mode2/action/actionTypes';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';

export const MyPageBannerBtn = () => {
  const { handleMyPageClick } = useMyPageActions();
  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );

  const myPageAnnouncement = useMemo(() => {
    const result = announcementsItems.find((item) => {
      return item.showInMyPage;
    });
    return result;
  }, [announcementsItems]);

  const myPageAnnouncementBannerUrl = myPageAnnouncement?.bannerUrl || '';

  return myPageAnnouncement !== undefined ? (
    <div
      className="cursor-pointer"
      onClick={() => {
        handleMyPageClick({
          actionName: handleMyPageAnnouncementsActionClick,
          payload: {
            item: myPageAnnouncement,
          },
        });
      }}
    >
      <img
        className="w-full object-contain rounded-lg"
        src={myPageAnnouncementBannerUrl}
        alt="banner"
      />
    </div>
  ) : null;
};

export default MyPageBannerBtn;
