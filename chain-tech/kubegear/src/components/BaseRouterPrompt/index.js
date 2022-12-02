import React, {
  useEffect,
  useState,
  useCallback
} from 'react';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}))

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

export const RouterPrompt = ({
  isOpen,
  onOK,
  onCancel,
  title,
  okText,
  cancelText,
  content,
  setIsBlocking,
  isBlockCondition = () => (false)
}) => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  // = styles
  const classes = useStyles();

  // # states
  const [currentPath, setCurrentPath] = useState('');

  // - methods
  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setIsBlocking(false);
  }, [currentPath, history, onCancel]);

  // * hooks
  useEffect(() => {
    if (isBlockCondition()) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setIsBlocking(true);

        return false
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, isBlockCondition]);

  return isOpen ? (
    <BaseModalNew
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
    >
      <div className={`${classes.w_full}`}>
        <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{content}</p>
      </div>
      <div className={`${classes.pt_10} ${classes.flex_justify_end}`}>
        <DefaultButton
          children={cancelText ? cancelText : t('cancel')}
          classes={{ root: classes.mr_10 }}
          onClick={() => {
            handleCancel();
          }}
        />
        <PrimaryButton
          children={okText ? okText : t('confirm')}
          onClick={() => {
            onOK ? handleOK() : null;
            handleCancel();
          }}
        />
      </div>
    </BaseModalNew>
  ) : null;
};

RouterPrompt.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  setIsBlocking: PropTypes.func,
  isBlockCondition: PropTypes.func
};

export default RouterPrompt;
