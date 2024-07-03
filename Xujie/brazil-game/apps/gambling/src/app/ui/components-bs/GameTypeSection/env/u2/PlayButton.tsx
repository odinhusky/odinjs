import {DesktopGameItemButton} from "../components/DesktopGameItemButton";
import {useEffect} from "react";
import {environment} from "../../../../../../environments/environment";
import {useImageLoad} from "../../../../hooks/useImageLoag";

interface IPlayButton {
  onClick: () => void;
}

export const PlayButton = (props: IPlayButton) => {
  const {loadImageAndCache, imageCache} = useImageLoad();
  const iconSrc = `assets/${environment.uVersion}/icon=play.png`;

  useEffect(() => {
    loadImageAndCache(iconSrc, iconSrc, -1);
  }, []);


  return (
    imageCache[iconSrc] &&
    <DesktopGameItemButton
      onClick={props.onClick}
    >
      <img
        className="w-[40px] h-[40px] md:w-[56px] md:h-[56px]"
        src={imageCache[iconSrc].cacheValue}
        alt="play"/>
    </DesktopGameItemButton>
  )
}
