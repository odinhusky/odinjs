import React, { Component } from 'react';

// % Styles
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'react-perfect-scrollbar/dist/css/styles.css';

// ^ Material-ui Componets(Functions)
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
// import theme from './theme';
import materialUIpalette from '../src/theme/palette';
import 'utils/i18n';

// ^ Plugins
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// ! Fabric UI
import './assets/scss/index.scss';
import Routes from './Routes';
// import { loadTheme, initializeIcons } from 'office-ui-fabric-react';

// initializeIcons('/assets/font/');
// loadTheme(theme);

const browserHistory = createBrowserHistory();

export default class App extends Component {
  render() {
    // & Handled data
    // 創建自定義的設定
    const theme = createMuiTheme({
      // ! 非原生寫法的 breakpoints 寫法，定義一個數值可以取用
      bp: {
        laptop: 1024,
        largeAlpha: 1280
      },
      // ! 一定要用 [] 包才吃得到，所有 .Materialui- 相關的 class 設定
      typography: {
        body1: {
          fontSize: [14]
        },
        body2: {
          fontSize: [14]
        }
      },
      palette: {
        primary: {
          main: materialUIpalette.themePrimary
        },
        secondary: {
          main: materialUIpalette.themePrimary
        },
        text: {
          white: materialUIpalette.white,
          black: materialUIpalette.black,
          neutralPrimary: materialUIpalette.neutralPrimary
        },
        customColor: { ...materialUIpalette }
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <Router
          getUserConfirmation={() => {
            /* Empty callback to block the default browser prompt */
          }}
          history={browserHistory}
        >
          <Routes />
        </Router>
      </ThemeProvider>
    );
  }
}
