import {environment} from "../../../../../../../environments/environment";
import React, {useEffect} from "react";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {twMerge} from "tailwind-merge";
import {useImageLoad} from "../../../../../hooks/useImageLoag";

interface WebsiteLogoProps {
  className?: string
}

export const WebsiteLogo = ({className}: WebsiteLogoProps) => {
  const {onClickToIndex} = usePageNavigate();
  const {loadImageAndCache, imageCache} = useImageLoad();
  const logoIconRes = `assets/${environment.uVersion}/${environment.mvVersion}/logo.png`;
  const expirationSec = 60 * 10;
  useEffect(() => {
    loadImageAndCache(logoIconRes, logoIconRes, expirationSec);
  }, []);
  return imageCache[logoIconRes]
    ? (<div className={twMerge("", className)}>
        <a>
          <img onClick={() => onClickToIndex()}
               alt={"logo"}
               src={imageCache[logoIconRes].cacheValue}
          />
        </a>
      </div>
    )
    : (<></>)
}
