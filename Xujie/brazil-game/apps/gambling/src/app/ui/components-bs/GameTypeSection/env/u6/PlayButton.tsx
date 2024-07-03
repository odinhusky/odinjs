import {DesktopGameItemButton} from "../components/DesktopGameItemButton";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import {environment} from "../../../../../../environments/environment";
import {useEffect} from "react";

interface IPlayButton {
    className?: string;
    onClick?: () => void;
}

export const PlayButton = (props: IPlayButton) => {
    const {className, onClick} = props;
    const {loadImageAndCache, imageCache} = useImageLoad();
    const iconSrc = `assets/${environment.uVersion}/icon=play.png`;

    useEffect(() => {
        loadImageAndCache(iconSrc, iconSrc, -1);
    }, []);

    return (
        imageCache[iconSrc] &&
        <DesktopGameItemButton
            className={className}
            onClick={() => onClick && onClick()}>
            <img
                className={'h-full aspect-square'}
                src={imageCache[iconSrc].cacheValue}
                alt={'play'}/>
        </DesktopGameItemButton>
    )
}
