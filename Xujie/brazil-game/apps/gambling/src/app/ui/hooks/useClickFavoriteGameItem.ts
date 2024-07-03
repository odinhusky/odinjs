import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxStore';
import { GameItem } from '../components-bs/GameTypeSection';
import { appSlice } from '../../reduxStore/appSlice';
import { userRecentSlice } from '../../reduxStore/userRecordSlice';

export const useClickFavoriteGameItem = (props?: any) => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const dispatch = useDispatch();
  const onClickFavoriteGameItem = (item: GameItem) => {
    if (!isLogin) {
      dispatch(appSlice.actions.showLoginDrawerOrModal(true));
    } else {
      dispatch(userRecentSlice.actions.setUserFavoriteGame(item));
    }
  };
  return {
    onClickFavoriteGameItem,
  };
};
