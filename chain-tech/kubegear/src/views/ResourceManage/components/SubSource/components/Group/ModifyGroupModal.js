import React, {
  useEffect,
  useState,
  useContext
} from 'react';

// # API
import { putResourceVirtualGroup } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModalNew } from 'components/BaseModalNew';
import MuiDropdown from 'components/BaseMuiDropdown';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import { NUMBER_REGEX } from 'common/commonConstant'
import { BaseTooltip } from 'components/BaseTooltip';

// ^ Plugins
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ResourceManage/ModifyGroupModal
 * @component ModifyGroupModal
 * @description ModifyGroupModal container to edit this cluster data
*/
function ModifyGroupModal({
  isOpen,
  onClose,
  modifyGroupData,
  originModifyGroupSelectedData
}) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getData,
    classes,
    modeOption
  } = useContext(ResourceManageContext);

  // # states
  const [isCreating, setIsCreating] = useState(false);
  const [isSchedulable, setIsSchedulable] = useState(false);
  const [isQueueable, setIsQueueable] = useState(false);

  const [name, setName] = useState('');

  // 0: 預設 | 1: 排程 | 2: 排隊
  const [selectedMode, setSelectedMode] = useState(0);

  const [resourceList, setResourceList] = useState([]);
  const [resourceObj, setResourceObj] = useState({
    cpu: 0,
    gpu: 0,
    gpuMemoryPercentage: 0,
    memory: 0
  });

  // - methods
  const onSubmit = async() => {
    try {
      setIsCreating(true);

      const cells = Object.entries(resourceObj).reduce((acc, [ key, number ]) => {
        const num = Number(number)
        if (num <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number: num } }
        }
      }, {});

      const result = {
        schedulable: isSchedulable,
        queueable: isQueueable,
        cells: cells
      };

      await putResourceVirtualGroup(name, result)
        .then(() => {
          getData()
          onClose()
          setIsCreating(false)
          toast.success(`${t('modify')}${t('enSpace')}${t('success')}`)
        })
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
      setIsCreating(false)
    }
  };

  // * hooks
  useEffect(() => {
    if (!isEmpty(modifyGroupData) && !isEmpty(originModifyGroupSelectedData)) {
      const {
        name,
        cells: modifyCells,
        schedulable,
        queueable
      } = modifyGroupData;

      const resourceValueObj = {};
      const { cells: originCells } = originModifyGroupSelectedData;

      const preHandledCells = Object.entries(originCells).reduce((acc, [key, obj]) => ({ ...acc, [key]: { ...obj } }), {
        cpu: { name: 'cpu', number: 0, resourceUnit: null },
        gpu: { name: 'gpu', number: 0, resourceUnit: null },
        gpuMemoryPercentage: { name: 'gpuMemoryPercentage', number: 0, resourceUnit: null },
        memory: { name: 'memory', number: 0, resourceUnit: null }
      });

      const list = Object.entries(preHandledCells).reduce((acc, [key, details]) => {
        const { name, number } = details;

        resourceValueObj[key] = number;
        return [
          ...acc,
          {
            key,
            name,
            maxnum: modifyCells[key]['number']
          }
        ]
      }, []);

      // 模式判斷(之後需要加上排隊的邏輯)
      if(schedulable === true) {
        setSelectedMode(1)
      } else if(queueable === true) {
        setSelectedMode(2)
      } else {
        setSelectedMode(0)
      }

      setName(name)
      setIsSchedulable(schedulable);
      setIsQueueable(queueable);
      setResourceList(list);
      setResourceObj(resourceValueObj);

    }
  }, [modifyGroupData, originModifyGroupSelectedData])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isCreating}
            onClick={() => (onClose())}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isCreating}
            onClick={() => onSubmit()}
            type={'submit'}
          />
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('modify')}${t('enSpace')}${t('group')}`}
    >
      <Grid
        container
        direction="column"
        justify="center"
        spacing={2}
      >
        <Grid
          container
          direction="row"
          item
          spacing={2}
        >
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xl={6}
          >
            <BaseTextField
              disabled
              label={t('name')}
              onChange={(e) => {
                const value = e.target.value;
                setName(value)
              }}
              required
              type="text"
              value={name}
            />
          </Grid>
          <Grid
            alignItems="center"
            container
            item
            justify="center"
            lg={6}
            md={6}
            sm={6}
            xl={6}
          >
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={isSchedulable}
                  color="primary"
                  name={'schedulable'}
                  onChange={(e, value) => setIsSchedulable(value)}
                />
              }
              label={t('needScheduledToUse')}
            /> */}

            {/* 選擇模式 */}
            <MuiDropdown
              // className
              classNameObj={{
                container: `${classes.minW_init} ${classes.w_full}`
              }}
              list={modeOption}
              onChange={(e, option) => {
                // 帶入名稱，並且依照選擇的叢集重新取得資料渲染畫面
                const value = option.props.value;
                if(value === 0) {
                  setIsSchedulable(false);
                  setIsQueueable(false);
                }

                if(value === 1) {
                  setIsSchedulable(true);
                  setIsQueueable(false);
                }

                if(value === 2){
                  setIsSchedulable(false);
                  setIsQueueable(true);
                }

                setSelectedMode(option.props.value);
              }}
              onRenderOption={(option) => {
                return (
                  <div className={`${classes.flex_align_center}`}>
                    <BaseTooltip
                      arrow
                      className={`${classes.mr_10}`}
                      onClick={() => {}}
                      title={option.detail}
                    >
                      <IconButton
                        aria-label="info"
                        children={<Icon classes={{ root: classes.fz_16 }}>info_outlined</Icon>}
                        className={classes.p_0}
                      />
                    </BaseTooltip>

                    <div>{t(`${option.optionValue}`)}</div>
                  </div>
                )
              }}
              text={`${t('select')}${t('enSpace')}${t('mode')}`}
              value={t(`${modeOption[selectedMode].optionValue}`)}
            />
          </Grid>
        </Grid>

        <Grid
          item
        >
          <Grid
            className={`${classes.resourceModalContainer}`}
            container
          >
            {
              resourceList.map(item => {
                const key = item.key;
                const name = key === 'gpuMemoryPercentage' ? t('GPU Percentage') : key;

                return (
                  <Grid
                    className={`${classes.px_10} ${classes.py_5} ${classes.flex_center}`}
                    container
                    item
                    key={key}
                  >
                    <Grid
                      className={`${classes.p_8} ${classes.overflowHidden} ${classes.textOverflowEllipsis}`}
                      item
                      lg={5}
                      md={5}
                      sm={5}
                      xl={5}
                    >
                      {name}
                    </Grid>
                    <Grid
                      className={`${classes.p_8}`}
                      item
                      lg={4}
                      md={4}
                      sm={4}
                      xl={4}
                    >
                      <BaseTextField
                        InputProps={{
                          inputProps: {
                            min: 0,
                            onFocus: (e) => e.target.select(),
                            onKeyPress: (e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }
                          }
                        }}
                        label={t('amount')}
                        onChange={(e) => {
                          const value = e.target.value;
                          const restrictedValue = NUMBER_REGEX.test(value) ? Math.min(Math.max(+value, 0), item?.maxnum) : 0;

                          setResourceObj(obj => ({
                            ...obj,
                            [key]: restrictedValue
                          }))
                        }}
                        required
                        type="number"
                        value={Number(resourceObj[key]).toString()}
                      />
                    </Grid>
                    <Grid
                      className={`${classes.p_8}`}
                      item
                      lg={3}
                      md={3}
                      sm={3}
                      xl={3}
                    >
                      / {item.maxnum}
                    </Grid>
                  </Grid>
                )
              })
            }
          </Grid>
        </Grid>
      </Grid>
    </BaseModalNew>
  );
}

ModifyGroupModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  activeSystemData: PropTypes.object,
  modifyGroupData: PropTypes.object,
  originModifyGroupSelectedData: PropTypes.object
};

export default ModifyGroupModal;
