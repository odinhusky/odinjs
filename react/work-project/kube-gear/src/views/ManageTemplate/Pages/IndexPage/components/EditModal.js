import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Icon from '@material-ui/core/Icon';
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton, IconButton } from 'components/BaseButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseTextField } from 'components/BaseMuiInput';
import MuiDropdown from 'components/BaseMuiDropdown';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { putJobTemplate } from 'utils/api';
import Context from '../Context';

import styles from './EditModal.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  marginBottom10: {
    marginBottom: 10
  },
  formControl: {
    display: 'flex'
  }
}))

function EditModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPublicModeKey, setSelectedPublicModeKey] = useState(null);
  const [selectedSpecialUserCanEditKeys, setSelectedSpecialUserCanEditKeys] = useState([]);

  const [selectedPrivateKeys, setSelectedPrivateKeys] = useState([]);
  const [templateName, setTemplateName] = useState();
  const [templateDescription, setTemplateDescription] = useState();
  const [isNameError, setIsNameError] = useState('');
  const [isDesError, setIsDesError] = useState('');

  const [rowsData, setRowsData] = useState([]);

  const {
    getData,
    setDesignateUpdateUser,
    designateUpdateUser,
    userPrivileges,
    userList
  } = useContext(Context);

  const clearState = () => {
    setSelectedPublicModeKey(null);
    setSelectedSpecialUserCanEditKeys([]);
    setSelectedPrivateKeys([]);
    setDesignateUpdateUser({});
  }

  const onSubmit = (id) => {
    setIsUpdating(true)
    const data = {
      name: templateName,
      description: templateDescription,
      publicMode: selectedPublicModeKey
    }

    if (selectedPublicModeKey === 1) {
      data.canWriteUsers = selectedSpecialUserCanEditKeys
    } else if (selectedPublicModeKey === 0) {
      data.canReadUsers = rowsData
        .filter(item => item.view || item.edit)
        .map(item => item.name)
      data.canWriteUsers = rowsData
        .filter(item => item.edit)
        .map(item => item.name)
    }

    putJobTemplate({ id, data })
      .then(() => {
        onClose();
        clearState();
        getData();
        toast.success(`${t('edit')}${t('enSpace')}${t('success')}`)
      })
      .catch(err => toast.error(err.data ? err.data.message : err.toString()))
      .finally(() => setIsUpdating(false))
  };

  const rules = {
    required: value => (value ? '' : t('fieldRequired')),
    userNameFormat(username) {
      const usernameValidation = RegExp(/^[A-Za-z0-9_]+$/, 'g');
      return usernameValidation.test(username) ? '' : t('userNameInvalid');
    }
  };

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      key: item,
      text: item,
      ...item
    }));
  };

  const getDropdownOrTextField = (hasPrivileges) => {
    if (hasPrivileges) {
      return (
        <MuiDropdown
          list={addDropDownOptionKeys(userList)}
          maxWidth={'100%'}
          multiple
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSpecialUserCanEditKeys(value);
          }}
          text={`${t('share')}${t('enSpace')}${t('user')}`}
          value={selectedSpecialUserCanEditKeys}
          width={'100%'}
        />
      )
    } else {
      return (
        <BaseTextField
          classes={{ root: classes.marginBottom10 }}
          label={`${t('share')}${t('enSpace')}${t('user')}`}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSpecialUserCanEditKeys(value.split(','));
          }}
          required
          type="text"
          value={selectedSpecialUserCanEditKeys.join(',')}
        />
      )
    }
  }

  const getDropdownOrTextFieldToAppend = (hasPrivileges) => {
    if (hasPrivileges) {
      return (
        <MuiDropdown
          list={addDropDownOptionKeys(userList)}
          maxWidth={'100%'}
          multiple
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPrivateKeys(value);
          }}
          text={`${t('share')}${t('enSpace')}${t('user')}`}
          value={selectedPrivateKeys}
          width={'100%'}
        />
      )
    } else {
      return (
        <BaseTextField
          classes={{ root: classes.marginBottom10 }}
          label={`${t('share')}${t('enSpace')}${t('user')}`}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPrivateKeys(value.split(','));
          }}
          required
          type="text"
          value={selectedPrivateKeys.join(',')}
        />
      )
    }
  }

  const addSpecialCustomer = data => {
    return (
      <div className={styles.block__row}>
        <div className={styles.block__row__title}>{data.name}</div>
        <div className={styles.block__row__input}>
          <FormControl>
            <RadioGroup
              aria-label={data.name}
              name={data.name}
              onChange={(e) => {
                const value = e.target.value;
                setRowsData(prev => {
                  const findData = prev.find(item => item.name === data.name)
                  if (value === 'read') {
                    findData.view = true
                    findData.edit = null
                    findData.state = value
                  } else if (value === 'write') {
                    findData.view = null
                    findData.edit = true
                    findData.state = value
                  }
                  return [...prev]
                })
              }}
              row
              value={rowsData.find(item => item.name === data.name).state}
            >
              <FormControlLabel
                control={<Radio />}
                label={t('view')}
                value={'read'}
              />
              <FormControlLabel
                control={<Radio />}
                label={t('edit')}
                value={'write'}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className={styles.block__row__cancel}>
          <IconButton
            children={<Icon>close</Icon>}
            onClick={() => {
              setRowsData(prev => {
                const array = JSON.parse(JSON.stringify(prev))
                return array.filter(item => item.name !== data.name)
              })
            }}
          />
        </div>
      </div>
    )
  }

  useEffect(() => {
    const copyUpdateUser = JSON.parse(JSON.stringify(designateUpdateUser))
    const { publicMode, canReadUsers, canWriteUsers, name, description } = copyUpdateUser
    setSelectedPublicModeKey(publicMode)
    setTemplateName(name)
    setTemplateDescription(description)
    const array = []
    if (publicMode === 0) {
      canReadUsers.map(name => {
        if (canWriteUsers.includes(name)) {
          array.push({
            name: name,
            state: 'write',
            view: null,
            edit: true
          })
        } else {
          array.push({
            name: name,
            state: 'read',
            view: true,
            edit: null
          })
        }
      })
    } else if (publicMode === 1) {
      setSelectedSpecialUserCanEditKeys(canWriteUsers)
    }
    setRowsData(array)
  }, [designateUpdateUser])

  return (
    <BaseModal
      isOpen={isOpen}
      title={`${t('setting')}`}
    >
      <div className={styles.container}>
        <div>
          {t('Creator')}: {designateUpdateUser.owner}
        </div>
        <BaseTextField
          classes={{ root: `${classes.marginBottom20} ${classes.marginTop10}` }}
          error={isNameError === '' ? false : true}
          helperText={isNameError === '' ? '' : isNameError}
          label={t('name')}
          onChange={(e) => {
            const value = e.target.value;
            setTemplateName(value)
            const checkField = rules.userNameFormat(value);
            setIsNameError(checkField)
          }}
          required
          type="text"
          value={templateName}
        />
        <BaseTextField
          classes={{ root: `${classes.marginBottom20}` }}
          error={isDesError === '' ? false : true}
          helperText={isDesError === '' ? '' : isDesError}
          label={t('description')}
          onChange={(e) => {
            const value = e.target.value;
            setTemplateDescription(value)
            const checkField = rules.required(value);
            setIsDesError(checkField)
          }}
          required
          type="text"
          value={templateDescription}
        />
        <FormControl classes={{ root: classes.formControl }}>
          <FormLabel>{t('Permission')}</FormLabel>
          <RadioGroup
            aria-label="permission"
            name="permission"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPublicModeKey(Number(value))
            }}
            value={selectedPublicModeKey}
          >
            <FormControlLabel
              control={<Radio />}
              label={t('allUserCanEdit')}
              value={2}
            />
            <FormControlLabel
              control={<Radio />}
              label={t('AllUsersCanViewSpecificUsersCanEdit')}
              value={1}
            />
            {
              selectedPublicModeKey === 1 &&
              <div className={styles.private}>
                { getDropdownOrTextField(userPrivileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) } 
              </div>
            }
            <FormControlLabel
              control={<Radio />}
              label={t('PrivateSpecificUsersCanViewAndEdit')}
              value={0}
            />
            {
              selectedPublicModeKey === 0 &&
              <div className={styles.private}>
                <div className={styles.selected}>
                  <div className={`${styles.dropdown} ${styles.marginRight10}`}>
                    { getDropdownOrTextFieldToAppend(userPrivileges.some(pvg => pvg === 'ADMIN' || pvg === 'USER')) }
                  </div>
                  <div className={styles.addButton}>
                    <PrimaryButton
                      children={t('add')}
                      onClick={() => {
                        setRowsData(prev => {
                          const array = JSON.parse(JSON.stringify(prev))
                          if (prev.length === 0) {
                            for (let i = 0; i < selectedPrivateKeys.length; i++) {
                              array.push({
                                name: selectedPrivateKeys[i],
                                view: null,
                                edit: null
                              })
                            }
                            return array
                          } else {
                            const existName = JSON.parse(JSON.stringify(prev)).map(item => item.name)
                            const newRowName = [...selectedPrivateKeys].filter(item => !existName.includes(item))
                            if (newRowName.length === 0) {
                              return array
                            } else {
                              for (let i = 0; i < newRowName.length; i++) {
                                array.push({
                                  name: newRowName[i],
                                  view: null,
                                  edit: null
                                })
                              }
                              return array
                            }
                          }
                        })
                        setSelectedPrivateKeys([]);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.block}>
                  {rowsData.map((item, index) => {
                    return (
                      <div key={index}>
                        {addSpecialCustomer(item)}
                      </div>
                    )
                  })}
                </div>
              </div>
            }
          </RadioGroup>
        </FormControl>
        <div className={styles.footer}>
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
            disabled={isUpdating}
            onClick={() => {
              onClose();
              clearState();
            }}
          />
          {
            isUpdating
              ? <CircularProgress />
              :
              <PrimaryButton
                children={t('confirm')}
                disabled={isUpdating}
                onClick={() => onSubmit(designateUpdateUser.id)}
              />
          }
        </div>
      </div>
    </BaseModal>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default EditModal;
