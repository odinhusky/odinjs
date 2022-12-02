import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Components(Functions)
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
// import LoadingLogo from './LoadingLogo';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    circularProgressContainer: {
      width: 300,
      height: 120
    }
  }});

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const LoadingDialog = ({
  title,
  subText,
  isOpen,
  onClose,
  ...props
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  // ? context
  const { asyncIsFileExist } = useContext(GlobalContext);

  // # states
  const [svgExist, setSvgExist] = useState(false);
  title = title ? title : t('uploading')
  subText = subText ? subText : t('wait')

  // * hooks
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
              className={`${classes.circularProgressContainer} ${classes.flex_center}`}
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