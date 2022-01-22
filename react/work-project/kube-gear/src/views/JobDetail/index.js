import React from 'react';

// ? context
import JobDetailContext from './JobDetailContext';


// ? Self-packed Components || Functions
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import DetailPageJobEvent from './Pages/DetailPageJobEvent';

// ^ plugins
import { Route } from 'react-router-dom';

// % styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import jobDetailStyles from './jobDetailStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...jobDetailStyles(theme)
  }
});

/**
 * @author odin
 * @level views/JobDetail
 * @component JobDetail
 * @description JobDetail container
*/
const JobDetail = () => {

  // = styles
  const classes = useStyles();

  const context = {
    classes
  }

  return (
    <JobDetailContext.Provider value={context}>
      <div className={`${classes.jobDetailContainer}`}>
        <Route
          exact
          path="/job-detail"
          render={matchProps => (
            <IndexPage {...matchProps} />
          )}
        />
        <Route
          exact
          path="/job-detail/:name"
          render={matchProps => (
            <DetailPage {...matchProps} />
          )}
        />
        <Route
          exact
          path="/job-detail/:name/jobevent"
          render={matchProps => (
            <DetailPageJobEvent {...matchProps} />
          )}
        />
      </div>
    </JobDetailContext.Provider>
  );
};

export default JobDetail;
