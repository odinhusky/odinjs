import React from 'react';


// ? context
import GlusterFSContext from './GlusterFSContext'

// ? Self-packed Components || Functions
import GlusterFSpage from './Pages/GlusterFS'
import GlusterFSdetail from './Pages/GlusterFSdetail'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import glusterFSStyles from './glusterFSStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...glusterFSStyles(theme)
  }});

// ^ Plugins
import { Route } from 'react-router-dom';

/**
 * @author odin
 * @level views/GlusterFSRoute Route
 * @component GlusterFSRoute Route
 * @description GlusterFSRoute Route page
*/
export default function GlusterFSRoute () {

  // = styles
  const classes = useStyles();

  // & handled data
  const context = {
    classes
  };

  return (
    <GlusterFSContext.Provider value={context}>
      <div
        className={`${classes.routeContainer}`}
      >
        <Route
          exact
          path="/glusterfs"
          render={matchProps => (
            <GlusterFSpage {...matchProps} />
          )}
        />
        <Route
          path="/glusterfs/:path"
          render={matchProps => (
            <GlusterFSdetail {...matchProps} />
          )}
        />
      </div>
    </GlusterFSContext.Provider>
  )
}