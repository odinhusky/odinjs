import {DesktopGameItemButton} from "../components/DesktopGameItemButton";
import {useEffect} from "react";
import {environment} from "../../../../../../environments/environment";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import cx from "../../../../utils/cx";

interface IPlayButton {
  onClick: () => void;
  className: string;
}

export const PlayButton = (props: IPlayButton) => {
  const {loadImageAndCache, imageCache} = useImageLoad()
  const iconSrc = `assets/${environment.uVersion}/icon=play.png`;

  useEffect(() => {
    loadImageAndCache(iconSrc, iconSrc, -1);
  }, []);

  return (
    imageCache[iconSrc] &&
    <DesktopGameItemButton
      onClick={props.onClick}
    >
      <img className={cx("w-[64px] h-[64px]", props.className)}
           src={imageCache[iconSrc].cacheValue}
           alt="play"/>
    </DesktopGameItemButton>
  )
}
