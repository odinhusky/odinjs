import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BaseTable from 'components/BaseTable'

const HostTaskInfo = ({ data }) => {
  const { t } = useTranslation();

  const renderData = data.reduce((acc, curr) => {
    if (acc.find(item => item.job_name === curr.job_name)) {
      const found = acc.find(item => item.job_name === curr.job_name)
      found.taskNum += 1;
      found.taskRoleNames = [...acc.taskRoleNames, curr.role_name];

      return acc
    }
    return [...acc, { ...curr, taskNum: 1, taskRoleNames: [curr.role_name] }]
  }, [])

  const nameColumn = {
    key: 'name',
    minWidth: 400,
    maxWidth: 400,
    name: `${t('job')}${t('enSpace')}${t('name')}`,
    fieldName: 'size',
    isResizable: true,
    onRender: (host) => {
      return (<div>{host.job_name}</div>);
    }
  };

  const roleColumn = {
    key: 'size',
    minWidth: 200,
    maxWidth: 200,
    name: `${t('task')}${t('enSpace')}${t('role')}`,
    fieldName: 'size',
    isResizable: true,
    onRender(host) {
      return (<div>{host.taskRoleNames.join(', ')}</div>);
    }
  };

  const indexColumn = {
    key: 'index',
    minWidth: 200,
    maxWidth: 200,
    name: `${t('task')}`,
    fieldName: 'size',
    isResizable: true,
    onRender(host) {
      return (<div>{host.taskNum}</div>)
    }
  }

  const usernameColumn = {
    key: 'username',
    minWidth: 200,
    maxWidth: 200,
    name: `${t('User')}`,
    fieldName: 'size',
    onRender(host) {
      return (<div>{host.username}</div>)
    }
  }

  const columns = [
    nameColumn,
    roleColumn,
    indexColumn,
    usernameColumn
  ]

  return (
    <>
      <BaseTable 
        columns={columns}
        items={renderData}
      />
    </>
  );
};

HostTaskInfo.propTypes = {
  data: PropTypes.array,
  gpuCount: PropTypes.string
};

export default HostTaskInfo;
