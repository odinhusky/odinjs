import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostEnterGameMutation } from '@mode2API/index';
import {
  EnterGameRequest,
  LaunchType,
} from '@mode2API/endpoint/game/PostEnterGameEndpoint';

import { useDeepEffect } from '@commonUtils/hooks';
import RechargeContent from '@components/RechargeContent';
import { useMode2WebviewPageStore } from '@mode2/zustand/page/webviewPageStore';
import { useAppStore } from '@mode2/zustand/appStore';
import { cx } from '@libs/commonUtils';
import { useGameLoadingStore } from '@mode2/zustand/components/gameLoadingStore';
import queryString from 'query-string';
import { isEmpty, isNil } from 'lodash';
import { EnterGameParams } from '@mode2/usecase/useGameItemBase';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { RechargeConfirmationModal } from '@modals/RechargeConfirmationModal';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import useWebviewPageBase from '@/ui/hooks/pages/webViewPage/useWebviewPageBase';

const defaultParams: EnterGameParams = {
  id: null,
  url: '',
  launchType: -1,
};
const WebviewPage = () => {
  useWebviewPageBase();
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );
  const { navToHallPage } = useNavPageClick();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = useLocation();

  const getParams = (): EnterGameParams => {
    // 支援 QA 測試 接口 [../game?id=12345]
    if (location.search) {
      const parsedParams = queryString.parse(location.search);
      return {
        id: parsedParams.id ? Number(parsedParams.id) : null,
        url: (parsedParams.url as string) || '',
        launchType: parsedParams.launchType
          ? (Number(parsedParams.launchType) as LaunchType)
          : -1,
      };
    }

    // 先從 主畫面請求過 API 成功再進入 遊戲畫面， 遊戲大廳相同
    if (location.state) {
      const params = {
        ...location.state,
      } as EnterGameParams;
      // 替換當前 state
      window.history.replaceState(
        { id: location.state.id },
        '',
        location.pathname
      );
      return params;
    }

    // 刷新 只拿到 gameId 去請求 API
    if (window.history.state) {
      return {
        ...defaultParams,
        id: window.history.state.id,
      };
    }

    return defaultParams;
  };

  const params = getParams();

  const [enterGameState, setEnterGameState] = useState<EnterGameParams>(params);

  const isShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.isShowRechargeContent
  );
  const setIsShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.setIsShowRechargeContent
  );
  const setIsShowGameLoading = useGameLoadingStore(
    (state) => state.setIsShowGameLoading
  );

  const isShowGameLoading = useGameLoadingStore(
    (state) => state.isShowGameLoading
  );

  const setReqClientParameter = useAppStore.getState().setReqClientParameter;

  const [postEnterGame, { data: enterGameData, isSuccess, isError }] =
    usePostEnterGameMutation();

  useDeepEffect(() => {
    const checkIframeDomain = () => {
      try {
        const iframeDocument = iframeRef.current?.contentWindow?.document;
        const iframeDomain = iframeDocument?.domain;
        if (iframeDomain === window.location.hostname) {
          navToHallPage();
        }
      } catch (e) {
        console.error('Cannot access iframe content due to CORS policy', e);
      }
    };

    if (enterGameState.launchType === LaunchType.IFRAME) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.addEventListener('load', checkIframeDomain);

        iframe.addEventListener('error', () => {
          console.log('@@ iframe error');
        });
      }

      return () => {
        if (iframe) {
          iframe.removeEventListener('load', checkIframeDomain);
        }
      };
    }
  }, [location.pathname, enterGameState]);

  useEffect(() => {
    setIsShowGameLoading(true);
    return () => {
      setIsShowGameLoading(false);
    };
  }, []);

  useDeepEffect(() => {
    if (!isEmpty(params.url)) {
      setTimeout(() => {
        setIsShowGameLoading(false);
      }, 100);
    }

    if (!isNil(params.id) && isEmpty(params.url)) {
      const requestData: EnterGameRequest = {
        gameId: +params.id,
      };
      setIsShowGameLoading(true);
      postEnterGame(requestData);
    }
  }, [params]);

  useEffect(() => {
    if (
      (enterGameData && enterGameData?.launchType === LaunchType.IFRAME) ||
      isError
    ) {
      setIsShowGameLoading(false);
    }

    if (enterGameData && enterGameData?.launchType === LaunchType.REDIRECT) {
      window.location.href = enterGameData.url;
      return;
    }
  }, [enterGameData, isError]);

  useEffect(() => {
    if (enterGameData && isSuccess) {
      setEnterGameState({
        id: 0,
        url: enterGameData.url,
        launchType: enterGameData.launchType,
      });
      setIsShowGameLoading(false);
    }
  }, [enterGameData, isSuccess]);

  useEffect(() => {
    setReqClientParameter('game');
    return () => {
      setIsShowRechargeContent(false);
      setReqClientParameter('');
    };
  }, []);

  return (
    <div
      className={cx('relative', {
        '-mx-5 mobile:-mx-0': !isShowRechargeContent,
      })}
      style={{
        height: `calc(100vh - ${headerElMetrics.height}px)`,
      }}
    >
      <RechargeConfirmationModal />
      {enterGameState && enterGameState.launchType === LaunchType.IFRAME ? (
        <iframe
          ref={iframeRef}
          title="game iframe"
          id="game-iframe"
          className={cx(
            'w-full h-full',
            isShowRechargeContent ? 'opacity-0' : ''
          )}
          src={enterGameState.url}
        />
      ) : null}

      {isShowGameLoading ? (
        <div
          className={'absolute top-0 left-0 w-full h-full bgi-[var(--bg-main)]'}
        >
          {' '}
        </div>
      ) : null}

      {isShowRechargeContent && (
        <div className="absolute z-[5] h-full w-full top-0 left-0">
          <RechargeContent isRechargeFromGame={true} />
        </div>
      )}
    </div>
  );
};
export default WebviewPage;
