import React from 'react';

// ? context
import HardwareContext from './HardwareContext';

// ? Self-packed Components || Functions
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import ImagePage from './Pages/ImagePage';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import hardWareStyles from './hardWareStyles'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...hardWareStyles(theme)
}));

// ^ Plugins
import { Route } from 'react-router-dom';

/**
 * @author odin
 * @level views/Hardware Route
 * @component Hardware Route
 * @description Hardware Route page
*/
const Hardware = () => {

  // = styles
  const classes = useStyles();

  // & handled data
  const context = {
    classes
  };

  return (
    <HardwareContext.Provider value={context}>
      <div className={`${classes.hardWareContainer}`}>
        <Route
          exact
          path="/cluster-view/hardware"
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          exact
          path="/cluster-view/hardware/detail"
          render={matchProps => (
            <DetailPage {...matchProps} />
          )}
        />
        <Route
          exact
          path="/cluster-view/hardware/image"
          render={matchProps => (
            <ImagePage {...matchProps} />
          )}
        />
      </div>
    </HardwareContext.Provider>
  );
};

export default Hardware;
