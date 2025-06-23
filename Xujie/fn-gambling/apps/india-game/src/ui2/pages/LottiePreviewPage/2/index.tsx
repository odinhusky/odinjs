import { useState, useRef } from 'react';
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Upload, Button, message } from 'antd';
import { cx } from '@libs/commonUtils';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { PostHogFeatureTypes } from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

// 定義每個 Lottie 的狀態
type LottieItem = {
  id: string;
  url: string;
  isPlaying: boolean;
  speed: number;
  instance?: DotLottie | null;
  className?: string;
  totalFrames: number;
  currentFrame: number;
};

const SHOWINDEX = '5'; // 控制顯示的 Lottie 索引

export const LottiePreviewPage = () => {
  const lottiePreviewEnabled = useFeatureFlagEnabled(
    PostHogFeatureTypes.lottiePreview.flag
  );
  console.log(
    '@@@===>PostHogFeature.lottiePreviewEnabled',
    lottiePreviewEnabled
  );

  const previewList = [
    {
      url: 'https://assets1.lottiefiles.com/packages/lf20_tll0j4bb.json',
      className: 'bg-amber-500',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/68f92d2c-1152-11ee-a777-4f5edf50fe6a/iKwr1YpPEI.lottie',
      className: 'bg-gray-300',
    },
    {
      url: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
      className: 'bg-cyan-500',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/ca963e58-116b-11ee-9861-1b9f5993d85a/1VWwwvmWyi.lottie',
      className: 'bg-blue-600',
    },
    {
      url: 'https://lottie.host/219addcb-001a-4f28-9946-682437b0aed0/5sWC2VR1HH.lottie',
      className: '',
    },
    {
      url: 'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json', // 幀數是否與案例一致 https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-react/usage/
      className: '',
    },
    {
      url: 'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
      className: 'col-span-2 row-span-2',
    },
    {
      url: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
      className: '',
    },
    {
      url: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
      className: '',
    },
    {
      url: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
      className: '',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/2d065ab8-1181-11ee-a345-6f277daa151e/xVlnZEtX9O.lottie',
      className: 'bg-gray-100',
    },
    {
      url: 'https://lottie.host/7a42f6dd-762d-452f-b889-60ec8b97b927/JFu1CzQGlI.lottie',
      className: 'bg-gray-200',
    },
    {
      url: 'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json',
      className: '',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/a4d75b10-1176-11ee-925d-9f4f2bc6a728/kpKOWuB2Wk.lottie',
      className: 'bg-black',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/bfce551a-3f40-11ef-ada4-cbe30d9de7bf/474F5QxMIF.lottie',
      className: 'bg-black',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/bf687bf0-1179-11ee-8f10-2b41db17f71f/XDqKdzjYKJ.lottie',
      className: '',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/2d09bac8-1181-11ee-a346-8b7e1784be2d/2WIVPmvn2l.lottie',
      className: '',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/ec82d25c-1151-11ee-ab7c-a3dba8a407c8/D8BX4tNKSJ.lottie',
      className: 'bg-white',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/2096d04c-118a-11ee-81f9-073d85ea5d7d/dFqrHwIyZ8.lottie',
      className: '',
    },
    {
      url: 'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json',
      className: '',
    },
    {
      url: 'https://assets6.lottiefiles.com/packages/lf20_3rwasyjy.json',
      className: '',
    },
    {
      url: 'https://assets-v2.lottiefiles.com/a/782605bc-1171-11ee-af0b-cfb2e16d5b8b/r1F2Xlt8El.lottie',
      className: 'bg-white',
    },
  ];
  // const urls = [
  //   'https://assets1.lottiefiles.com/packages/lf20_tll0j4bb.json',
  //   'https://assets-v2.lottiefiles.com/a/68f92d2c-1152-11ee-a777-4f5edf50fe6a/iKwr1YpPEI.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://assets-v2.lottiefiles.com/a/ca963e58-116b-11ee-9861-1b9f5993d85a/1VWwwvmWyi.lottie',
  //   'https://lottie.host/219addcb-001a-4f28-9946-682437b0aed0/5sWC2VR1HH.lottie',
  //   'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://assets-v2.lottiefiles.com/a/2d065ab8-1181-11ee-a345-6f277daa151e/xVlnZEtX9O.lottie',
  //   'https://lottie.host/7a42f6dd-762d-452f-b889-60ec8b97b927/JFu1CzQGlI.lottie',
  //   'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json',
  //   'https://assets-v2.lottiefiles.com/a/a4d75b10-1176-11ee-925d-9f4f2bc6a728/kpKOWuB2Wk.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://assets-v2.lottiefiles.com/a/2d09bac8-1181-11ee-a346-8b7e1784be2d/2WIVPmvn2l.lottie',
  //   'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
  //   'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json',
  //   'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json',
  //   'https://assets6.lottiefiles.com/packages/lf20_3rwasyjy.json',
  //   'https://assets-v2.lottiefiles.com/a/782605bc-1171-11ee-af0b-cfb2e16d5b8b/r1F2Xlt8El.lottie',
  // ];

  const createLottieItem = (
    url: string,
    className: string,
    index: number
  ): LottieItem => ({
    id: index.toString(),
    url,
    isPlaying: true,
    speed: 1,
    instance: null,
    className,
    currentFrame: 0,
    totalFrames: 0,
  });

  const [lotties, setLotties] = useState<LottieItem[]>(
    previewList.map(({ url, className }, index) =>
      createLottieItem(url, className, index)
    )
  );

  const playerRef = useRef<DotLottie | null>(null);
  const handleUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['json', 'lottie'].includes(ext || '')) {
      message.error('Please upload a .json or .lottie file');
      return false;
    }

    const fileUrl = URL.createObjectURL(file);

    setLotties((prev) => [
      createLottieItem(fileUrl, '', previewList.length),
      ...prev,
    ]); // 放到最前面

    setTimeout(() => {
      playerRef.current?.play();
    }, 100);

    return false;
  };

  const handleRefCallback = (id: string, instance: DotLottie | null) => {
    if (!instance) return;

    setLotties((prev) =>
      prev.map((i) => (i.id === id ? { ...i, instance } : i))
    );

    // 只監聽 SHOWINDEX 的幀數追蹤
    if (id === SHOWINDEX) {
      // const onFrame = (event: { currentFrame: number }) => {
      //   setLotties((prev) =>
      //     prev.map((item) =>
      //       item.id === id
      //         ? { ...item, currentFrame: event.currentFrame }
      //         : item
      //     )
      //   );
      // };

      const onLoad = () => {
        setLotties((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, totalFrames: instance?.totalFrames || 0 }
              : item
          )
        );
      };

      // instance.removeEventListener('frame', onFrame);
      instance.removeEventListener('load', onLoad);

      // instance.addEventListener('frame', onFrame);
      instance.addEventListener('load', onLoad);
    }
  };

  const handlePlay = (id: string) => {
    const item = lotties.find((i) => i.id === id);
    item?.instance?.play();
    setLotties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPlaying: true } : item))
    );
  };

  const handlePause = (id: string) => {
    const item = lotties.find((i) => i.id === id);
    item?.instance?.pause();
    setLotties((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPlaying: false } : item
      )
    );
  };

  const handleStop = (id: string) => {
    const item = lotties.find((i) => i.id === id);
    item?.instance?.stop();
    setLotties((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPlaying: false } : item
      )
    );
  };

  const handleSpeedChange = (id: string, speed: number) => {
    const item = lotties.find((i) => i.id === id);
    item?.instance?.setSpeed(speed);
    setLotties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, speed } : item))
    );
  };

  // 跳轉到指定 frame 幀數
  const handleFrameChange = (id: string, newFrame: number) => {
    const item = lotties.find((i) => i.id === id);
    setLotties((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentFrame: newFrame } : item
      )
    );
    if (item) {
      item.instance?.setFrame(newFrame);
      item.instance?.stop();
    }
  };

  return lottiePreviewEnabled ? (
    <div className="p-6 bg-blue-50 h-full overflow-y-auto pb-20">
      <h2>Lottie Preview Page</h2>

      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        accept=".json,.lottie"
        maxCount={1}
      >
        <Button>上傳 Lottie 檔 (.json / .lottie)</Button>
      </Upload>

      <div>
        可至
        <a href="https://lottiefiles.com/" target="_blank" rel="noreferrer">
          LottieFiles
        </a>
        下載動畫。
      </div>

      <div
        className={cx(
          'w-full ',
          // 'flex flex-wrap justify-center gap-16',
          'grid grid-cols-4 gap-1'
        )}
      >
        {lotties.map((item, index) => (
          <div
            key={item.id}
            className={cx(
              'h-auto m-2 bg-orange-400 rounded shadow',
              'aspect-square',
              // {
              //   'col-span-2 row-span-2': index === 5,
              // },
              item.className
            )}
          >
            <DotLottieReact
              className={'items-center aspect-square'}
              key={item.id}
              src={item.url}
              autoplay={item.isPlaying}
              loop
              speed={item.speed}
              dotLottieRefCallback={(instance) =>
                handleRefCallback(item.id, instance)
              }
              style={{ width: '80%', height: '80%' }}
            />

            {item.id === SHOWINDEX ? (
              <>
                <div className="mt-4 flex justify-between space-x-1">
                  <Button
                    size="small"
                    type="text"
                    onClick={() => handlePlay(item.id)}
                  >
                    <span role="img" aria-label="Play">
                      ▶️
                    </span>
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => handlePause(item.id)}
                  >
                    ⏸
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    danger
                    onClick={() => handleStop(item.id)}
                  >
                    ⏹
                  </Button>
                </div>

                {/* 倍速控制 */}
                <div className="mt-1 mx-2 text-xs">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={item.speed}
                    onChange={(e) =>
                      handleSpeedChange(item.id, parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <span>{item.speed.toFixed(1)}x</span>
                </div>

                {/* 幀數控制 */}
                <div className="mx-2">
                  <div className="text-xxs text-black font-smaller">
                    幀數控制(可拖動)。連動效果可在程式碼裡解開 onFrame 相關註解查看
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(item.totalFrames, 1)}
                    value={item.currentFrame}
                    onChange={(e) =>
                      handleFrameChange(item.id, parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-center">
                    <span>{Math.floor(item.currentFrame || 0)}</span>
                    <span>/</span>
                    <span>{Math.floor(item.totalFrames || 0)}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default LottiePreviewPage;
