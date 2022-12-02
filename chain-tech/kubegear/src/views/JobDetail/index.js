import React, { useEffect } from 'react';

// ? context
import JobDetailContext from './JobDetailContext';


// ? Self-packed Components || Functions
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import DetailPageJobEvent from './Pages/DetailPageJobEvent';

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

// ^ plugins
import { Route } from 'react-router-dom';
import $ from 'jquery';

/**
 * @author odin
 * @level views/JobDetail
 * @component JobDetail
 * @description JobDetail container
*/
const JobDetail = () => {

  // = styles
  const classes = useStyles();

  // & handled data
  const context = {
    classes
  }

  // * hooks
  /**
   * @author odin
   * @description 解決如果從其他頁面跳轉來提交作業的話，維持左側欄位的 highlight 在提交作業上
  */
  useEffect(() => {
    $('.treeview').removeClass('menu-open')
      .children('.treeview-menu').slideUp('fast')
      .children('.treeview-menu-li').removeClass('active');

    $('#sidebar-menu--model-training').addClass('menu-open')
      .children('.treeview-menu').slideDown('fast')
      .children('#sidebar-menu--model-management--models').addClass('active');
  }, []);

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
