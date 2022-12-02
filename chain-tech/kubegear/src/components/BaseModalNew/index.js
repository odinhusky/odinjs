import React from 'react';

// ^ Material-ui Components(Functions)
import Modal from '@material-ui/core/Modal';
import Icon from '@material-ui/core/Icon';

// ^ plugins
import PropTypes from 'prop-types';

// % styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  modalContainer: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    width: '100%',
    maxWidth: 'calc(100% - 64px)',
    maxHeight: 'calc(100vh - 64px)',
    margin: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  xs: {
    maxWidth: 360
  },
  sm: {
    maxWidth: 600
  },
  md: {
    maxWidth: 960
  },
  lg: {
    maxWidth: 1280
  },
  modalHead: {
    width: '100%',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 8px 0px 24px'
  },
  modalTitle: {
    color: 'black',
    fontSize: '18px',
    fontWeight: 'bold',
    flexGrow: 1,
    overflowX: 'auto'
  },
  modalHeadNode: {
    marginRight: 8
  },
  modalIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    cursor: 'pointer'
  },
  modalCloseBtn: {
    display: 'block',
    fontSize: 12,
    color: theme.palette.customColor.black_60
  },
  modalBody: {
    width: '100%',
    padding: '0px 24px 28px',
    marginBottom: 'auto'
  },
  modalFoot: {
    width: '100%',
    padding: '8px 8px 8px 24px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

/**
 * @author odin
 * @level any/BaseModalNew
 * @component BaseModalNew
 * @description Packaged new base modal component with Material UI Modal
*/
export const BaseModalNew = ({
  children,
  modalHeadNode,
  modalFoot,
  size = 'xs',
  isOpen,
  onClose,
  title,
  isCloseIcon = true,
  classNameObj,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Modal
      className={`${classes.flex_center} ${classes.modal} ${classNameObj?.modal}`}
      onClose={onClose}
      open={isOpen}
      {...props}
    >
      <>
        <div
          className={`${classes.modalContainer} ${classes[size]} ${classNameObj?.modalContainer}`}
        >
          {/* Modal Head */}
          <div className={`${classes.modalHead} ${classNameObj?.modalHead}`}>
            <div
              className={`${classes.modalTitle} ${classNameObj?.modalTitle}`}
            >
              {title}
            </div>
            <div className={`${classes.modalHeadNode} ${classNameObj?.modalHeadNode}`}>
              {modalHeadNode}
            </div>
            {
              // 關閉按鈕
              isCloseIcon && (
                <div
                  className={`${classes.modalIconContainer} ${classNameObj?.modalIconContainer}`}
                  onClick={onClose}
                >
                  <Icon className={`${classes.modalCloseBtn} ${classNameObj?.modalCloseBtn}`}>close</Icon>
                </div>
              )
            }
          </div>

          {/* Modal Body */}
          <div className={`${classes.modalBody} ${classNameObj?.modalBody}`}>
            {children}
          </div>

          {/* Modal Foot */}
          <div className={`${classes.modalFoot} ${classNameObj?.modalFoot}`}>
            {modalFoot}
          </div>
        </div>
      </>
    </Modal>
  );
}

BaseModalNew.propTypes = {
  children: PropTypes.node,
  modalHeadNode: PropTypes.node,
  modalFoot: PropTypes.node,
  size: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isCloseIcon: PropTypes.bool,
  classNameObj: PropTypes.object
};

export default BaseModalNew;
