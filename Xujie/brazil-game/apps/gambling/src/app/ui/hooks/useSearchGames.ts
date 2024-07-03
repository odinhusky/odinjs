import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '../../reduxStore';

export const useSearchGames = (searchText: string) => {
  const allGameList = useSelector(
    (state: RootState) => state.gameList.allGameList
  );
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchGames = (searchText: string) => {
    const searchGames =
      allGameList.length > 0 &&
      allGameList.reduce((result: any, i: any) => {
        const filteredGames = i.data.games.filter((label: any) => {
          return label.name.toLowerCase().includes(searchText.toLowerCase());
        });
        //@ts-ignore
        result.push(...filteredGames);

        return result;
      }, []);

    setSearchResults(searchGames);
  };

  return {
    searchResults,
    handleSearchGames,
  };
};
