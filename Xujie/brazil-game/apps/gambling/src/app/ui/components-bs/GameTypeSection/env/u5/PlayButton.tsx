import {DesktopGameItemButton} from "../components/DesktopGameItemButton";
import cx from "classnames";

interface IPlayButton {
  onClick: () => void;
}

export const PlayButton = (props: IPlayButton) => {

  return (
    <DesktopGameItemButton
      className={cx(
        'w-[40px] h-[40px] md:w-[56px] md:h-[56px] active:brightness-50'
      )}
      onClick={props.onClick}
    >
      {/*<img*/}
      {/*  className="w-[40px] h-[40px] md:w-[56px] md:h-[56px]"*/}
      {/*  src={imageCache[iconSrc].cacheValue}*/}
      {/*  alt="play"/>*/}
    </DesktopGameItemButton>
  )
}
