import { SearchOutlined } from '@ant-design/icons';
import { CloseICON } from '../../components-bs/Icons/CloseICON';
import { Input, InputValue } from '../../components-bs/Inputs/Input';
import cx from 'classnames';
import { SearchInput } from '../../components-bs/Inputs/SearchInput';
import { useSearchGames } from '../../hooks/useSearchGames';
import { useEffect, useState } from 'react';
import { GameListSection } from './components/GameListSection';

import { MobileGameItem } from '../../components-bs/GameTypeSection/GameItem/MobileGameItem';
import { DesktopGameItem } from '../../components-bs/GameTypeSection/GameItem/GameItem';
import useBreakpoint from '../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../router/hooks/usePageNavigate';
import { useClickFavoriteGameItem } from '../../hooks/useClickFavoriteGameItem';
import { useSelector } from 'react-redux';
import { NoData } from '../../components-bs/Icons/NoData';
import { environment } from '../../../../environments/environment';
import { Icon } from '../../components-bs/Icons';
import { GameItem } from '../../components-bs/GameTypeSection';
import { renderByUVersion } from '../../utils/renderByUVersion';
import { CloseButton } from './components/CloseButton';
import { SearchNotice } from './components/SearchNotice';
import { GameSearchModal as U5GameSearchModal } from './env/u5/GameSearchModal';
import { GameSearchModal as U6GameSearchModal } from './env/u6/GameSearchModal';
import { GameSearchModal as U7GameSearchModal } from './env/u7/GameSearchModal';
import useAnimation from '../../hooks/useAnimation';
interface IGameSearchModal {
  onClose: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
}
const defaultGameSearchModal = (props: IGameSearchModal) => {
  const [searchInput, setSearchInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const { searchResults, handleSearchGames } = useSearchGames(searchInput.data);
  const typeGameList =
    useSelector((state: any) => state.gameList.typeGameList) || [];
  const [listSize, setListSize] = useState(9);
  const recommendItems =
    typeGameList && typeGameList[0]?.data[0]?.games.slice(0, listSize);

  useEffect(() => {
    if (searchInput.data.length >= 3) {
      handleSearchGames(searchInput.data);
    }
  }, [searchInput.data]);

  const loadMore = () => {
    setListSize(listSize + 9);
  };

  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { onClickGameItem } = usePageNavigate();
  const MainGameItem = !isDesktop ? MobileGameItem : DesktopGameItem;

  const gameList = (data: any) => {
    if (data?.length > 0) {
      return (
        <div
          className={cx('flex', {
            'flex-wrap w-full': !isDesktop,
          })}
        >
          {data &&
            data.map((item: any, index: any) => {
              return (
                <MainGameItem
                  className={cx('grow-0 shrink-0', {
                    '!w-[32vw] !h-[32vw] ': isMobile,
                    '!basis-[20vw] !h-[22vw] !flex-1': isTablet,
                    'mr-[16px] max-w-[150px] !basis-[150px]': isDesktop,
                  })}
                  key={index}
                  isLock={item.lock}
                  gameId={Number(item.gameId)}
                  name={item.name}
                  imageURL={`${environment.s3URLImages}/${item.gameId}-small.png`}
                  onClick={() => {
                    onClickGameItem(item);
                  }}
                  onClickFavorite={() => {
                    props.onClickFavoriteGameItem(item);
                  }}
                />
              );
            })}
          {
            // NOTE: 排版用，塞空的的區塊補齊空位 (Tablet)
            Array.from({ length: 4 - (data?.length % 4) }, (_, index) => {
              return (
                isTablet && (
                  <div
                    key={index}
                    className={cx({
                      '!basis-[20vw] !h-[22vw] !flex-1': isTablet,
                    })}
                  ></div>
                )
              );
            })
          }
        </div>
      );
    } else {
      return (
        <div className="flex flex-col flex-1 justify-center items-center py-3.5">
          <NoData />
          <div className="text-xs mt-3.5">Nenhum jogo encontrado</div>
        </div>
      );
    }
  };

  const handleClose = () => {
    props.onClose();
  };
  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(handleClose);

  const CloseBtn = () => {
    return renderByUVersion(
      {
        u2: (
          <button
            className={'absolute top-[12px] right-[12px]'}
            onClick={() => setIsCloseAnimation(true)}
          >
            <CloseButton />
          </button>
        ),
      },
      <button
        className={'absolute top-[12px] right-[12px]'}
        onClick={props.onClose}
      >
        <CloseButton />
      </button>
    );
  };

  const backgroundProps = () => {
    return renderByUVersion(
      {
        u1: 'bg-gradient-to-b from-[var(--background-modal-from)] to-[var(--background-modal-to)]',
        u2: `bg-[var(--background-tabbar-to)] animate__animated animate__faster animate__backInDown ${
          isCloseAnimation ? 'animate__bounceOut' : ''
        }`,
      },
      'bg-gradient-to-b from-[var(--background-modal-from)] to-[var(--background-modal-to)]'
    );
  };
  return (
    <div className="z-[1005] fixed left-0 top-0 right-0 bottom-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.65)]">
      <div
        className={cx(
          'fixed rounded-lg pt-8 p-3 md:p-6 lg:p-8 relative',
          {
            'w-[80%]': isDesktop,
            'w-[90%] h-[90%]': !isDesktop,
          },
          backgroundProps()
        )}
      >
        <CloseBtn />
        <div className="h-full flex flex-col">
          <div className={'flex-none mb-2 md:mb-4 lg:mb-8'}>
            <div className="text-lg md:text-2xl lg:text-4xl text-white mb-2 md:mb-3 lg:mb-8">
              Procurar
            </div>
            <SearchInput
              placeholder={'Pesquisar nome do jogo'}
              value={searchInput.data}
              onChange={(event: any) => {
                setSearchInput({
                  data: event.target.value,
                  isValidation: true,
                  errorMessage: '',
                });
              }}
            />
            <SearchNotice />
          </div>
          <div
            className={`flex-1 overflow-auto ${environment.uVersion}-game-search-list `}
          >
            {searchInput.data.length >= 3 && (
              <GameListSection
                className="text-white "
                icon={
                  <SearchOutlined
                    className={
                      'text-2xl md:text-[28px] lg:text-[32px] text-white mr-2 flex justify-center items-center'
                    }
                  />
                }
                title={'Procurar Resultados'}
                children={gameList(searchResults)}
                expandedBrand={false}
              />
            )}
            <GameListSection
              className="text-white"
              icon={
                <Icon
                  className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[32px] lg:h-[32px] mr-1"
                  img={`assets/${environment.uVersion}/icon=recommend.png`}
                  name={'recommend'}
                />
              }
              title={'Jogos que você deveria experimentar'}
              children={gameList(recommendItems)}
              expandedBrand={isMobile}
              loadMore={loadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export const GameSearchModal = renderByUVersion(
  {
    u5: U5GameSearchModal,
    u6: U6GameSearchModal,
    u7: U7GameSearchModal,
  },
  defaultGameSearchModal
);
