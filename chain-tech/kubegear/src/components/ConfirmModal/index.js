import React from 'react';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles';

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme)
}))

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const ConfirmModal = ({ isOpen, onClose, title, content, onConfirm, confrimText }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
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
        </>
      }
      onClose={onClose}
      title={title}
    >
      <div>
        <p className={`${classes.whiteSpacePreLine} ${classes.break_all}`}>{content}</p>
      </div>
    </BaseModalNew>
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
