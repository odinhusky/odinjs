import { useSocialListBase } from '@mode2/usecase/components/useSocialListBase';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { usePlatformGlobalConfig } from '@mode2/usecase/platform/usePlatformGlobalConfig';
import { useCustomerServiceListBase } from '@/hooks/components/useCustomerServiceListBase';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import { useManufacturerListBase } from '@mode2/usecase/components/useManufacturerListBase';
import useLogoutEffect from '../useLogoutEffect';
import { useNativePassiveJSInteraction } from '@mode2/usecase/useNativePassiveJSInteraction';
import { useGameList } from '@mode2/usecase/useGameList';
import { useFooterBase } from '@/hooks/components/useFooterBase';
import useKYCInit from '@/usecase/useKYCInit';
import useActivityCenterBase from '@libs/mode2/usecase/useActivityCenterBase';

import useClearCacheStorage from '@mode2/usecase/useClearCacheStorage';
import useAvoidApkRecycling from '@mode2/usecase/useAvoidApkRecycling';
import useRecentGameList from '@mode2/usecase/useRecentGameList';
import { useBottomNavigationBase } from '@mode2/usecase/components/useBottomNavigationBase';
import useRechargeWheelPlayerProgress from '@libs/mode2/usecase/page/rechargeWheelPage/useRechargeWheelPlayerProgress';
import useUserInfo from '@libs/mode2/usecase/useUserInfo';
import useMenuListBase from '@mode2/usecase/components/useMenuListBase';
import { usePromoteHomeBase } from '@mode2/usecase/usePromoteHomeBase';

export const useTemplateLayoutBase = () => {
  /**
   * 初始 平台設定 & 全局所需要的參數
   */
  usePlatformGlobalConfig();
  // 初始 平台設定 & 全局所需要的參數 --- end

  // 移動到這裡，API 太亂，很多地方需要 CustomerService
  useGameList();

  // API: mainInfo, userInfo 的掛載
  useUserInfo();

  // KYC 初始化
  useKYCInit();

  // 菜單列表
  useMenuListBase();

  useCustomerServiceListBase();

  // 社交列表
  useSocialListBase();

  // 遊戲供應商清單
  useManufacturerListBase();

  // 頁尾
  useFooterBase();

  // 浮動按鈕
  useFloatActionButtonBase();

  // 需要的邀請連結 & code
  usePromoteHomeBase();

  // 活动中心
  useActivityCenterBase();

  // 底部導航
  useBottomNavigationBase();

  // Native AppLink || DeepLink & oneSignalId upload
  useNativePassiveJSInteraction();

  // 註冊 firebase onMessage
  useEffect(() => {
    // 监听前台消息
    const subscribeToMessages = async () => {
      const unsubscribe = await sdkUtils.onPushMessage((payload) => {
        // TODO show in app message
      });
      return unsubscribe;
    };

    const setupSubscription = async () => {
      const unsubscribe = await subscribeToMessages();
      // 返回清理函数
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };
    setupSubscription();
  }, []);

  // 登出後的Effect，包含導頁至 hallPage 以及 關閉 MyDrawer
  useLogoutEffect();

  // 清除 Cache Storage 的邏輯
  useClearCacheStorage();

  // 避免 apk GC
  useAvoidApkRecycling();

  // 移動到這裡因為首頁的 FloatButton 也要該資料
  // === Recharge Wheel Current Deposit & spinProgress
  useRechargeWheelPlayerProgress();

  // Recent
  useRecentGameList();
};
