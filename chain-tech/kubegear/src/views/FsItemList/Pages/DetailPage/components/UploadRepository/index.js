import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getProjectList as getProjectAPI,
  getRepoList as getRepositoryListAPI,
  getReposTags as getReposTagsAPI,
  uploadFromNfs,
  uploadFromGlusterfs,
  getHuborHost
} from 'utils/api';

// ? context
import FsItemListContext from '../../../../FsItemListContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import BaseModalNew from 'components/BaseModalNew';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import MuiComboBox from 'components/BaseCombo';
import MuiDropdown from 'components/BaseMuiDropdown';
import LoadingDialog from 'components/LoadingDialog';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/FsItemList/DetailPage/UploadRepository
 * @component UploadRepository Component
 * @description UploadRepository to upload Repo
*/
const UploadRepository = ({
  isOpen,
  onClose,
  nfsName,
  selectedItem
}) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { isNFS, classes } = useContext(FsItemListContext);
  const { userInfo } = useContext(GlobalContext);

  // # states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [host, setHost] = useState();
  const [projectList, setProjectList] = useState([]);
  const [repoList, setRepoList] = useState([]);
  const [repoTags, setRepoTags] = useState([]);

  const [selectedProject, setSelectedProject] = useState({});
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // - methods
  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item.name,
      text: item.name,
      ...item
    }));
  };

  const onSubmit = () => {
    setIsUploading(true)
    const data = {
      name: nfsName,
      path: selectedItem.path,
      image: `${host}/${selectedProject.name}/${selectedRepo}${selectedTag ? ':' + selectedTag : selectedTag}`
    }

    const uploadFile = isNFS ? uploadFromNfs : uploadFromGlusterfs
    uploadFile(data)
      .then(() => {
        onClose()
        toast.success(`${t('Upload')}${t('enSpace')}${t('success')}`)
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.message)
      })
      .finally(() => setIsUploading(false))
  }

  const getProjectListAndHost = () => {
    setIsLoading(true)
    Promise.all([
      getHuborHost(),
      getProjectAPI({ page: 1, page_size: 999999 })
    ])
      .then(([huborhost, projectList]) => {
        setHost(huborhost.host)
        const hasSelfProject = projectList.some(item => item.name === userInfo.username)
        const canWriteProjectList = projectList.filter(item => item.current_user_role_id === 0 || item.current_user_role_id === 3 ? false : true)
        if (!hasSelfProject) canWriteProjectList.unshift({ name: userInfo.username, project_id: -1 })
        setProjectList(canWriteProjectList)
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const getRepoList = (selectedProject) => {
    if (selectedProject.project_id === -1) {
      setRepoList([])
      return
    }
    setIsLoading(true)
    getRepositoryListAPI({
      project_id: selectedProject.project_id,
      page: 1,
      page_size: 9999999
    })
      .then(data => {
        // change Repository name
        // ex. change test/first to first
        setRepoList(data.map(item => ({ ...item, name: item.name.split('/').length === 2 ? item.name.split('/')[1] : item.name })))
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  const getReposTags = (repoName) => {
    setIsLoading(true)
    getReposTagsAPI(repoName)
      .then(data => setRepoTags(data))
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsLoading(false))
  }

  // * hooks
  useEffect(getProjectListAndHost, []);

  useEffect(() => {
    if (!isEmpty(selectedProject)) {
      getRepoList(selectedProject)
      setSelectedRepo('')
      setSelectedTag('')
    }
  }, [selectedProject])

  useEffect(() => {
    if (isEmpty(selectedRepo)) return;
    if (repoList.length <= 0) return;
    const findrepoName = repoList.find(item => item.name === selectedRepo) && repoList.find(item => item.name === selectedRepo).name
    if (findrepoName) {
      getReposTags(`${selectedProject.name}/${findrepoName}`)
    }
  }, [selectedRepo, repoList])

  return (
    <>
      {
        isUploading
          ?
          <LoadingDialog
            isOpen={isUploading}
            subText={t('wait')}
            title={'Loading'}
          />
          :
          <BaseModalNew
            isOpen={isOpen}
            modalFoot={
              <>
                <DefaultButton
                  children={t('cancel')}
                  classes={{ root: classes.mr_10 }}
                  onClick={() => {
                    onClose();
                  }}
                />
                <PrimaryButton
                  children={t('Upload')}
                  disabled={isEmpty(selectedProject) || isEmpty(selectedRepo) || isLoading}
                  onClick={onSubmit}
                />
              </>
            }
            title={t('UploadRepositories')}
          >
            <MuiDropdown
              classes={{ root: `${classes.mt_10} ${classes.mb_10}` }}
              list={addDropDownOptionKeys(projectList)}
              onChange={(e, child) => {
                setSelectedProject({ ...child.props });
              }}
              text={t('project')}
              value={selectedProject.name}
            />
            <MuiComboBox
              classes={{
                root: `${classes.mt_10} ${classes.mb_10} ${classes.muiComboBoxInput}`,
                inputRoot: `${classes.h_40px}`
              }}
              getOptionLabel={(option) => option.name ? option.name : selectedRepo}
              handleHomeEndKeys
              label={t('image')}
              onInputChange={(e, value) => {
                setSelectedRepo(value)
                setRepoTags([])
              }}
              options={addDropDownOptionKeys(repoList)}
              value={selectedRepo}
            />
            <MuiComboBox
              classes={{
                root: `${classes.mt_10} ${classes.mb_10} ${classes.muiComboBoxInput}`,
                inputRoot: `${classes.h_40px}`
              }}
              getOptionLabel={(option) => option.name ? option.name : selectedTag}
              handleHomeEndKeys
              label={t('tag')}
              onInputChange={(e, value) => {
                setSelectedTag(value)
              }}
              options={addDropDownOptionKeys(repoTags)}
              value={selectedTag}
            />
            <div className={classes.mt_10}>{t('Note')}{t('semicolon')}{t('enSpace')}{t('AfterClickingUploadTheProcessCannotbeCanceled')}</div>
          </BaseModalNew>
      }
    </>
  );
};

UploadRepository.propTypes = {
  isOpen: PropTypes.bool,
  nfsName: PropTypes.string,
  onClose: PropTypes.func,
  selectedItem: PropTypes.object
}

export default UploadRepository;
