import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import { BaseModal } from 'components/BaseModal';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import { countRestrictMinimum, countRestrictRange } from 'common/commonMethods';

import { getVgLimitResource, putVgLimitResource } from 'utils/api';

import { formatBytes } from 'utils';
import { MB } from 'constant';

import Context from '../../../../Context';

import styles from './UserSettingModal.module.scss';

const useStyles = makeStyles(() => ({
  input: {
    height: 40
  },
  marginRight10: {
    marginRight: 10
  }
}))

const UserSettingModal = ({ onClose, isOpen, data, getRefreshData, resourceUnits }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { originUserSettingGroupSelectedData } = useContext(Context);
  const { vg, cells } = data;

  const [isSetting, setIsSetting] = useState(false);
  const [jobLifeHourOption, setJobLifeHourOption] = useState(0);
  const [jobLifeTime, setJobLifeTime] = useState(0);

  const [resources, setResources] = useState([]);

  const checkSubmit = (resources) => {
    const checkedResources = resources.some(({ option, value }) => {
      return (option === -2 || option === -1)
        ? false
        : value !== '' ? false : true
    })

    const checkedJobLifeHour = (jobLifeHourOption === -2 || jobLifeHourOption === -1)
      ? false
      : jobLifeTime !== '' ? false : true

    return (checkedResources || checkedJobLifeHour)
  }

  const onSubmit = (resources, jobLifeHourOption, jobLifeTime ) => {
    const data = {
      'jobLifeHour': jobLifeHourOption === -2 || jobLifeHourOption === -1 ? jobLifeHourOption : jobLifeTime,
      'resourceCells': resources.reduce((acc, { key, option, value }) => {
        return { ...acc, [key]: (option === -2 || option === -1) ? option : value }
      }, {})
    }
    setIsSetting(true);
    putVgLimitResource(vg, data)
      .then(() => {
        getRefreshData()
        onClose()
        toast.success(`${t('setting')}${t('enSpace')}${t('success')}`)
      })
      .catch(err => toast.error(err?.data ? err?.data?.message : err?.message))
      .finally(() => setIsSetting(false))
  }

  const getData = (vg) => {
    getVgLimitResource(vg)
      .then((data) => {
        const { jobLifeHour, resourceCells } = data;
        setJobLifeHourOption(jobLifeHour >= 0 ? 0 : jobLifeHour)
        setJobLifeTime((jobLifeHour === -2 || jobLifeHour === -1) ? 0 : jobLifeHour)
        setResources(Object.entries(resourceCells).map(([key, value]) => (
          { key, option: (value >= 0 ? 0 : value), value: (value === -2 || value === -1) ? 0 : value }
        )))
      })
      .catch(err => toast.error(err?.data ? err?.data?.message : err?.message))
  }

  useEffect(() => {
    getData(vg)
  }, [])

  return (
    <BaseModal
      isCloseIcon
      isOpen={isOpen}
      modalWidth={500}
      onClose={onClose}
      title={`${t('UserConfig')}`}
    >
      <Grid
        container
        direction={'column'}
        spacing={2}
      >
        <Grid item>{t('setting')}{t('enSpace')}{t('jobUseTime')}{t('enSpace')}{t('limit')}</Grid>
        <Grid item>
          <FormControl>
            <RadioGroup
              name={'jobLifeHour'}
              onChange={(e) => {
                const value = e.target.value;
                setJobLifeHourOption(Number(value))
              }}
              row
              value={jobLifeHourOption}
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
                disabled={jobLifeHourOption === -2 || jobLifeHourOption === -1}
                InputProps={{
                  className: classes.input,
                  inputProps: { min: 0 }
                }}
                onChange={(e) => {
                  const valueNum = e.target.value;
                  const restrictedValue = countRestrictMinimum(valueNum)
                  setJobLifeTime(restrictedValue)
                }}
                style={{ width: 100 }}
                type="number"
                value={jobLifeTime}
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
          <div className={styles.userBox}>
            <div className={styles.rows}>
              {
                resources.map(({ key, option, value }, idx) => {
                  let name = key
                  let unit = ''
                  if (!isEmpty(originUserSettingGroupSelectedData)) {
                    const { cells: originCells } = originUserSettingGroupSelectedData;
                    if (!isEmpty(originCells[key])) {
                      const { resourceUnit } = originCells[key];
                      name = originCells[key].name
                      unit = `( ${resourceUnits[resourceUnit].gpu !== null ? resourceUnits[resourceUnit].gpu : 0} GPU, ${resourceUnits[resourceUnit].cpu} CPU, ${formatBytes(resourceUnits[resourceUnit].memory * MB)} ${t('Memory')})`
                    }
                  }
                  return (
                    <div
                      className={styles.row}
                      key={key}
                    >
                      <div>{name} {unit} - {cells[key]?.number}</div>
                      <FormControl>
                        <RadioGroup
                          aria-label={key}
                          name={key}
                          onChange={(e) => {
                            const value = e.target.value;
                            setResources(prev => (
                              [
                                ...prev.slice(0, idx),
                                { ...prev[idx], option: Number(value) },
                                ...prev.slice(idx + 1)
                              ]
                            ))
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
                            label={t('Upperlimit')}
                            onChange={(e) => {
                              const valueNum = e.target.value;
                              const restrictedValue = countRestrictRange(0, cells[key]?.number, valueNum)
                              setResources(prev => (
                                [
                                  ...prev.slice(0, idx),
                                  { ...prev[idx], value: restrictedValue },
                                  ...prev.slice(idx + 1)
                                ]
                              ))
                            }}
                            placeholder={t('Upperlimit')}
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
            </div>
          </div>
        </Grid>
        <Grid
          item
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
            disabled={isSetting}
            onClick={() => onClose()}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isSetting || checkSubmit(resources)}
            onClick={() => onSubmit(resources, jobLifeHourOption, jobLifeTime)}
            type={'submit'}
          />
        </Grid>
      </Grid>
    </BaseModal>
  )
}

UserSettingModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object,
  getRefreshData: PropTypes.func,
  resourceUnits: PropTypes.object
}

export default UserSettingModal

