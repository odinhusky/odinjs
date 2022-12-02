/* eslint-disable react/no-multi-comp */
import React, {
  useEffect,
  useState,
  useContext,
  memo
} from 'react';

// # API
import { putResourceVirtualGroup } from 'utils/api';

// ? context
import VirtualGroupContext from '../../VirtualGroupContext';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModalNew } from 'components/BaseModalNew';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import { NUMBER_REGEX } from 'common/commonConstant'

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, isEqual, get } from 'lodash';

/**
 * @author odin
 * @level views/VirtualGroup/ModifyGroupModal
 * @component ModifyGroupModal
 * @description ModifyGroupModal container to edit this cluster data
*/
function ModifyGroupModal({
  isOpen,
  onClose,
  getData,
  modifyGroupData
}) {

  // $ init data
  const { t } = useTranslation();
  const modeOption = [
    {
      key: 'immediately',
      optionValue: 'immediately',
      text: 0
    },
    {
      key: 'schedule',
      optionValue: 'schedule',
      text: 1
    },
    {
      key: 'queue',
      optionValue: 'Queue',
      text: 2
    }
  ];

  // ? context
  const {
    classes
  } = useContext(VirtualGroupContext);

  // # states
  const [isCreating, setIsCreating] = useState(false);
  const [isSchedulable, setIsSchedulable] = useState(false);
  const [isQueueable, setIsQueueable] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0)

  const [name, setName] = useState('');

  const [resourceList, setResourceList] = useState([]);
  const [resourceObj, setResourceObj] = useState({
    cpu: 0,
    gpu: 0,
    memory: 0
  });

  // - methods
  const onSubmit = async() => {
    try {
      setIsCreating(true);

      const cells = Object.entries(resourceObj).reduce((acc, [ key, number ]) => {
        if (number <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number } }
        }
      }, {});

      const result = {
        schedulable: isSchedulable,
        queueable: isQueueable,
        cells
      };

      await putResourceVirtualGroup(name, result)
        .then(() => {
          getData();
          onClose();
          setIsCreating(false);
          toast.success(`${t('edit')}${t('enSpace')}${t('success')}`);
        })
    } catch (err) {
      toast.error(err.data ? err.data.message : err.message);
      setIsCreating(false);
    }
  };

  // * hooks
  useEffect(() => {
    if (!isEmpty(modifyGroupData)) {
      const {
        name,
        denominatorCells,
        schedulable,
        queueable
      } = modifyGroupData;

      // 模式(0: 預設 | 1: 排程 | 2: 排隊)
      const mode = schedulable
        ? 1
        : queueable ? 2 : 0;

      // 分子
      const resourceValueObj = {};
      const { cells: originCells } = modifyGroupData;

      // 防止 cells 有缺漏的資源
      const preHandledOriginCells = Object.entries(originCells).reduce((acc, [key, obj]) => ({ ...acc, [key]: { ...obj } }), {
        cpu: { name: 'cpu', number: 0, resourceUnit: null },
        gpu: { name: 'gpu', number: 0, resourceUnit: null },
        gpuMemoryPercentage: { name: 'gpuMemoryPercentage', number: 0, resourceUnit: null },
        memory: { name: 'memory', number: 0, resourceUnit: null }
      });

      // 整個要顯示的 cpu gpu gpuMemoryPercentage memory
      const list = Object.entries(preHandledOriginCells).reduce((acc, [key, obj]) => {

        const denominator = get(denominatorCells, key, 0);
        const { name, number } = obj;

        resourceValueObj[key] = number;
        return [
          ...acc,
          {
            key,
            name,
            denominator
          }
        ]
      }, []);

      setName(name);
      setIsSchedulable(schedulable);
      setIsQueueable(queueable);
      setSelectedMode(mode);
      setResourceList(list);
      setResourceObj(resourceValueObj);
    }
  }, [modifyGroupData])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_20 }}
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
                          const restrictedValue = NUMBER_REGEX.test(value) ? Math.min(Math.max(+value, 0), item?.denominator) : 0;

                          setResourceObj(obj => ({
                            ...obj,
                            [key]: restrictedValue
                          }))
                        }}
                        required
                        type="number"
                        value={resourceObj[key]}
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
                      / {item.denominator}
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
  getData: PropTypes.func,
  modifyGroupData: PropTypes.object
};

export default memo(ModifyGroupModal, (prevProps, nextProps) => isEqual(prevProps, nextProps));
