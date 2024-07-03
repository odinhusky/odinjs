import React from 'react';
import cx from 'classnames';
import { TabItem } from '../../../../components-bs/TabItem/env/u5/TabItem';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { environment } from '../../../../../../environments/environment';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

type TIndexTabs = {
  // label: any;
  // activeTab: any;
  setViewType: (value: any) => void;
};

export const IndexTabs = ({
  // label,
  // activeTab,
  setViewType,
}: TIndexTabs) => {
  const dispatch = useDispatch();

  const label = useSelector((state: RootState) => state.gameList.label);
  const typeGameCount = useSelector(
    (state: RootState) => state.gameList.typeGameCount
  );
  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );
  const userFavoriteGameIds = useSelector(
    (state: RootState) => state.userRecent.userFavoriteGameIds
  );
  const { isDesktop } = useBreakpoint();

  return (
    <DragScrollContainer
      className={cx(
        'flex flex-row items-center bg-[var(--grayscale-20)]  rounded-[100px] w-full',
        { 'flex-1': !isDesktop }
      )}
    >
      <div className="flex flex-row rounded-[100px] flex-1">
        {['Todos', ...label, 'Favoritos'].map((tab: string, index: number) => {
          const gameCount =
            tab !== 'Favoritos'
              ? typeGameCount[tab]
              : userFavoriteGameIds.length;
          return (
            <TabItem
              className="flex-none text-xs md:text-sm lg:text-base lg:h-10"
              active={indexPagecurrentSelectLabel === tab}
              onClick={() => {
                dispatch(
                  gameSlice.actions.setIndexPagecurrentSelectLabel(
                    tab as indexPagecurrentSelectLabel
                  )
                );
                setViewType('');
              }}
              icon={`assets/${environment.uVersion}/${
                environment.mVersion
              }/icon_${tab.toLowerCase()}.png`}
              defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
              name={
                indexPagecurrentSelectLabel === tab
                  ? `${tab} (${gameCount})`
                  : tab
              }
            />
          );
        })}
      </div>
    </DragScrollContainer>
  );
};
