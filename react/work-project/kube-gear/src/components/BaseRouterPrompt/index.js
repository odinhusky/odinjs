import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import BaseModal from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  }
}))

export const RouterPrompt = ({ isOpen, onOK, onCancel, title, okText, cancelText, content, setIsBlocking, isBlockCondition = () => (false) }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const history = useHistory();

  const [currentPath, setCurrentPath] = useState('');

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

  return isOpen ? (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
    >
      <div style={{ width: 350 }}>
        <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{content}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
        <DefaultButton
          children={cancelText ? cancelText : t('cancel')}
          classes={{ root: classes.marginRight10 }}
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
    </BaseModal>
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
