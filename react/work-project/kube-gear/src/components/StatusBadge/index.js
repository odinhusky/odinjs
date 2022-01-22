import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';

export const statusColorMapping = {
  waiting: '#FFC107',
  running: '#2196F3',
  succeeded: '#19BB7B',
  unknown: '#9E9E9E',
  failed: '#F44336'
};

export const IconBadge = ({ children, style, icon, containerStyle }) => {
  return (
    <div style={{ fontSize: '14px', color: '#fff', display: 'flex', ...style }}>
      <div
        style={
          containerStyle ? containerStyle :
            { padding: '5px 20px 5px 20px', alignItems: 'center', position: 'relative', color: '#fff' }
        }
      >
        <Icon>{icon}</Icon>
        <div style={{ marginLeft: 10 }}>{children}</div>
      </div>
    </div>
  );
}

IconBadge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.string,
  containerStyle: PropTypes.object,
  style: PropTypes.style
};

const bgYellow = ({ backgroundColor: statusColorMapping.waiting, borderRadius: 4 });
const bgRed = ({ backgroundColor: statusColorMapping.failed, borderRadius: 4 });
const bgBlue = ({ backgroundColor: statusColorMapping.running, borderRadius: 4 });
const bgGreen = ({ backgroundColor: statusColorMapping.succeeded, borderRadius: 4 });
const bgGray = ({ backgroundColor: statusColorMapping.unknown, borderRadius: 4 });

export const SucceededBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'check_circle_outline'}
    style={bgGreen}
    {...props}
  >
    {children}
  </IconBadge>
);

SucceededBadge.propTypes = {
  children: PropTypes.node
};

export const PrimaryBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'donut_large'}
    style={bgBlue}
    {...props}
  >
    {children}
  </IconBadge>
);

PrimaryBadge.propTypes = {
  children: PropTypes.node
};

export const WaitingBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'query_builder'}
    style={bgYellow}
    {...props}
  >
    {children}
  </IconBadge>
);

WaitingBadge.propTypes = {
  children: PropTypes.node
};

export const FailedBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'highlight_off'}
    style={bgRed}
    {...props}
  >
    {children}
  </IconBadge>
);

FailedBadge.propTypes = {
  children: PropTypes.node
};

export const StoppedBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'remove_circle_outline'}
    style={bgGray}
    {...props}
  >
    {children}
  </IconBadge>
);

StoppedBadge.propTypes = {
  children: PropTypes.node
};

export const UnknownBadge = ({ children, ...props }) => (
  <IconBadge
    icon={'outline_cancel'}
    style={bgGray}
    {...props}
  >
    {children || 'Unknown'}
  </IconBadge>
);

UnknownBadge.propTypes = {
  children: PropTypes.node
};

export const StatusBadge = ({ status, trans, ...props }) => {
  switch (status) {
    case 'Running': case '运行':
      return <PrimaryBadge {...props}>{trans('running')}</PrimaryBadge>;
    case 'Stopping': case '停止中':
      return <StoppedBadge {...props}>{trans('stopping')}</StoppedBadge>;
    case 'Waiting': case '等待中':
      return <WaitingBadge {...props}>{trans('waiting')}</WaitingBadge>;
    case 'Failed': case '失败':
      return <FailedBadge {...props}>{trans('fail')}</FailedBadge>;
    case 'Succeeded': case '成功':
      return <SucceededBadge {...props}>{trans('Completed')}</SucceededBadge>;
    case 'Stopped': case '停止':
      return <StoppedBadge {...props}>{trans('Stop')}</StoppedBadge>;
    case 'Unknown': case '未知':
      return <UnknownBadge {...props}>{trans('unknow')}</UnknownBadge>;
    default:
      return <UnknownBadge {...props}>{trans('unknow')}</UnknownBadge>;
  }
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['Running', 'Stopping', 'Waiting', 'Failed', 'Succeeded', 'Stopped', 'Unknown'].concat(['运行', '停止中', '等待中', '失败', '成功', '停止', '未知'])),
  trans: PropTypes.func
};

export default StatusBadge;
