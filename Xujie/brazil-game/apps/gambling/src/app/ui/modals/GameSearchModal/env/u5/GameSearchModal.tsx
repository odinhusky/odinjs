import { InputValue } from '../../../../components-bs/Inputs/Input';
import { SearchInput } from '../../../../components-bs/Inputs/SearchInput';
import { useSearchGames } from '../../../../hooks/useSearchGames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useSelector } from 'react-redux';
import { environment } from '../../../../../../environments/environment';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { GameList } from '../../components/GameList';
import { LoadMoreButton } from '../../../../components-bs/Buttons/env/u5/LoadMoreButton';

interface IGameSearchModal {
  onClose: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
}
export const GameSearchModal = ({
  onClickFavoriteGameItem,
  onClose,
}: IGameSearchModal) => {
  const [searchInput, setSearchInput] = useState<InputValue<string>>({
    data: '',
    isValidation: true,
    errorMessage: '',
  });
  const { isDesktop } = useBreakpoint();
  const { searchResults, handleSearchGames } = useSearchGames(searchInput.data);
  const typeGameList =
    useSelector((state: any) => state.gameList.typeGameList) || [];
  const [listSize, setListSize] = useState(isDesktop ? 21 : 12);
  const gameAllList = typeGameList?.[0]?.data[0]?.games;
  const isSearchMode = searchInput.data.length >= 3;
  const { onClickGameItem } = usePageNavigate();
  const listProps = useMemo(() => {
    const recommendItems = gameAllList.slice(0, listSize);
    return {
      data: isSearchMode ? searchResults : recommendItems,
      onFavorite: onClickFavoriteGameItem,
      onClickGameItem,
    };
  }, [isSearchMode, searchResults, gameAllList, listSize]);

  useEffect(() => {
    if (isSearchMode) {
      handleSearchGames(searchInput.data);
    }
  }, [searchInput.data]);
  const loadMore = () => {
    setListSize(listSize + (isDesktop ? 21 : 12));
  };
  return (
    <div className="z-[1005] fixed left-0 top-0 right-0 bottom-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.65)]">
      <div className="relative w-[1180px] h-[80vh] max-tablet:w-[90vw] max-tablet:h-[90vh] bg-[var(--grayscale-20)] rounded-[20px] p-3 mobile:p-6 tablet:p-8 shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] text-white">
        <button
          className=" cursor-pointer absolute  z-10 -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center bg-[var(--grayscale-50)] shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]"
          onClick={onClose}
        >
          <img
            className="w-[24px] h-[24px]"
            src={`assets/${environment.uVersion}/icon_close.png`}
            alt="close"
          />
        </button>
        <div className="h-full flex flex-col">
          <SearchInput
            validation={!searchInput.data || isSearchMode}
            placeholder="Pesquisar nome do jogo"
            value={searchInput.data}
            onChange={(event: any) => {
              setSearchInput({
                data: event.target.value,
                isValidation: true,
                errorMessage: '',
              });
            }}
          />
          <div
            className={`text-[var(${
              !searchInput.data || isSearchMode
                ? '--state-warn-main'
                : '--state-error-main'
            })] text-xs lg:text-sm text-center mt-2`}
          >
            Insira pelo menos 3 símbolos para iniciar a pesquisa
          </div>
          <div
            className={`flex-1 overflow-auto flex flex-col ${environment.uVersion}-game-search-list`}
          >
            <div className="text-white text-center text-base mb-2">
              {isSearchMode && listProps.data.length > 0
                ? 'Procurar Resultados'
                : 'Jogos que você deveria experimentar'}
            </div>

            <GameList {...listProps} />
            {!isSearchMode && listSize < gameAllList.length && (
              <div className="flex-1 mt-4 justify-center flex">
                <LoadMoreButton onClick={loadMore} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
