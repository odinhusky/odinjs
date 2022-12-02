import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import { getVgLimitResource, putVgLimitResource } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

// ? Self-packed Components || Functions
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import { BaseModalNew } from 'components/BaseModalNew';
import { countRestrictMinimum, countRestrictRange } from 'common/commonMethods';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/ResourceManage/UserSettingModal
 * @component UserSettingModal
 * @description UserSettingModal component
*/
const UserSettingModal = ({
  onClose,
  isOpen,
  data,
  getRefreshData,
  originUserSettingGroupSelectedData
}) => {

  // $ init data
  const { t } = useTranslation();
  const { vg, cells } = data;

  // ? context
  const { classes } = useContext(ResourceManageContext);

  // # states
  const [isSetting, setIsSetting] = useState(false);
  const [jobLifeHourOption, setJobLifeHourOption] = useState(0);
  const [jobLifeTime, setJobLifeTime] = useState(0);
  const [resources, setResources] = useState([]);

  // - methods
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
    <BaseModalNew
      isCloseIcon
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isSetting}
            onClick={() => onClose()}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isSetting || checkSubmit(resources)}
            onClick={() => onSubmit(resources, jobLifeHourOption, jobLifeTime)}
            type={'submit'}
          />
        </>
      }
      onClose={onClose}
      size="sm"
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
                className={classes.mr_10}
                disabled={jobLifeHourOption === -2 || jobLifeHourOption === -1}
                InputProps={{
                  className: classes.h_40px,
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
          <div className={classes.userSettingModalBox}>
            <div className={classes.userSettingModalRows}>
              {
                resources.map(({ key, option, value }, idx) => {
                  let name = key
                  if (!isEmpty(originUserSettingGroupSelectedData)) {
                    const { cells: originCells } = originUserSettingGroupSelectedData;

                    const preHandledOriginCells = Object.entries(originCells).reduce((acc, [key, obj]) => ({ ...acc, [key]: { ...obj } }), {
                      cpu: { name: 'cpu', number: 0, resourceUnit: null },
                      gpu: { name: 'gpu', number: 0, resourceUnit: null },
                      gpuMemoryPercentage: { name: 'gpuMemoryPercentage', number: 0, resourceUnit: null },
                      memory: { name: 'memory', number: 0, resourceUnit: null }
                    });

                    const nameVal = originCells[key].name;

                    if (!isEmpty(preHandledOriginCells[key])) {
                      // 將 gpuMemoryPercentage 替換成詞條內容
                      name = nameVal === 'gpuMemoryPercentage' ? t('GPU Percentage') : nameVal;
                    }
                  }
                  return (
                    <div
                      className={classes.userSettingModalRow}
                      key={key}
                    >
                      <div>{name} - {cells[key]?.number}</div>
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
                            className={classes.mr_10}
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
      </Grid>
    </BaseModalNew>
  )
}

UserSettingModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object,
  getRefreshData: PropTypes.func,
  originUserSettingGroupSelectedData: PropTypes.object
}

export default UserSettingModal

