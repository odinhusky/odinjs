import React from 'react';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme)
  }});

/**
 * @author odin
 * @level any/ConfirmModalNew
 * @prop {boolean} isOpen -- 是否顯示的 prop
 * @prop {function} onClose -- 關閉的 function
 * @prop {string} title -- 標題
 * @prop {node} content -- 內容的節點
 * @prop {function} onConfirm -- 確認時要觸發的事件
 * @prop {string} confirmText -- 確認的按鈕文字
 * @component ConfirmModalNew
 * @description New Confirm Modal
*/
const ConfirmModalNew = ({
  isOpen,
  onClose,
  title,
  content,
  onConfirm,
  confirmText
}) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classNameProps={`${classes.mr_20}`}
            onClick={() => {
              onClose();
            }}
          />
          <PrimaryButton
            children={confirmText ? confirmText : t('confirm')}
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
      <div style={{ width: 350 }}>
        <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{content}</p>
      </div>
    </BaseModalNew>
  );
};

ConfirmModalNew.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string
};

export default ConfirmModalNew;