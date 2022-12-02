import React, { useState, useContext } from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// ? context
import JobDetailContext from '../../../JobDetailContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import LoadingDialog from 'components/LoadingDialog';

// ^ plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { uploadHarborImage } from 'utils/api';
import { toast } from 'react-toastify';

const RepoUploadModal = ({ isOpen, onClose, jobInfo, taskRoleName, taskRoleIndex }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const { useSelector } = useContext(GlobalContext);
  const { classes } = useContext(JobDetailContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);
  const isAdmin = userInfo.admin;
  const username = cookies.get('user')

  const [userName, setUserName] = useState(username);
  const [repositoryName, setRepositoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isRepositoryNameError, setIsRepositoryNameError] = useState('');
  const [isTagNameError, setIsTagNameError] = useState('');

  const rules = {
    repositoryNameFormat(name) {
      const nameValidation = RegExp(/^((?![._-])[a-z0-9._-]+)$/, 'g');
      return nameValidation.test(name) ? '' : t('repositoryNameInvalid');
    },
    tagFormat(value) {
      const valueValidation = RegExp(/^((?![._-])[a-zA-Z0-9._-]+)$/, 'g');
      return valueValidation.test(value) ? '' : t('tagNameInvalid');
    }
  };

  const handleUpload = () => {
    const repoData = {
      username: jobInfo.jobStatus.username,
      jobName: jobInfo.name,
      container: {
        taskRoleName,
        taskRoleIndex: taskRoleIndex
      },
      image: {
        repository: `${userName}/${repositoryName}`,
        tag: tagName
      }
    };
    setIsLoading(true)
    uploadHarborImage(repoData)
      .then(res => {
        toast.success(res?.message)
        onClose();
      })
      .catch(err => {
        toast.error( err?.data ? err.data?.message : err?.message)
      })
      .finally(() => setIsLoading(false))
  }
  return (
    <>
      <BaseModal
        isOpen={isOpen}
        modalWidth={750}
        onClose={onClose}
        title={`${t('encapsulateImageButtonTitle')}`}
      >
        <BaseTextField
          classes={{ root: `${classes.mt_10} ${classes.mb_10}` }}
          disabled={isAdmin ? false : true}
          label={t('encapsulateImageButtonUsername')}
          name="userName"
          onChange={(e) => {
            const value = e.target.value;
            setUserName(value);
          }}
          value={userName}
        />
        <BaseTextField
          classes={{ root: `${classes.mt_10} ${classes.mb_10}` }}
          error={isRepositoryNameError}
          helperText={isRepositoryNameError === '' ? '' : isRepositoryNameError}
          label={`${t('image')}${t('enSpace')}${t('name')}`}
          name="repositoryName"
          onChange={e => {
            const value = e.target.value;
            setRepositoryName(value)
            const checkField = rules.repositoryNameFormat(value)
            setIsRepositoryNameError(checkField)
          }}
          value={repositoryName}
        />
        <BaseTextField
          classes={{ root: `${classes.mt_10} ${classes.mb_10}` }}
          error={isTagNameError}
          helperText={isTagNameError === '' ? '' : isTagNameError}
          label={`${t('tag')}${t('enSpace')}${t('name')}`}
          name="tagName"
          onChange={e => {
            const value = e.target.value;
            setTagName(value)
            const checkField = rules.tagFormat(value)
            setIsTagNameError(checkField)
          }}
          value={tagName}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('encapsulateImageUpload')}
            disabled={isEmpty(userName) || isEmpty(repositoryName) || isEmpty(tagName) || isLoading || isRepositoryNameError !== '' || isTagNameError !== ''}
            onClick={handleUpload}
          />
        </div>
      </BaseModal>
      <LoadingDialog
        isOpen={isLoading}
        onClose={() => setIsLoading(false)}
      />
    </>
  );
};

RepoUploadModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  taskRoleIndex: PropTypes.number,
  jobInfo: PropTypes.object,
  taskRoleName: PropTypes.string
};

export default RepoUploadModal;
