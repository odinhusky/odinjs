import React, {
  useState,
  useCallback,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getProjectList as getProject } from 'utils/api';

// ? context
import RepositoryContext from './RepositoryContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import { ProjectList, ProjectDetail, RepoDetail } from './Pages'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import repositoryStyle from './repositoryStyle'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...repositoryStyle(theme)
  }});

// ^ Plugins
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Route } from 'react-router-dom';

/**
 * @author odin
 * @level views/Repository Route
 * @component Repository Route
 * @description Repository Route page
*/
const Repository = () => {

  // $ init data
  const location = useLocation();

  // = styles
  const classes = useStyles();

  // ? context
  const { useSelector } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);
  const { admin: isAdmin } = userInfo

  // # states
  const [currentProject, setCurrentProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);

  // -methods
  const getProjectList = useCallback(() => {
    setIsLoading(true)
    getProject({ page: 1, page_size: 999999 })
      .then(data => setProjectList(data))
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  })

  // * hooks
  useEffect(getProjectList, [location]);

  // & handled data
  const context = {
    projectList,
    isLoading,
    setIsLoading,
    currentProject,
    setCurrentProject,
    getProjectList,
    classes,
    isAdmin,
    userInfo
  }

  return (
    <RepositoryContext.Provider value={context}>
      <div
        className={`
        ${classes.d_flex} ${classes.directionColumn}
        ${classes.h_full}
        ${classes.overflowHidden}
        ${classes.px_20}
        ${classes.pb_20}`
        }
      >
        <BreadCrumbs />
        <Route
          exact
          path="/repository"
          render={matchProps => (
            <ProjectList
              {...matchProps}
            />
          )}
        />
        <Route
          exact
          path="/repository/:project"
          render={matchProps => (
            <ProjectDetail
              {...matchProps}
              currentProject={currentProject}
            />
          )}
        />
        <Route
          path="/repository/:project/:repo"
          render={matchProps => (
            <RepoDetail
              currentProject={currentProject}
              {...matchProps}
            />
          )}
        />
      </div>
    </RepositoryContext.Provider>
  );
};

export default Repository;
