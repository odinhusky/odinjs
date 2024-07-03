import cx from 'classnames';
import { TabItem } from '../../../../components-bs/TabItem/env/u2/TabItem';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { environment } from '../../../../../../environments/environment';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

type TIndexTabs = {
  label: any;
  activeTab: any;
  setViewType: (value: any) => void;
};

export const U2IndexTabs = ({ label, activeTab, setViewType }: TIndexTabs) => {
  const dispatch = useDispatch();

  const typeGameCount = useSelector(
    (state: any) => state.gameList.typeGameCount
  );
  const userFavoriteGameIds = useSelector(
    (state: RootState) => state.userRecent.userFavoriteGameIds
  );

  const { isDesktop } = useBreakpoint();

  return (
    <DragScrollContainer
      className={cx('flex flex-row items-center rounded-[100px] ', {
        'flex-1': !isDesktop,
      })}
    >
      <div className="bg-[var(--grayscale-20)] flex flex-row rounded-[100px] flex-1">
        {['Todos', ...label, 'Favoritos'].map(
          (tab: indexPagecurrentSelectLabel, index: number) => {
            const gameCount =
              tab !== 'Favoritos'
                ? typeGameCount[tab]
                : userFavoriteGameIds.length;
            return (
              <TabItem
                className="flex-1 text-xs md:text-sm lg:text-base px-5"
                active={activeTab === tab}
                onClick={() => {
                  dispatch(
                    gameSlice.actions.setIndexPagecurrentSelectLabel(tab)
                  );
                  setViewType('');
                }}
                icon={`assets/${environment.uVersion}/${
                  environment.mVersion
                }/icon_${tab.toLowerCase()}.png`}
                defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
                name={activeTab === tab ? `${tab} ( ${gameCount} )` : tab}
              />
            );
          }
        )}
      </div>
    </DragScrollContainer>
  );
};
