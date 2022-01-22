import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { BaseModal } from 'components/BaseModal';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import MuiDropdown from 'components/BaseMuiDropdown';

import { countRestrictMinimum } from 'common/commonMethods';
import { deleteMembersVirtualGroup, updateMembersVirtualGroup, getGroupUserLimitResource } from 'utils/api';
import { toast } from 'react-toastify';

import styles from './EditModal.module.scss';
import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme) => ({
  marginRight10: {
    marginRight: 10
  },
  marginTop10 : {
    marginTop: 10
  },
  toolbar: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    height: '15%'
  }
}))

const EditModal = ({ isOpen, onClose, selectedUser, groupName, getData, groupVg }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedKey, setSelectedKey] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(false);
  const [settingData, setSettingData] = useState([]);

  const options = groupVg.map(item => ({ key: item.name, text: item.name }));

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`
    };
  }

  useEffect(() => {
    getGroupUserLimitResource(groupName, selectedUser?.username)
      .then(data => {
        const newData = Object.entries(data).map(([key, { jobLifeHour, resourceCells }]) => {
          const replaceCells = Object.entries(resourceCells)
            .map(([key, value]) => (
              {
                key,
                option: (value >= 0 ? 0 : value),
                value: (value === -2 || value === -1) ? 0 : value
              }
            ))
          const replaceJobLifeHour = {
            option: jobLifeHour >= 0 ? 0 : jobLifeHour,
            value: (jobLifeHour === -2 || jobLifeHour === -1) ? 0 : jobLifeHour
          }
          return {
            key,
            details: {
              jobLifeHour: replaceJobLifeHour,
              resourceCells: replaceCells
            }
          }
        })
        setSettingData(newData)
      })
      .catch(err => toast.error(err?.data ? err.data?.message : err?.message))
  }, [])

  useEffect(() => {
    setSelectedKey(
      selectedUser?.virtualGroups
        ? selectedUser.virtualGroups.filter(item => groupVg.map(item => item.name).includes(item))
        : []
    )
  }, [selectedUser])

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={500}
      onClose={onClose}
      title={t('modifyUsersVg', { user: selectedUser.username })}
    >
      <MuiDropdown
        classes={{ root: classes.marginTop10 }}
        list={options}
        maxWidth={'100%'}
        multiple
        onChange={(e) => {
          const value = e.target.value;
          setSelectedKey(value)
        }}
        // selectProps={{
        //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
        // }}
        text={t('group')}
        value={selectedKey}
      />
      <div className={styles.userBox}>
        <Toolbar
          className={classes.toolbar}
          disableGutters
        >
          <Tabs
            aria-label="tabs"
            indicatorColor="primary"
            onChange={(e, value) => {
              setSelectedTab(value)
            }}
            scrollButtons="on"
            value={selectedTab}
            variant="scrollable"
          >
            {
              selectedKey.map(vg => {
                return (
                  <Tab
                    key={vg}
                    label={vg}
                    value={vg}
                    {...a11yProps(vg)}
                  />
                )
              })
            }
          </Tabs>
        </Toolbar>
        <div
          style={
            selectedTab === false
              ? { height: '84%', display: 'flex', justifyContent: 'center', alignItems: 'center' }
              : { height: '84%', overflow: 'auto' }
          }
        >
          {
            selectedTab === false
              ?
              <div>{t('pleaseSelectVg')}</div>
              :
              settingData
                .filter(({ key }) => key === selectedTab)
                .map(({ key, details }) => {
                  const { jobLifeHour, resourceCells } = details;
                  const findVg = groupVg.find(item => item.name === key);
                  const { cells } = findVg;
                  return (
                    <Grid
                      container
                      direction={'column'}
                      key={key}
                      spacing={2}
                      style={{ padding: 20, overflow: 'auto' }}
                    >
                      <Grid item>{t('setting')}{t('enSpace')}{t('jobUseTime')}{t('enSpace')}{t('limit')}</Grid>
                      <Grid item>
                        <FormControl>
                          <RadioGroup
                            name={'jobLifeHour'}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setSettingData(prev => {
                                const selected = [...prev.filter(({ key }) => key === selectedTab)][0]
                                const updateSelected = {
                                  ...selected,
                                  details: {
                                    ...selected.details,
                                    jobLifeHour: {
                                      ...selected.details.jobLifeHour,
                                      option: (value >= 0 ? 0 : value),
                                      value: (value === -2 || value === -1) ? 0 : value
                                    }
                                  }
                                }
                                return ([ ...prev.filter(({ key }) => key !== selectedTab), updateSelected ])
                              })
                            }}
                            row
                            value={jobLifeHour.option}
                          >
                            <FormControlLabel
                              control={<Radio />}
                              label={t('Default')}
                              value={-2}
                            />
                            <FormControlLabel
                              control={<Radio />}
                              label={t('customize')}
                              value={0}
                            />
                            <BaseTextField
                              className={classes.marginRight10}
                              disabled={jobLifeHour.option === -2 || jobLifeHour.option === -1}
                              InputProps={{
                                className: classes.input,
                                inputProps: { min: 0 }
                              }}
                              onChange={(e) => {
                                const valueNum = e.target.value;
                                const restrictedValue = countRestrictMinimum(valueNum)
                                setSettingData(prev => {
                                  const selected = [...prev.filter(({ key }) => key === selectedTab)][0]
                                  const updateSelected = {
                                    ...selected,
                                    details: {
                                      ...selected.details,
                                      jobLifeHour: {
                                        ...selected.details.jobLifeHour,
                                        value: restrictedValue
                                      }
                                    }
                                  }
                                  return ([ ...prev.filter(({ key }) => key !== selectedTab), updateSelected ])
                                })
                              }}
                              style={{ width: 100 }}
                              type="number"
                              value={jobLifeHour.value}
                            />
                            <FormControlLabel
                              control={<Radio />}
                              label={t('Unlimited')}
                              value={-1}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item>{t('settingUserConfig')} ( {t('unit')} - {t('total')}{t('enSpace')}{t('amount')} )</Grid>
                      <Grid item>
                        {
                          isEmpty(resourceCells)
                            ?
                            <div>{t('noContent')}</div>
                            :
                            resourceCells.map(({ key, option, value }, idx) => {
                              return (
                                <div
                                  className={styles.row}
                                  key={key}
                                >
                                  <div>{key} - {cells[key]?.number}</div>
                                  <FormControl>
                                    <RadioGroup
                                      aria-label={key}
                                      name={key}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setSettingData(prev => {
                                          const selected = [...prev.filter(({ key }) => key === selectedTab)][0]
                                          const updateSelected = {
                                            ...selected,
                                            details: {
                                              ...selected.details,
                                              resourceCells: [
                                                ...selected.details.resourceCells.slice(0, idx),
                                                { ...selected.details.resourceCells[idx], option: Number(value) },
                                                ...selected.details.resourceCells.slice(idx + 1)
                                              ]
                                            }
                                          }
                                          return ([ ...prev.filter(({ key }) => key !== selectedTab), updateSelected ])
                                        })
                                      }}
                                      row
                                      value={option}
                                    >
                                      <FormControlLabel
                                        control={<Radio />}
                                        label={t('Default')}
                                        value={-2}
                                      />
                                      <FormControlLabel
                                        control={<Radio />}
                                        label={t('customize')}
                                        value={0}
                                      />
                                      <BaseTextField
                                        className={classes.marginRight10}
                                        disabled={option === -1 || option === -2}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                          className: classes.input,
                                          inputProps: { min: 0 }
                                        }}
                                        onChange={(e) => {
                                          const valueNum = e.target.value;
                                          const restrictedValue = countRestrictMinimum(valueNum)
                                          setSettingData(prev => {
                                            const selected = [...prev.filter(({ key }) => key === selectedTab)][0]
                                            const updateSelected = {
                                              ...selected,
                                              details: {
                                                ...selected.details,
                                                resourceCells: [
                                                  ...selected.details.resourceCells.slice(0, idx),
                                                  { ...selected.details.resourceCells[idx], value: restrictedValue },
                                                  ...selected.details.resourceCells.slice(idx + 1)
                                                ]
                                              }
                                            }
                                            return ([ ...prev.filter(({ key }) => key !== selectedTab), updateSelected ])
                                          })
                                        }}
                                        style={{ width: 100 }}
                                        type="number"
                                        value={value}
                                      />
                                      <FormControlLabel
                                        control={<Radio />}
                                        label={t('Unlimited')}
                                        value={-1}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                              )
                            })
                        }
                      </Grid>
                    </Grid>
                  )
                })
          }
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <DefaultButton
          children={t('cancel')}
          classes={{ root: classes.marginRight10 }}
          onClick={onClose}
        />
        <PrimaryButton
          children={t('edit')}
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            const putItems = settingData.filter(item => selectedKey.includes(item.key)).reduce((acc, { key, details }) => {
              const { jobLifeHour, resourceCells } = details;
              return {
                ...acc,
                [key]: {
                  jobLifeHour: jobLifeHour.option === -2 || jobLifeHour.option === -1 ? jobLifeHour.option : jobLifeHour.value,
                  resourceCells: resourceCells.reduce((acc, { key, option, value }) => {
                    return {
                      ...acc,
                      [key]: (option === -2 || option === -1) ? option : value
                    }
                  }, {})
                }
              }
            }, {})
            const deleteItems = options.filter(opt => !selectedKey.includes(opt.key)).map(opt => opt.key)
            Promise.all([
              updateMembersVirtualGroup({ groupName, userName: selectedUser.username, data: putItems }),
              deleteMembersVirtualGroup({ groupName, userName: selectedUser.username, data: deleteItems })
            ])
              .then(() => {
                onClose();
                getData();
                toast.success(`${t('edit')}${t('enSpace')}${t('success')}`);
              })
              .catch(err => toast.error(err.data ? err.data.message : err.message))
              .finally(() => setIsLoading(false))
            setIsLoading(false)
          }}
        />
      </div>
    </BaseModal>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  resourceData: PropTypes.array,
  selectedUser: PropTypes.object,
  groupName: PropTypes.string,
  getData: PropTypes.func,
  groupVg: PropTypes.array
};

export default EditModal;