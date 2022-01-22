import React from 'react';
import c from 'classnames';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';
const MonacoEditor = React.lazy(() => import('react-monaco-editor'));

import { monacoHack } from './monaco-hack.module.scss';
// import t from '../tachyous.module.scss';

export default class MonacoCallout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.show = this.show.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buttonRef = React.createRef();
  }

  show() {
    this.setState({ open: true });
  }

  dismiss() {
    this.setState({ open: false });
  }

  toggle() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { open } = this.state;
    const { children } = this.props;
    return (
      <div>
        <div
          onClick={this.show}
          ref={this.buttonRef}
        >
          {children}
        </div>
        <Popover
          anchorEl={this.buttonRef.current}
          onClose={this.dismiss}
          open={open}
          target={this.buttonRef.current}
        >
          <div className={c(monacoHack)}>
            {open && (
              <React.Suspense fallback={<>Loading...</>}>
                <MonacoEditor
                  height={400}
                  options={{
                    wordWrap: 'on',
                    readOnly: true
                  }}
                  theme="vs"
                  width={800}
                  {...this.props}
                />
              </React.Suspense>
            )}
          </div>
        </Popover>
      </div>
    );
  }
}

MonacoCallout.propTypes = {
  children: PropTypes.node
};
