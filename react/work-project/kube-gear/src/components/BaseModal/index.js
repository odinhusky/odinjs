import React from 'react';

// ^ Material-ui Components(Functions)
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// ^ plugins
import PropTypes from 'prop-types';

// % styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modalTitleBlock: {
    padding: '5px 0'
  },
  modalTitle: {
    color: 'black',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  subTitle: {
    // 目前還沒有想到要加入什麼預設的 css
  }
}));


/**
 * @author elvis
 * @level any/BaseModal
 * @component BaseModal
 * @description Packaged base component with Material UI Modal
*/
export const BaseModal = ({
  children,
  isOpen,
  onClose,
  title,
  subTitle,
  isCloseIcon = false,
  modalWidth,
  classesNameObj,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Modal
      className={`${classes.flex_center} ${classes.modal} ${classesNameObj?.modal}`}
      onClose={onClose}
      open={isOpen}
    >
      <div
        className={`${classes.paper} ${classesNameObj?.modalContainer}`}
        style={modalWidth ? { width: modalWidth } : {}}
        {...props}
      >
        <Grid
          alignItems="stretch"
          container
          direction="column"
          justify="center"
        >
          <Grid item>
            <div
              className={`
                ${isCloseIcon ? `${classes.flex_align_center} ${classes.justify_between}` : ''}
                ${classes.modalTitleBlock}
                ${classesNameObj?.modalGridContainer}
              `}
            >
              <div className={`${classes.modalTitle} ${classesNameObj?.modalTitle}`}>
                {title}
              </div>
              {
                isCloseIcon &&
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                >
                  <CloseIcon />
                </IconButton>
              }
            </div>
          </Grid>

          {
            subTitle &&
            <Grid item>
              <div className={`${classes.subTitle} ${classesNameObj?.modalSubTitle}`}>
                {subTitle}
              </div>
            </Grid>
          }

          {children}
        </Grid>
      </div>
    </Modal>
  );
}

BaseModal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  subTitle: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isCloseIcon: PropTypes.bool,
  modalWidth: PropTypes.number,
  classesNameObj: PropTypes.object
};

export default BaseModal;
