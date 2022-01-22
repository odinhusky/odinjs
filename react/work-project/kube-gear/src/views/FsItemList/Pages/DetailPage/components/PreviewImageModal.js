
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

function PreviewImageModal({ isOpen, onClose, isLoading, url }) {
  const classes = useStyles();
  return (
    <Modal
      className={classes.modal}
      onClose={onClose}
      open={isOpen}
    >
      <div style={{ maxWidth: 600 }}>
        {
          isLoading ?
            <CircularProgress />
            :
            <img
              alt="previewImage"
              src={url}
              width="100%"
            />
        }
      </div>
    </Modal>
  );
}

PreviewImageModal.propTypes = {
  url: PropTypes.string,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  name: PropTypes.string
}

export default PreviewImageModal;
