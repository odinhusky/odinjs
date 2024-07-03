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
    <div className="z-[1005] fixed left-0 top-0 right-0 bottom-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.65)] tablet:px-[100px]">
      <div
        className={cx(
          'relative w-full max-w-[1720px] max-h-[96%] mobile:max-h-[80vh] max-tablet:w-[92vw] max-tablet:max-h-[90vh] bg-[var(--grayscale-30)] rounded-[20px] px-5 py-6 mobile:px-8 mobile:pb-0 tablet:px-[60px] tablet:pt-11 shadow-[4px_4px_20px_0px_rgba(0,_0,_0,_0.25)] text-white',
          hideAnimation ? 'animate__animated animate__faster' : '',
          isCloseAnimation
            ? 'animate__animated animate__faster animate__fadeOutUp'
            : 'animate__fadeInDown'
        )}
      >
        <button
          className="cursor-pointer absolute z-10 right-2 top-2 mobile:top-[15px] mobile:right-[15px] tablet:top-7 tablet:right-7"
          onClick={() => {
            setIsCloseAnimation(true);
            setHideAnimation(true);
          }}
        >
          <img
            className="w-7 h-7 mobile:w-[30px] mobile:h-[30px] tablet:w-10 tablet:h-10"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
          />
        </button>
        <div className="text-lg mb-2 mobile:mb-3 tablet:mb-5 font-bold">
          Procurar
        </div>
        <div className="max-h-[94%] mobile:max-h-[90%] flex flex-col">
          <SearchInput
            isPureContainer={true}
            validation={!searchInput.data || searchInput.data.length >= 3}
            inputOuterClassName="!m-0 mobile:!m-0"
            className="py-2 bg-[var(--grayscale-20)] border-2 border-transparent"
            inputClassName="placeholder:!text-[var(--grayscale-80)]"
            placeholder="Procurar"
            value={searchInput.data}
            onChange={(event: any) => {
              setSearchInput({
                data: event.target.value,
                isValidation: true,
                errorMessage: '',
              });
            }}
            prefix={<PhoneSvg className="mr-2" icon="ic_search" />}
            focusClassName="border-[var(--state-success-main)]"
            errorClassName={cx({
              'border-[var(--state-error-main)]':
                searchInput.data && searchInput.data.length < 3,
            })}
          />
          <div
            className={cx(
              `text-[var(--grayscale-80)] text-xs tablet:text-lg text-left mt-1 mb-4 tablet:mt-2 tablet:mb-[60px]`,
              searchInput.data && searchInput.data.length < 3
                ? 'text-[var(--state-error-main)]'
                : ''
            )}
          >
            Insira pelo menos 3 símbolos para iniciar a pesquisa
          </div>
          <div
            className={`overflow-auto flex flex-col ${environment.uVersion}-game-search-list`}
          >
            {searchInput.data.length >= 3 && (
              <GameListSection
                className="text-white "
                icon={
                  <Icon
                    className="w-6 mobile:w-7 tablet:w-9 mr-2"
                    img={`assets/${environment.uVersion}/ic_search.png`}
                    name="search"
                  />
                }
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
            {(searchInput.data.length < 3 ||
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
