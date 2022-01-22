import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { BaseTextField } from 'components/BaseMuiInput';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseModal from 'components/BaseModal';
import { makeStyles } from '@material-ui/core/styles';

import cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { uploadHarborImage } from 'utils/api';
import { toast } from 'react-toastify';
import LoadingDialog from 'components/LoadingDialog';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginBottom10: {
    marginBottom: 10
  }
}))

const RepoUploadModal = ({ isOpen, onClose, jobInfo, taskRoleName, taskRoleIndex }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const admin = cookies.get('admin');
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
        toast.success('Success: ' + res.message)
        onClose();
      })
      .catch(err => {
        toast.error('Error: ' + err.data.message)
      })
      .finally(() => setIsLoading(false))
  }
  return (
    <>
      <BaseModal
        isOpen={isOpen}
        modalWidth={750}
        onClose={onClose}
        title={`${t('package')}${t('enSpace')}${t('container')}`}
      >
        <BaseTextField
          classes={{ root: `${classes.marginTop10} ${classes.marginBottom10}` }}
          disabled={admin ? false : true}
          label={t('Username')}
          name="userName"
          onChange={(e) => {
            const value = e.target.value;
            setUserName(value);
          }}
          value={username}
        />
        <BaseTextField
          classes={{ root: `${classes.marginTop10} ${classes.marginBottom10}` }}
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
          classes={{ root: `${classes.marginTop10} ${classes.marginBottom10}` }}
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
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('Upload')}
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
