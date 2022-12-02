import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { get, isNil } from 'lodash';
import { monacoHack } from './monaco-hack.module.scss';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { DefaultButton } from 'components/BaseButton';
const MonacoEditor = React.lazy(() => import('react-monaco-editor'));

const useStyles = () => ({
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
})

class MonacoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.monaco = React.createRef();
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const editor = get(this.monaco, 'current.editor');
    if (!isNil(editor)) {
      editor.layout();
    }
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    const { isOpen, onDismiss, title, monacoProps, footerPrimaryButton, classes, t } = this.props;
    return (
      <div>
        <Drawer
          anchor={'right'}
          classes={{ paper: classes.paper }}
          onClose={onDismiss}
          open={isOpen}
        >
          <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
            <div>{title}</div>
          </div>
          <div
            className={monacoHack}
            style={{ flex: '1 1 100%', minHeight: 0 }}
          >
            {
              open && (
                <React.Suspense fallback={<>Loading...</>}>
                  <MonacoEditor
                    // className={c(t.flexAuto)}
                    language="text"
                    options={{
                      wordWrap: 'on',
                      readOnly: true
                    }}
                    ref={this.monaco}
                    theme="vs-dark"
                    {...monacoProps}
                  />
                </React.Suspense>
              )
            }
          </div>
          <div
            className={monacoHack}
            style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}
          >
            <div>
              {footerPrimaryButton}
            </div>
            <DefaultButton
              children={t('close')}
              classNameProps={classes.defaultBtn}
              onClick={onDismiss}
            />
          </div>
        </Drawer>
      </div>
    );
  }
}

MonacoPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
  monacoProps: PropTypes.object,
  footerPrimaryButton: PropTypes.node,
  classes: PropTypes.object,
  t: PropTypes.object
};

export default withTranslation()(withStyles(useStyles)(MonacoPanel))
