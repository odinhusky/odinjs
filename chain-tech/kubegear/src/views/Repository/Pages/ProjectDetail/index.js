import React, {
  useContext,
  useEffect,
  useState
} from 'react';

// # API
import { getRepoList, getProjectMember } from 'utils/api';

// ? context
import RepositoryContext from '../../RepositoryContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ? Self-packed Components || Functions
import { DefaultButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { RepoList, Member, Setting } from './components';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Repository/ProjectDetail
 * @component ProjectDetail
 * @description ProjectDetail to show projects' detail
*/
const ProjectDetail = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    projectList,
    setCurrentProject,
    isLoading,
    setIsLoading,
    currentProject,
    classes
  } = useContext(RepositoryContext);

  // # states
  const [selectedKey, setSelectedKey] = useState('repoList');
  const [currentUserId, setCurrentUserId] = useState(null);
  const { project } = useParams();
  const history = useHistory();
  const [repoList, setRepoList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [keyword, setKeyword] = useState('');

  // - methods
  const getData = async() => {
    const find = projectList.find(item => item.name === project)
    if (projectList.length > 0 && !find) return history.push('/not-found')
    if (find && find.project_id) {
      setCurrentUserId(find.current_user_role_id)
      if (
        find.project_id !== currentProject.project_id
        || find.metadata.public !== currentProject.metadata.public
      ) {
        setCurrentProject(find)
        return
      }
      setIsLoading(true)
      try {
        const repoData = await getRepoList({
          project_id: find.project_id,
          page: 1,
          page_size: 9999999
        })
        setRepoList(repoData);
      } catch (err) {
        toast.error(err.data ? err.data.message : err.message)
      }

      try {
        const memberData = await getProjectMember(find.project_id)
        setMemberList(memberData);
      } catch {
        setMemberList(null)
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData();
    // console.log('yo', projectList, currentProject.project_id)
  }, [projectList, currentProject.project_id])

  // const handleClick = (e) => {
  //   setSelectedKey(e.props.itemKey)
  //   setKeyword('')
  // }
  return (
    <>
      <div className={`${classes.projectDetailTopBar}`}>
        <p>{t('project')}: {currentProject.name}</p>
        <div>
          <DefaultButton
            children={t('refresh')}
            disabled={isLoading}
            onClick={() => getData()}
            startIcon={<Refresh />}
          />
        </div>
        <div>
          <MuiAutocomplete
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
          <DefaultButton
            children={t('back')}
            onClick={() => history.push('/repository')}
            startIcon={<Icon>arrow_back</Icon>}
          />
        </div>
      </div>
      <Toolbar
        className={classes.bg_paper}
        disableGutters
      >
        <Tabs
          aria-label="tabs"
          className={classes.tabs}
          indicatorColor="primary"
          onChange={(e, value) => {
            setSelectedKey(value)
          }}
          scrollButtons="on"
          value={selectedKey}
          variant="scrollable"
        >
          <Tab
            label={`${t('Repositories')}`}
            value={'repoList'}
          />
          {
            memberList !== null &&
            <Tab
              label={`${t('Members')}`}
              value={'memberList'}
            />
          }
          {
            currentProject.current_user_role_id === 1
              ?
              <Tab
                label={`${t('privacyAndSecurity')}`}
                value={'projectSetting'}
              />
              : null
          }
        </Tabs>
      </Toolbar>
      {
        selectedKey === 'repoList' &&
          <RepoList
            currentUserId={currentUserId}
            getData={getData}
            keyword={keyword}
            repoList={repoList}
          />
      }
      {
        selectedKey === 'memberList' &&
        <Member
          data={memberList}
          getData={getData}
          isLoading={isLoading}
          keyword={keyword}
        />
      }
      {
        selectedKey === 'projectSetting' && <Setting />
      }
    </>
  );
};

export default ProjectDetail;
