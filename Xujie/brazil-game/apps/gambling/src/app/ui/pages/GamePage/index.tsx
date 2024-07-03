import {useEffect, useRef, useState} from "react";

import {useLocation} from "react-router";
import queryString from 'query-string';

import {useStartGameMutation} from '../../../external';
import {useAllowLoginRouterRules} from "../../router/hooks/useAllowLoginRouterRules";
import useBreakpoint from "../../pageTemplate/hooks/useBreakpoint";
import {usePageNavigate} from "../../router/hooks/usePageNavigate";
import {GameBackNavigation} from "../../components-bs/BackNavigation/GameBackNavigation";
import {LeaveGameConfirmModal} from "../../modals/LeaveGameConfirmModal";
import {appSlice} from "../../../reduxStore/appSlice";
import {useDispatch} from "react-redux";
import {userRecentSlice} from "../../../reduxStore/userRecordSlice";
import {renderByUVersion} from "../../utils/renderByUVersion"
import cx from 'classnames';
import {environment} from "../../../../environments/environment";

export const GamePage = () => {
  useAllowLoginRouterRules();
  const [closeGame, setCloseGame] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const fromUrl  = queryString.parse(location.search)?.fromUrl;
  // [FRONTEND-317]
  // fromUrl 為了方便測試，必須為true，就走 query string
  // 不然就走 navigate.state
  const {gameId, label, gameName} = fromUrl === 'true'
          ? queryString.parse(location.search) as {
                                  gameId: string,
                                  label: string,
                                  gameName: string,
          }
          : location.state;
  const [triggerStartGame, {data, isLoading, isSuccess, isError}] = useStartGameMutation();
  // const urlParam = {
  //     "Fishing": "jiligames",
  //     "viver": "ppmater",
  //     "vivo": "ppmater",
  //     "PG-Slots": "pg",
  //     "PP-Slots": "ppmater",
  //     "CQ9-Slots": "cq9",
  //     "JILI-Slots": "jiligames",
  //     "FC-Slots": "fc",
  // }

  // const getGameBrand = (gameId: number): string | null => {
  //   // NOTE: 先写死，待后端开单一启动游戏API
  //   // 0-100 cc
  //   // 30000-40000 pg2 pgsoft2
  //   // 40000-50000 pp
  //   // 50000-54000 pg2 pgsoft2
  //   // 60000-61000 pp2 ppplay2
  //   // 61000-62000 pp2_vivo ppplay
  //   // 62000-63000 pp2_viver ??
  //   // 63000-64000 pp2 ppplay2
  //   // 80000-81000 jili jiligames
  //   // 100000-101000 JDB jdb
  //   // 110000-111000 FC fc
  //   // 130000-131000 CQ9 cq9
  //   // 140000-131000 CQ9 oneapi
  //   // 160001-169999 pggame
  //   if (30000 <= gameId && gameId < 40000) {
  //     return "pg";
  //   } else if (40000 <= gameId && gameId < 50000) {
  //     return "pp";
  //   } else if (50000 <= gameId && gameId < 54000) {
  //     return "pg";
  //   } else if (60000 <= gameId && gameId < 61000) {
  //     return "pp";
  //   } else if (61000 <= gameId && gameId < 62000) {
  //     return "pp";
  //   } else if (62000 <= gameId && gameId < 63000) {
  //     return "pp";
  //   } else if (63000 <= gameId && gameId < 64000) {
  //     return "pp";
  //   } else if (80000 <= gameId && gameId < 81000) {
  //     return "jiligames";
  //   } else if (100000 <= gameId && gameId < 101000) {
  //     return "jdb";
  //   } else if (110000 <= gameId && gameId < 111000) {
  //     return "fc";
  //   } else if (130000 <= gameId && gameId < 131000) {
  //     return "cq9";
  //   } else if (140000 <= gameId && gameId < 141000) {
  //     return "oneapi";
  //   } else if (150000 <= gameId && gameId < 151000) {
  //     return "pgapi";
  //   } else if (160001 <= gameId && gameId < 169999) {
  //     return "pggame";
  //   } else {
  //     return null;
  //   }
  // }

  const gameBrand = [
    {
      min: 30000,
      max: 40000,
      value: 'pg',
    },
    {
      min: 40000,
      max: 50000,
      value: 'pp',
    },
    {
      min: 50000,
      max: 54000,
      value: 'pg',
    },
    {
      min: 60000,
      max: 70000, // 2024/06/28  update
      value: 'pp',
    },
    {
      min: 80000,
      max: 81000,
      value: 'jiligames',
    },
    {
      min: 100000,
      max: 101000,
      value: 'jdb',
    },
    {
      min: 110000,
      max: 111000,
      value: 'fc',
    },
    {
      min: 130000,
      max: 131000,
      value: 'cq9',
    },
    {
      min: 140000,
      max: 141000,
      value: 'oneapi',
    },
    {
      min: 150000,
      max: 151000,
      value: 'pgapi',
    },
    {
      min: 160001,
      max: 169999,
      value: 'pggame',
    },
    {
      min: 170000,  // 2024/06/28 add
      max:180000,
      value: 'hotgame',
    }
  ];
  type ConfigValue = (typeof gameBrand)[number]['value'];
  const getGameBrand = (gameId: number): ConfigValue | null => {
    const result = gameBrand.find((v) => gameId >= v.min && gameId < v.max);
    return result?.value || null;
  };
  
  const {isMobile} = useBreakpoint();

  useEffect(() => {
    dispatch(appSlice.actions.setUILoading({
      isLoading:true,
      loadingIcon:`${environment.s3URLImages}/${gameId}-small.png`
    }));

    const gameID = Number(gameId);
    const gameBrand = getGameBrand(Number(gameId)) //urlParam[label as keyof typeof urlParam];
    if (gameBrand) {
      triggerStartGame({
        clientType: isMobile ? "mobile" : "pc",
        exitStatus: 0,
        gameId: gameID,
        gameBrand: gameBrand
      }).finally(() => {
        dispatch(appSlice.actions.setUILoading({isLoading:false}));
      })
    } else {
      alert("Game Brand is error")
    }
  }, []);

  const {onClickToIndex} = usePageNavigate();

  const onConfirmClose = (addFavorite: boolean) => {
    addFavorite &&
    dispatch(userRecentSlice.actions.setUserFavoriteGame({
      gameId: gameId,
      name: gameName,
      label: label,
    }))
    onClickToIndex()
  }

  // const onIframeLoadStart = () => {
  // dispatch(appSlice.actions.setIsUILoading(true));
  // }
  // const onIframeLoad = () => {
  //   dispatch(appSlice.actions.setIsUILoading(false));
  // }

  const htmlRef = useRef();
  useEffect(() => {
    if (data?.startType === "HTML" && data.htmlContent) {
      if (htmlRef && htmlRef.current) {
        const iframe = htmlRef.current as HTMLIFrameElement;    
        try {
          if (iframe?.contentWindow && iframe?.contentWindow?.document) {
            iframe.contentWindow.document.write(data.htmlContent);
          }         
        }catch(error){
          console.error(error)
        }

      }
    }
  }, [htmlRef.current, data?.htmlContent])

  const backNavProps = () => {
    return renderByUVersion({
      "u5": "",
      "u6": "",
      "u7":'',
    }, "h-[40px] md:h-[52px] lg:h-[56px]")
  }

  const gamePageStyle = () => {
    return renderByUVersion({
      'u5': '!h-full',
      'u6': '!h-full',
      "u7": '!h-full',
    }, 'mobile:top-0 tablet:top-[52px] desktop:top-[56px]')
  }

  // 'top-[40px] md:top-[52px] lg:top-[56px]'

  return (
    <div className={'relative h-full'}>
      {
        !closeGame && !isMobile && (<GameBackNavigation className={backNavProps} onClick={() => setCloseGame(true)}/>)
      }
      {
        closeGame && (
          <LeaveGameConfirmModal
            onConfirm={onConfirmClose}
            onClose={() => {
              setCloseGame(false)
              dispatch(appSlice.actions.setUILoading({isLoading:false}));
            }}
          />
        )
      }
      {data !== undefined && data.startType === "LINK" && (
        <iframe
          className={cx(` w-[100vw] h-[calc(100%)] md:h-[calc(100%)] lg:h-[calc(100%-56px)] relative `, gamePageStyle())}
          src={data.link}
          // onLoadStart={onIframeLoadStart}
          // onLoad={onIframeLoad}
        />
      )}

      {data !== undefined && data.startType === "HTML" && data.htmlContent && (
        <iframe
          id="game-iframe"
          ref={htmlRef as any}
          className={cx(' w-[100vw] h-[calc(100%)] md:h-[calc(100%-52px)] lg:h-[calc(100%-56px)] relative ', gamePageStyle())}
          // className={`w-full h-full`}
        />
      )}

      {
          !closeGame && isMobile &&
          <div className={'absolute left-[13px] top-[23px] h-16 w-16 cursor-pointer'} onClick={() => { setCloseGame(true);}}>
            <img className={'h-12 w-12 hover:brightness-[1.3] active:brightness-[0.7]'} alt="" src={`assets/shared/ic_exit_game.png`} />
          </div>
      }
    </div>
  );
};
