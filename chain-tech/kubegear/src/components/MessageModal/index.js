import React from 'react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PrimaryButton } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

const styles = {
  container: {
    root: {
      padding: 20,
      width: 260
    }
  },
  messageBar: {
    root: {
      background: 'none'
    },
    iconContainer: {
      marginLeft: 0
    },
    innerText: {
      color: '#333',
      fontSize: 18
    }
  },
  label: {
    root: {
      color: '#333'
    }
  },
  button: {
    root: {
      height: '32px',
      border: '1px solid transparent',
      boxSizing: 'border-box',
      borderRadius: '3px'
    }
  }
};

const MessageModal = ({ isOpen, onClose, message, messageBarStyles }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen}>
      <Stack styles={styles.container}>
        <MessageBar
          messageBarType={MessageBarType[message.type]}
          styles={Object.assign(styles.messageBar, messageBarStyles)}
        >
          {message.title}
        </MessageBar>
        <Label styles={styles.label}>
          {message.message}
        </Label>
        <Stack.Item styles={{ root: { display: 'flex', justifyContent: 'center', paddingTop: 32 } }}>
          <PrimaryButton
            onClick={() => {
              message.callback ? message.callback() : null;
              onClose();
            }}
            styles={styles.button}
            text={t('confirm')}
          />
        </Stack.Item>
      </Stack>
    </Modal>
  );
};

MessageModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.object,
  messageBarStyles: PropTypes.object
};

export default MessageModal;
