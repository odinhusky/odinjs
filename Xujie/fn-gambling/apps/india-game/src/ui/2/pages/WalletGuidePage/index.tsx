import useMobileExclusiveWalletGuidePageOverride from './useMobileExclusiveWalletGuidePageOverride';
import React, { useMemo } from 'react';
import VideoTutorialsContent from './components/VideoTutorialsContent';
import GraphicTutorialContent from './components/GraphicTutorialContent';
import WalletGuideTutorialTabs from './components/WalletGuideTutorialTabs';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';

// TODO Evan
// TODO i18n
// TODO 觀賞教學任務獎勵
// TODO 教學影片，圖像資源
export const WalletGuidePage = () => {
  useMobileExclusiveWalletGuidePageOverride();
  const currentTutorialsTab = useWalletGuidePageStore(
    (state) => state.currentTutorialsTab
  );

  const tutorialsContent = useMemo(() => {
    switch (currentTutorialsTab) {
      case WalletGuideTutorialsType.VIDEO:
        return <VideoTutorialsContent />;
      case WalletGuideTutorialsType.GRAPHIC:
        return <GraphicTutorialContent />;
    }
  }, [currentTutorialsTab]);

  return (
    <div className="flex flex-col gap-4 pb-16">
      <WalletGuideTutorialTabs />

      {tutorialsContent}
    </div>
  );
};

export default WalletGuidePage;
