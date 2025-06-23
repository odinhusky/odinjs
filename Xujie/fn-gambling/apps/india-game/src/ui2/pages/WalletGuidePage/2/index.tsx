import useMobileExclusiveWalletGuidePageOverride from './useMobileExclusiveWalletGuidePageOverride';
import GraphicTutorialContent from './components/GraphicTutorialContent';

// TODO Evan
// TODO 觀賞教學任務獎勵
// TODO 教學影片，圖像資源
export const WalletGuidePage = () => {
  useMobileExclusiveWalletGuidePageOverride();
  // const currentTutorialsTab = useWalletGuidePageStore(
  //   (state) => state.currentTutorialsTab
  // );

  // const tutorialsContent = useMemo(() => {
  //   switch (currentTutorialsTab) {
  //     case WalletGuideTutorialsType.VIDEO:
  //       return <VideoTutorialsContent />;
  //     case WalletGuideTutorialsType.GRAPHIC:
  //       return <GraphicTutorialContent />;
  //   }
  // }, [currentTutorialsTab]);

  return (
    <div className="flex flex-col gap-4 pb-16">
      {/* <WalletGuideTutorialTabs /> */}
      {/* {tutorialsContent} */}
      <GraphicTutorialContent />;
    </div>
  );
};

export default WalletGuidePage;
