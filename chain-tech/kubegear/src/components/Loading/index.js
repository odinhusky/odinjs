import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  mask: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, .5)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99999
  }
}
const Loading = () => {
  return (
    <div style={styles.mask}>
      <CircularProgress />
      <span style={{ color: '#fff', marginLeft: 20 }}>Loading...</span>
    </div>
  );
}

export default Loading;