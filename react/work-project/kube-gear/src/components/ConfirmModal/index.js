import React from 'react';
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

const ConfirmModal = ({ isOpen, onClose, title, content, onConfirm, confrimText }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div style={{ width: 350 }}>
        <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{content}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={() => {
            onClose();
          }}
        />
        <PrimaryButton
          children={confrimText ? confrimText : t('confirm')}
          onClick={() => {
            onConfirm ? onConfirm() : null;
            onClose();
          }}
        />
      </div>
    </BaseModal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  onConfirm: PropTypes.func,
  confrimText: PropTypes.string
};

export default ConfirmModal;
