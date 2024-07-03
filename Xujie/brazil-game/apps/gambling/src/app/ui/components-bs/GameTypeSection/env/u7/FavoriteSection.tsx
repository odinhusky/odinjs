import { FavoriteSection as FavoriteSectionContainer, IFavoriteSection } from '../components/FavoriteSection'
import { useEffect, useState } from "react";
import { environment } from "../../../../../../environments/environment";

export const FavoriteSection = (props: IFavoriteSection) => {
  const [hover, setHover] = useState(false);

  const favoriteImg = `assets/${environment.uVersion}/btn_favorite.png`;
  const unfavoriteImg = `assets/${environment.uVersion}/btn_unfavorite.png`;

  return (
    <div
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}>
      <FavoriteSectionContainer
        className={`cursor-pointer rounded-full w-8 md:w-8 mt-1 mr-1`}
        {...props}
        unfavoriteImg={unfavoriteImg}
        favoriteImg={favoriteImg}
      />
    </div>
  )
}
