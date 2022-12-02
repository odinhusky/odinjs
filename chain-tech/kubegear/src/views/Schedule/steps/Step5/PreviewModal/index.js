import React from 'react';

// ? Self-packed Components || Functions
import Disk from './Disk';
import GPU from './GPU';
import CPU from './CPU';
import RAM from './Memory/Ram';
import SHM from './Memory/Shm';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }});

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step5/Preview
 * @component Preview
 * @description Preview -- Show distribution image
*/
const Preview = ({ data }) => {

  // = styles
  const classes = useStyles();

  return (
    <div
      className={`${classes.step5PreviewModalBox}`}
    >
      <div className={`${classes.step5PreviewModalContainer}`}>
        <div className={`${classes.step5PreviewModalCell}`}>
          <Disk data={data.disk} />
        </div>
        <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}>
          <div
            className={`${classes.step5PreviewModalNormal} ${classes.step5PreviewModalNFSBorderColor}`}
          >
            <p className={`${classes.step5PreviewModalNFSBorderColor}`}>NFS</p>

            <p><b>{data.nfs.toFixed(2)}</b>GB</p>
          </div>
        </div>
        <div
          className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}
        >
          <div
            className={`${classes.step5PreviewModalNormal} ${classes.step5PreviewModalGlusterFSBorderColor}`}
          >
            <p className={`${classes.step5PreviewModalGlusterFSBorderColor}`}>Gluster FS</p>
            <p><b>{data.glusterfs.toFixed(2)}</b>GB</p>
          </div>
        </div>
        <div
          className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}
        >
          <div
            className={`${classes.step5PreviewModalNormal} ${
              data.rdma
                ? classes.step5PreviewModalRDMABorderColor
                : classes.step5PreviewModalWithoutRDMABorderColor
            }`}
          >
            <p
              className={`${
                data.rdma
                  ? classes.step5PreviewModalRDMABorderColor
                  : classes.step5PreviewModalWithoutRDMABorderColor
              }`}
            >
              RDMA
            </p>
            <i
              className={`fa fa-${data.rdma ? 'check' : 'times'} ${
                data.rdma
                  ? classes.step5PreviewModalRDMAColor
                  : classes.step5PreviewModalWithoutRDMAColor
              }`}
            />
          </div>
        </div>
        <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalSmall}`}>
          <CPU
            data={data.cpu}
          />
        </div>
        <div className={`${classes.step5PreviewModalCell} ${classes.step5PreviewModalGPU}`}>
          <GPU
            data={data.gpu}
          />
        </div>
      </div>
      <RAM
        data={data.ram}
      />
      <SHM
        data={data.shm}
      />
    </div>
  );
};

Preview.propTypes = {
  data: PropTypes.object
}

export default Preview;