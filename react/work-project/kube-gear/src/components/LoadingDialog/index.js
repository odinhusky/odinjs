import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import LoadingLogo from './LoadingLogo';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularProgress from '@material-ui/core/CircularProgress';

import GlobalContext from 'layouts/Main/GlobalContext';

const LoadingDialog = ({ title, subText, isOpen, onClose, ...props }) => {
  const { t } = useTranslation();
  const { asyncIsFileExist } = useContext(GlobalContext);
  const [svgExist, setSvgExist] = useState(false);
  title = title ? title : t('uploading')
  subText = subText ? subText : t('wait')

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/LoadingLogo.svg')
      .then(res => setSvgExist(res))
  }, [])

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {subText}
        </DialogContentText>
        {/* <LoadingLogo /> */}
        {
          svgExist
            ?
            <img
              src={'/assets/img/trademark/LoadingLogo.svg'}
            />
            :
            <div
              style={{
                width: '300px',
                height: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress />
            </div>

        }
      </DialogContent>
    </Dialog>
  );
};

LoadingDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  subText: PropTypes.string
};

export default LoadingDialog;