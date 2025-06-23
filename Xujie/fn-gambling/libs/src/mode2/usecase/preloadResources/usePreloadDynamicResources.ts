import preloadResourcesInvoker from './command/PreloadResourcesInvoker';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import {
  ExtraDynamicResourceLevels,
  PreloadResourcesCommand,
} from '@mode2/usecase/preloadResources/command/PreloadResourcesCommand';
import { v4 as uuidv4 } from 'uuid';
import { useUpdateEffect } from '@libs/commonUtils';
import { usePreloadDynamicResourcesStore } from '../../zustand/preloadDynamicResourcesStore';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import {
  LOCAL_ICONS_MAPPING,
  LOCAL_NUMBER_IMGS_MAPPING,
  LOCAL_POPUP_BANNER_MAPPING,
  LOCAL_RESOURCES_MAPPING,
} from '@libs/constant/preloadImagesMapping';

const env = import.meta.env['VITE_V_VERSION'];

// TODO Evan 測試效能，有影響直接移除，另尋方案
export const usePreloadDynamicResources = () => {
  const hotGameList = useGameListStore((state) => state.hotGameList);
  const preloadResources = usePreloadDynamicResourcesStore(
    (state) => state.preloadResources
  );

  // hall game icons
  useUpdateEffect(() => {
    const localPopupBanners = LOCAL_POPUP_BANNER_MAPPING[env] || [];
    const localPopupBannersPreloadCommands = localPopupBanners.map((item) => {
      return new PreloadResourcesCommand({
        orderId: uuidv4(),
        src: getImgUrl(EResourceLevel.POPUP_BANNER, item),
        type: EResourceLevel.POPUP_BANNER,
      });
    });

    const localIcons = LOCAL_ICONS_MAPPING[env] || [];
    const localIconsPreloadCommands = localIcons.map((item) => {
      return new PreloadResourcesCommand({
        orderId: uuidv4(),
        src: getImgUrl(EResourceLevel.ICONS, item),
        type: EResourceLevel.ICONS,
      });
    });
    const localResources = LOCAL_RESOURCES_MAPPING[env] || [];
    const localResourcesPreloadCommands = localResources.map((item) => {
      return new PreloadResourcesCommand({
        orderId: uuidv4(),
        src: getImgUrl(EResourceLevel.V, item),
        type: EResourceLevel.V,
      });
    });
    const localNumberImgs = LOCAL_NUMBER_IMGS_MAPPING[env] || [];
    const localNumberImgsPreloadCommands = localNumberImgs.map((item) => {
      return new PreloadResourcesCommand({
        orderId: uuidv4(),
        src: getImgUrl(EResourceLevel.NUMBER_IMGS, item),
        type: EResourceLevel.NUMBER_IMGS,
      });
    });

    const preloadResourcesCommands = preloadResources.map((item) => {
      return new PreloadResourcesCommand({
        ...item,
        orderId: uuidv4(),
      });
    });
    preloadResourcesInvoker.addAllCommand([
      ...localPopupBannersPreloadCommands,
      ...localNumberImgsPreloadCommands,
      ...localIconsPreloadCommands,
      ...localResourcesPreloadCommands,
      ...preloadResourcesCommands,
    ]);
    preloadResourcesInvoker.executeNext();
  }, [preloadResources]);

  useUpdateEffect(() => {
    const allGameItems = hotGameList || [];
    const gameIconPreloadCommands = allGameItems.map((item) => {
      return new PreloadResourcesCommand({
        orderId: uuidv4(),
        src: item.coverImageSrc,
        type: ExtraDynamicResourceLevels.DYNAMIC_GAME_ICON,
      });
    });
    preloadResourcesInvoker.addAllCommand(gameIconPreloadCommands);
  }, [hotGameList]);
};
