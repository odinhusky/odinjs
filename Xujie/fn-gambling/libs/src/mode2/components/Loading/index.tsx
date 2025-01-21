import { Spin } from "antd";
import "./index.scss";
import React from 'react';


const Loading = ({ tip = "Loading" }: { tip?: string }) => {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return <Spin tip={tip} size="large" className="request-loading" fullscreen>{content}</Spin>;
};

export default Loading;
