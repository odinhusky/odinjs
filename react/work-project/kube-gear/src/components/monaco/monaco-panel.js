import React from 'react';

// ^ Material-ui Componets(Functions)
import Drawer from '@material-ui/core/Drawer';

// ? Self-packed Components || Functions
import MonacoEditor from './monaco-editor';
import { DefaultButton } from 'components/BaseButton';

// ? styles
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  paper: {
    width: '90%',
    backgroundColor: '#323030',
    padding: 20
  },
  defaultBtn: {
    color: '#fff',
    background: 'rgb(39, 39, 39)',
    '&:hover': {
      color: '#fff',
      background: 'rgb(29, 29, 29)'
    }
  }
}))

// ^ Plugins
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const MonacoPanel = ({ isOpen, onDismiss, title, header, customFooterLeftNode, customFooterRightNode, monacoProps, completionItems, schemas, monacoRef }) => {

  // $ init data
  const { t } = useTranslation();

  // = styles
  const classes = useStyles();

  return (
    <Drawer
      anchor={'right'}
      classes={{ paper: classes.paper }}
      onClose={onDismiss}
      open={isOpen}
    >
      <div style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>{title}</div>
      {
        header &&
          <div style={{ color: '#fff' }}>
            {header}
          </div>
      }
      {
        <MonacoEditor
          completionItems={completionItems}
          monacoProps={{
            theme: 'vs-dark',
            language: 'text',
            options: {
              wordWrap: 'on',
              readOnly: true
            },
            ...monacoProps
          }}
          monacoRef={monacoRef}
          schemas={schemas}
          style={{ flexGrow: 1, minHeight: 0, overflow: 'hidden', marginTop: 20 }}
        />
      }
      <div className={`${classes.flex_align_center}`}>
        {/* 左邊 */}
        <div className={`${classes.mr_auto} ${classes.mt_10}`}>
          {
            customFooterLeftNode &&
              <div className={`${classes.flex_align_center}`}>
                {customFooterLeftNode}
              </div>
          }
        </div>

        {/* 右邊 */}
        <div className={`${classes.flex_align_center} ${classes.mt_10}`}>
          {
            customFooterRightNode &&
              <div className={`${classes.mr_20}`}>
                {customFooterRightNode}
              </div>
          }

          <DefaultButton
            children={t('close')}
            classNameProps={`${classes.defaultBtn}`}
            onClick={onDismiss}
          />
        </div>
      </div>
    </Drawer>
  );
};

MonacoPanel.propTypes = {
  // panel props
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
  header: PropTypes.node,
  customFooterRightNode: PropTypes.node,
  customFooterLeftNode: PropTypes.node,
  // monaco props
  monacoProps: PropTypes.object,
  schemas: PropTypes.array,
  completionItems: PropTypes.arrayOf(PropTypes.string),
  monacoRef: PropTypes.object,
  uploadInputRef: PropTypes.any
};

export default MonacoPanel;
