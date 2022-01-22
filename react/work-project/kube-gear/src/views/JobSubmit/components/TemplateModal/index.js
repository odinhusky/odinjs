import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, uniqBy } from 'lodash';
import { toast } from 'react-toastify';

import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import MuiDropdown from 'components/BaseMuiDropdown';

import { makeStyles } from '@material-ui/core/styles';

import GlobalContext from 'layouts/Main/GlobalContext';
import Context from '../context';

import Table from './Table';

import { getJobTemplate, getCanReadJobTemplate } from 'utils/api';

import styles from './index.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

const TemplateModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userInfo } = useContext(GlobalContext);
  const { setTemplateValue, setExistTemplateNameList } = useContext(Context)
  const [templateList, setTemplateList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [ownerList, setOwnerList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectionDetail, setSelectionDetail] = useState([]);

  const handleDropdownChange = (event, item) => {
    if (item.type === 'user') {
      const user = new Set(selectedKeys);
      if (selectedKeys.has(item.id))
        user.delete(item.id)
      else
        user.add(item.id)

      setSelectedKeys(user);
    }
  };

  useEffect(() => {
    if (isEmpty(userInfo)) return;
    const hasAdminPrivileges = userInfo.admin === 'true' ? true : false;
    const getTemList = hasAdminPrivileges ? getJobTemplate() : getCanReadJobTemplate(userInfo.username);
    getTemList
      .then(res => {
        setTemplateList(res)
        const owners = [
          ...uniqBy(res.map(item => ({
            key: item.owner,
            type: 'user',
            text: item.owner === userInfo.username ? `@${t('self')}` : item.owner,
            id: item.owner
          })), 'key'),
          { key: 'divider_1', text: '-', itemType: 0 },
          { key: 'clear', text: t('clearOption'), type: 'clear', itemType: 1,
            onClick: () => {
              setSelectedUsers([])
              setSelectedKeys(new Set())
            }
          }
        ]
        setExistTemplateNameList(res.filter(item => item.owner === userInfo.username).map(item => item.name))
        setOwnerList(owners)
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }, [userInfo])

  useEffect(() => {
    let res = [...templateList];
    res = res.filter(item => item.name.includes(keyword))
    if (!isEmpty(Array.from(selectedKeys))) {
      res = res.filter(item => Array.from(selectedKeys).includes(item.owner))
    }
    setFilteredList(res)
  }, [keyword, templateList, selectedKeys])

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('chooseTemplate')}
    >
      <div className={styles.container}>
        <div className={styles.topBar}>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={t('search')}
            value={keyword}
          />
          <MuiDropdown
            list={ownerList}
            maxWidth={200}
            multiple
            onChange={(e, child) => {
              if (child.props.type === 'clear') {
                child.props.onClick()
                return
              }
              handleDropdownChange(e, child.props)
              const result = e.target.value
              setSelectedUsers(result)
            }}
            text={t('filter')}
            value={selectedUsers}
          />
        </div>
        <div className={styles.content}>
          <Table
            data={filteredList}
            setSelectionDetail={setSelectionDetail}
          />
        </div>
        <div className={styles.buttonBar}>
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
            onClick={onClose}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={true && selectionDetail.length === 0}
            onClick={() => {
              setTemplateValue(selectionDetail[0]);
              onClose();
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
};

TemplateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default TemplateModal;