// import { useDeepEffect } from '@commonUtils/hooks';
// import { handleActivityUnitClick } from '@libs/mode2/action/activityPageAction/actionType';
// import useActivityPageActions from '@mode2/action/activityPageAction/useActivityPageActions';
// import { usePostAnnouncementInfoMutation } from '@mode2API/index';
// import {
//   useMode2ActivityActionsStore,
//   useMode2ActivityListStore,
// } from '@mode2/zustand/page/activityPageStore';
// import { useEffect } from 'react';
//
// export const useMode2ActivityList = () => {
//   const [triggerAnnouncementInfo, { data: activityList }] =
//     usePostAnnouncementInfoMutation();
//
//   const setActivityList = useMode2ActivityListStore(
//     (state) => state.setActivityList
//   );
//
//   const setActivityActionList = useMode2ActivityActionsStore(
//     (state) => state.setActivityActionList
//   );
//
//   const { handleActivityPageClick } = useActivityPageActions();
//
//   // 因為用 post 拿資料所以不得不 trigger 一次
//   useEffect(() => {
//     triggerAnnouncementInfo();
//   }, []);
//
//   useDeepEffect(() => {
//     if (!activityList) return;
//
//     const result = activityList.map((item) => ({ ...item }));
//
//     setActivityList(result);
//
//     const actionList = result.map((item) => () => {
//       handleActivityPageClick({
//         actionName: handleActivityUnitClick,
//         payload: { item },
//       });
//     });
//
//     setActivityActionList(actionList);
//   }, [activityList]);
// };
//
// export default useMode2ActivityList;
