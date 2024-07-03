import { Progress } from "antd";
import { environment } from "../../../../environments/environment";
// import {useSpring, animated, useSpringRef, useChain} from "@react-spring/web";
import { renderByUVersion } from "../../utils/renderByUVersion";
import { useEffect, useState } from "react";
import { useBreakpoint } from "../../pageTemplate/hooks/useBreakpoint";
import cx from "../../utils/cx";
import "./index.scss"
import { ProgressBar } from "../../components-bs/ProgressBar/env/u7";

const useProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 99) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 1; 
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return progress;
};

const U5GameLoadingBar = () => {
  const progress = useProgress();
  const { isDesktop } = useBreakpoint();
  return <Progress
    steps={25} percent={progress}
    trailColor="#665775" size="small"
    className={cx(isDesktop ? "u5-loading-bar-lg mt-4" : "u5-loading-bar mt-1", "u5-loading-bar-common")} />
}

const U3GameLoadingBar = () => {
  const progress = useProgress();

  return <Progress percent={progress}
    trailColor="#454954" strokeColor="#7AEFFF" size="small"
    className="w-60 tablet:w-80 desktop:w-[372] h-5 tablet:h-6 desktop:h-7 u3-progress" />
}

const U6GameLoadingBar = () => {
  const progress = useProgress();

  return <Progress percent={progress} showInfo={false} trailColor="#9885E0"
    className="w-[300px] h-6 u6-progress" />
}

const U7GameLoadingBar = () => {
  const progress = useProgress();
  const { isMobile } = useBreakpoint();
  return <ProgressBar
              gridNum={33}
              className="bg-transparent mobile:px-0 px-2 py-0 mobile:w-[400px] w-full h-[21px]"
              progressClassName=""
              progressColor="bg-linear-3-main shadow-[0px_-2px_4px_#00000040_inset,0px_2px_4px_#FFFFFF40_inset]"
              progressBgColor="bg-[var(--transparent-white-20)]"
              percentClassName=""
              barClassName="mobile:w-[340px]"
              progress={progress / 100}
            />
}


const DefaultLoadingBar = () => {
  return <div className={cx(
    "w-[200px] h-[26px]",
    "flex flex-row justify-center items-center",
    // "bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]",
    "rounded-[27px]",
    "pl-3",
    "py-1",
  )}>
    {/*<img*/}
    {/*  className={"w-[14px] h-[14px] mr-1"}*/}
    {/*  src={`assets/${environment.assetPrefix}/Subtract.png`}*/}
    {/*/>*/}
    {/*<img*/}
    {/*  className={"w-[14px] h-[14px] mr-1"}*/}
    {/*  src={`assets/${environment.assetPrefix}/Dice-Two.png`}*/}
    {/*/>*/}
    {/*<img*/}
    {/*  className={"w-[14px] h-[14px] mr-1"}*/}
    {/*  src={`assets/${environment.assetPrefix}/Dice-Two.png`}*/}
    {/*/>*/}
    {/*<animated.div style={props}>*/}
    <img
      className={"w-[14px] h-[14px] mr-2 loading-animation-1"}
      src={`assets/${environment.uVersion}/Subtract.png`}
    />
    {/*</animated.div>*/}

    {/*<animated.div style={props2}>*/}
    <img
      className={"w-[14px] h-[14px] mr-2 loading-animation-2"}
      src={`assets/${environment.uVersion}/Dice-Two.png`}
    />
    {/*</animated.div>*/}

    {/*<animated.div style={props3}>*/}
    <img
      className={"w-[14px] h-[14px] mr-2 loading-animation-3"}
      src={`assets/${environment.uVersion}/Dice-Two.png`}
    />
    {/*</animated.div>*/}
  </div>
}

export const LoadingBar = () => {
  // const commonAnimatedData = {
  //   from: {
  //     transform: "scale(0)",
  //   },
  //   to: {
  //     transform: "scale(1)",
  //   },
  // loop: true,
  // reset: true,
  // reverse: true,
  // config: {
  //   duration: 500,
  // },
  // }
  // const springRef1 = useSpringRef()
  // const [props , api] = useSpring(() => ({
  //   ...commonAnimatedData,
  //   ref: springRef1,
  //   config: {
  //     duration: 300,
  //   },
  // }));
  //
  // const springRef2 = useSpringRef()
  // const [props2 , api2] = useSpring(() => ({
  //   ...commonAnimatedData,
  //   ref: springRef2,
  //   config: {
  //     duration: 300,
  //   },
  // }));
  //
  // const springRef3 = useSpringRef()
  // const [props3 , api3] = useSpring(() => ({
  //   ...commonAnimatedData,
  //   ref: springRef3,
  //   config: {
  //     duration: 300,
  //   },
  // }));
  //
  // useChain([springRef1, springRef2, springRef3])

  return (
    renderByUVersion({
      "u5": <U5GameLoadingBar />,
      // "u3": <U3GameLoadingBar />,
      "u6": <U6GameLoadingBar />,
      "u7": <U7GameLoadingBar />,
    }, <DefaultLoadingBar />)
  )
}
