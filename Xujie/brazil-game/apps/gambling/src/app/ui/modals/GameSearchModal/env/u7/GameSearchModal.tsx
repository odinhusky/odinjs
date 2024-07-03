import {
  Input as SearchInput,
  InputValue,
} from '../../../../components-bs/Inputs/Input';
import { useSearchGames } from '../../../../hooks/useSearchGames';
import { memo, useEffect, useMemo, useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useSelector } from 'react-redux';
import { environment } from '../../../../../../environments/environment';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { PhoneSvg } from '../../../../components-bs/UserLoginStatusSection/forms/UserLoginForm/env/u5/components/PhoneSvg';
import { GameListSection } from './GameListSection';
import { Icon } from '../../../../components-bs/Icons';
import cx from '../../../../utils/cx';
import useAnimation from '../../../../hooks/useAnimation';
import { GameList } from './GameList';
import { CacheImage } from '../../../../components/image/CacheImage';

interface IGameSearchModal {
  onClose: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
}
export const GameSearchModal = memo((props: IGameSearchModal) => {
  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(props.onClose);
  const [searchInput, setSearchInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const { isMobile } = useBreakpoint();
  const { searchResults, handleSearchGames } = useSearchGames(searchInput.data);
  const typeGameList =
    useSelector((state: any) => state.gameList.typeGameList) || [];
  const [listSize, setListSize] = useState(9999);
  const { onClickGameItem } = usePageNavigate();
  const listProps = useMemo(() => {
    const recommendItems =
      typeGameList && typeGameList[0]?.data[0]?.games.slice(0, listSize);
    return {
      recommendItems,
      searchResults,
      onClickGameItem,
      onClickFavoriteGameItem: props.onClickFavoriteGameItem,
    };
  }, [searchResults]);

  useEffect(() => {
    if (searchInput.data.length >= 3) {
      handleSearchGames(searchInput.data);
    }
  }, [searchInput.data]);

  const loadMore = () => {
    setListSize(listSize + 9);
  };

  const [hideAnimation, setHideAnimation] = useState(true);
  setTimeout(() => {
    setHideAnimation(false);
  }, 650);

  return (
    <div className="z-[1005] fixed left-0 top-0 right-0 bottom-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.65)]">
      <div
        className={cx(
          'bg-main relative w-full h-full pt-4 px-4 shadow-[4px_4px_20px_0px_rgba(0,_0,_0,_0.25)] text-white',
          hideAnimation ? 'animate__animated animate__faster' : '',
          isCloseAnimation
            ? 'animate__animated animate__faster animate__fadeOutUp'
            : 'animate__fadeInDown'
        )}
      >
        <div className='h-4 w-full'>
          <button
            className="cursor-pointer relative float-right"
            onClick={() => {
              setIsCloseAnimation(true);
              setHideAnimation(true);
            }}
          >
            <img
              className="w-4 h-4"
              src={`assets/${environment.uVersion}/icon_close.png`}
              alt="close"
            />
          </button>
        </div>
        <div className="flex flex-col mt-3">
          <SearchInput
            isPureContainer={true}
            validation={!searchInput.data || searchInput.data.length >= 3}
            inputOuterClassName="!m-0 mobile:!m-0 !mb-4"
            className="py-2 bg-[var(--grayscale-25)] border border-transparent rounded-full h-10"
            inputClassName="placeholder:!text-[var(--grayscale-70)]"
            placeholder="Procurar"
            value={searchInput.data}
            onChange={(event: any) => {
              setSearchInput({
                data: event.target.value,
                isValidation: true,
                errorMessage: '',
              });
            }}
            prefix={<CacheImage className='w-4 h-4 mr-2' src={`assets/${environment.uVersion}/icon_search.png`}/>}
            focusPrefix={<CacheImage className='w-4 h-4 mr-2 brightness-200' src={`assets/${environment.uVersion}/icon_search.png`}/>}
            focusClassName="border-[var(--grayscale-40)]"
            // errorClassName={cx({
            //   'border-[var(--state-error-main)]':
            //     searchInput.data && searchInput.data.length < 3,
            // })}
          />
          {/* <div
            className={cx(
              `text-[var(--grayscale-80)] text-xs tablet:text-lg text-left mt-1 mb-4 tablet:mt-2 tablet:mb-[60px]`,
              searchInput.data && searchInput.data.length < 3
                ? 'text-[var(--state-error-main)]'
                : ''
            )}
          >
            Insira pelo menos 3 símbolos para iniciar a pesquisa
          </div> */}
          <div
            className={`overflow-y-auto flex flex-col ${environment.uVersion}-game-search-list h-[86vh]`}
          >
            {/* {searchInput.data.length >= 3 && ( */}
            {searchInput.data.length > 0 && (
              <GameListSection
                className="text-white"
                headerClassName="justify-center items-center mb-4"
                title={'Procurar Resultados'}
                expandedBrand={false}
                isSearch={true}
              >
                <GameList
                  {...listProps}
                  data={listProps.searchResults}
                  isSearch={true}
                />
              </GameListSection>
            )}
            {/* {(searchInput.data.length < 3 ||
              (searchInput.data && listProps.searchResults.length) != 0) && (
              <GameListSection
                className="text-white"
                icon={
                  <Icon
                    className="w-6 mobile:w-7 tablet:w-9 mr-2"
                    img={`assets/${environment.uVersion}/icon=recommend.png`}
                    name={'recommend'}
                  />
                }
                title={'Jogos que você deveria experimentar'}
                expandedBrand={isMobile}
                loadMore={loadMore}
                isSearch={false}
              >
                <GameList
                  {...listProps}
                  data={listProps.recommendItems}
                  isSearch={false}
                />
              </GameListSection>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
});
