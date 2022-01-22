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
    margin: '0 20px'
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
    padding: '0px 24px 28px'
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
  classesNameObj,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Modal
      className={`${classes.flex_center} ${classes.modal} ${classesNameObj?.modal}`}
      onClose={onClose}
      open={isOpen}
      {...props}
    >
      <>
        <div
          className={`${classes.modalContainer} ${classes[size]} ${classesNameObj?.modalContainer}`}
        >
          {/* Modal Head */}
          <div className={`${classes.modalHead} ${classesNameObj?.modalHead}`}>
            <div
              className={`${classes.modalTitle} ${classesNameObj?.modalTitle}`}
            >
              {title}
            </div>
            <div className={`${classes.modalHeadNode} ${classesNameObj?.modalHeadNode}`}>
              {modalHeadNode}
            </div>
            {
              // 關閉按鈕
              isCloseIcon && (
                <div
                  className={`${classes.modalIconContainer} ${classesNameObj?.modalIconContainer}`}
                  onClick={onClose}
                >
                  <Icon className={`${classes.modalCloseBtn} ${classesNameObj?.modalCloseBtn}`}>close</Icon>
                </div>
              )
            }
          </div>

          {/* Modal Body */}
          <div className={`${classes.modalBody} ${classesNameObj?.modalBody}`}>
            {children}
          </div>

          {/* Modal Foot */}
          <div className={`${classes.modalFoot} ${classesNameObj?.modalFoot}`}>
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
  classesNameObj: PropTypes.object
};

export default BaseModalNew;
