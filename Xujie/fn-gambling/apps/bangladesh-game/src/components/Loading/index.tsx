import { Spin } from 'antd';
import './index.scss';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';


const Loading = ({ tip = 'Loading' }: { tip?: string }) => {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4
  };

  const isShowLoading = useLoadingStore(state => state.isShowLoading);
  const content = <div style={contentStyle} />;
  return isShowLoading ? <Spin tip={tip} size="large" className="request-loading" fullscreen>{content}</Spin> : null;
};

export default Loading;
