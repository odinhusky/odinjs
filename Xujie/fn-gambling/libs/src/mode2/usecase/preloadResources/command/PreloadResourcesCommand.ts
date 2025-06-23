import { ICommand } from '@libs/design/commandPattern/ICommand';
import {
  CacheData,
  GAME_IMAGE_CACHE_DURATION,
  ICON_CACHE_DURATION,
} from '@mode2/usecase/useImageCache';
import preloadResourcesInvoker from '@mode2/usecase/preloadResources/command/PreloadResourcesInvoker';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { imageStore } from '@mode2/localforage/stroe';
import dayjs from '@commonUtils/localizedDayjs';
import { useImageCacheStore } from '@mode2/zustand/useImageCacheStore';
import axios from 'axios';

export type PreloadType =
  | EResourceLevel
  | (typeof ExtraDynamicResourceLevels)[keyof typeof ExtraDynamicResourceLevels];

export const ExtraDynamicResourceLevels = {
  DYNAMIC: 'dynamic',
  DYNAMIC_GAME_ICON: 'dynamic_game_icon',
  DYNAMIC_BANNER: 'dynamic_banner',
} as const;

interface PreloadResourcesCommandProps {
  orderId: string;
  src: string;
  type: PreloadType;
}

export class PreloadResourcesCommand implements ICommand {
  orderId: string;
  private props: PreloadResourcesCommandProps;

  constructor(props: PreloadResourcesCommandProps) {
    this.orderId = props.orderId;
    this.props = props;
  }

  execute(): void {
    const cacheDuration =
      this.props.type === EResourceLevel.ICONS
        ? ICON_CACHE_DURATION
        : GAME_IMAGE_CACHE_DURATION;

    const isLocalRes = Object.values(EResourceLevel).includes(
      this.props.type as EResourceLevel
    );

    const version =
      // isLocalRes && this.props.type === EResourceLevel.ICONS
      isLocalRes
        ? `_${String(import.meta.env['VITE_ICON_VERSION'] || '')}`
        : '';
    const delayTime = isLocalRes ? 50 : 500;
    const src = this.props.src;
    // isLocalRes
    //   ? getImgUrl(this.props.type as EResourceLevel, this.props.src, '.webp')
    //   : this.props.src;

    this.asyncHandlePreloadCacheData(
      src,
      cacheDuration,
      isLocalRes,
      version
    ).then((res) => {
      setTimeout(
        () => {
          preloadResourcesInvoker.executeNext();
        },
        res && res?.isNoDelay ? 0 : delayTime
      );
    });
  }

  async asyncHandlePreloadCacheData(
    src: string,
    cacheDuration: number,
    isLocalRes: boolean = false,
    version: string = ''
  ): Promise<{ isNoDelay: boolean } | void> {
    if (
      src.startsWith(`${window.location.origin}/resources/`) ||
      src.startsWith('/resources') ||
      src.startsWith(`${window.location.origin}/static/`) ||
      src.startsWith('/static') ||
      src.startsWith('/images') ||
      isLocalRes
    ) {
      const keyName = `${src}${version}`;
      const cachedItem: CacheData | null = await imageStore.getItem<CacheData>(
        keyName
      );
      const now = dayjs().unix();

      // cacheDuration <= 0 表示永久緩存
      const isExpired =
        cacheDuration > 0
          ? now - (cachedItem?.lastUpdateTime || 0) >= cacheDuration
          : false;

      if (
        cachedItem === null || // 緩存無資料
        isExpired // 緩存 expTime 過期
      ) {
        try {
          const resp = await axios(src, { responseType: 'blob' });
          if (resp.status !== 200) {
            return Promise.resolve();
          }
          const newData: CacheData = {
            data: resp.data,
            lastUpdateTime: now,
          };
          await imageStore.setItem(keyName, newData);
          const newCacheData = { [`${src}`]: URL.createObjectURL(resp.data) };
          useImageCacheStore.getState().setImageCache(newCacheData);
          return Promise.resolve({
            isNoDelay: false,
          });
        } catch (e) {
          console.error('Handle Cache Data Error', e);
          return Promise.resolve({
            isNoDelay: true,
          });
        }
      } else {
        return Promise.resolve({
          isNoDelay: true,
        });
      }
    } else {
      return Promise.resolve({
        isNoDelay: true,
      });
    }
  }
}
