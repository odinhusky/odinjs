import styled from "styled-components";
import cx from "classnames";
import {environment} from "../../../../../../environments/environment";

const StyledFavoriteSection = styled.div.attrs((props) => ({
  className: cx("absolute top-[4px] right-[4px]", props.className)
}))<{
  className?: string;
}>`
  margin: 8px 8px 0 0;
  width: 30px;
  height: 30px;
`

export type IFavoriteSection = {
  onClickFavorite: (event: any) => void;
  favorite: boolean;
}
export const FavoriteSection = (props: IFavoriteSection) => {
    const iconSrc = !props.favorite ? `assets/${environment.uVersion}/icon=favorite-default.png` :`assets/${environment.uVersion}/icon=favorite-active.png`;
  return (
    <StyledFavoriteSection
      onClick={(event) => {
        event.stopPropagation();
        props.onClickFavorite && props.onClickFavorite(event);
      }}
    >
      <img
        alt={"favorite"}
        src={iconSrc}
      />
    </StyledFavoriteSection>
  )
}
