import { useRef } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';

interface InternalPayContentProps {
  id: string;
  title: string;
}

/**
 * use pay === UPI pay
 * @param props
 * @constructor
 */
export const InternalPayContent = (props: InternalPayContentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rechargeResult = useRechargeStore((state) => state.rechargeResult);
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);

  useDeepEffect(() => {
    const onLoad = () => {
      try {
        const iframeDocument = iframeRef.current?.contentWindow?.document;
        const iframeDomain = iframeDocument?.domain;
        const iframeURL =
          iframeRef.current?.contentWindow?.location?.href || '';
        const searchParams = new URLSearchParams(new URL(iframeURL).search);
        if (
          iframeDomain === window.location.hostname ||
          searchParams.get('action') === 'finishRecharge'
        ) {
          setTimeout(() => {
            finishRecharge();
          }, 1000 * 3);
        }
      } catch (e) {
        console.error('Cannot access iframe content due to CORS policy', e);
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', onLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', onLoad);
      }
    };
  }, [rechargeResult]);

  return (
    <iframe
      ref={iframeRef}
      id={props.id}
      title={props.title}
      className="w-full h-screen bg-white"
      src={rechargeResult.rechargeUrl}
    />
  );
};
