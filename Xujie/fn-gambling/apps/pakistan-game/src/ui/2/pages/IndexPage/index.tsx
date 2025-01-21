// import { memo } from 'react';
// import { useIndexBase } from '@/ui/hooks/pages/useIndexBase';
// import { useBreakPoint } from '@/hooks/useBreakPoint';
//
// import { Link } from 'react-router-dom';
// import BaseModal from '@/components/BaseModal/api';
// import {EResourceLevel, getImgUrl} from "@mode2/utils";
//
// const IndexPage = memo(() => {
//   const { uiState } = useIndexBase();
//
//   const { isDesktop, isTablet } = useBreakPoint();
//
//   const handlerModal = () => {
//     BaseModal.show({
//       content: (
//         <button className="bg-white w-20 h-20" onClick={() => BaseModal.hide()}>
//           关闭Modal1
//         </button>
//       ),
//     });
//     BaseModal.show({
//       content: (
//         <button className="bg-white w-20 h-20" onClick={() => BaseModal.hide()}>
//           关闭Modal2
//         </button>
//       ),
//     });
//   };
//   return (
//     <div>
//
//       <Link to="/invite" className="block text-blue-800">
//         to invite page
//       </Link>
//       <div className="bg-pink-400 mobile:bg-blue-500">
//         {isDesktop ? 'isDesktop' : isTablet ? 'isTablet' : 'isMobile'}
//       </div>
//
//       <img
//         src={getImgUrl(EResourceLevel.SHARED, 'test')}
//         alt=""
//         style={{
//           width: 100,
//           height: 100,
//         }}
//       />
//       <img
//         src={getImgUrl(EResourceLevel.V, 'for_u')}
//         alt=""
//         style={{
//           width: 100,
//           height: 100,
//         }}
//       />
//       <img
//         src={getImgUrl(EResourceLevel.V, 'for_v')}
//         alt=""
//         style={{
//           width: 100,
//           height: 100,
//         }}
//       />
//
//       <button onClick={handlerModal}>打開modal</button>
//     </div>
//   );
// });
// export default IndexPage;
