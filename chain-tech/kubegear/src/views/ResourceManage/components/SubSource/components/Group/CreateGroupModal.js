import React, {
  useEffect,
  useState,
  useContext,
  memo
} from 'react';

// # API
import { postResourceVirtualGroup } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModalNew } from 'components/BaseModalNew';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import { NUMBER_REGEX } from 'common/commonConstant';
import MuiDropdown from 'components/BaseMuiDropdown';
import { BaseTooltip } from 'components/BaseTooltip';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  isEqual,
  get
} from 'lodash';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/ResourceManage/CreateGroupModal
 * @component CreateGroupModal
 * @description CreateGroupModal component
*/
function CreateGroupModal({
  isOpen,
  onClose,
  activeSystemData
}) {

  // $ init data
  const { t } = useTranslation();
  const defaultResource = {
    cpu: 0,
    gpu: 0,
    gpuMemoryPercentage: 0,
    memory: 0
  };

  // ? context
  const {
    getData,
    classes,
    modeOption
  } = useContext(ResourceManageContext);

  // # states
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [isSchedulable, setIsSchedulable] = useState(false);
  const [isQueueable, setIsQueueable] = useState(false);

  // 0: 預設 | 1: 排程 | 2: 排隊
  const [selectedMode, setSelectedMode] = useState(0);

  const [resourceList, setResourceList] = useState([]);
  const [resourceObj, setResourceObj] = useState({ ...defaultResource });

  // - methods
  const onSubmit = async() => {
    try {
      setIsCreating(true)

      const cells = Object.entries(resourceObj).reduce((acc, [ key, number ]) => {
        if (number <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number } }
        }
      }, {})

      const result = {
        name: name,
        resource: activeSystemData.parent === null ? 'system' : activeSystemData.name,
        schedulable: isSchedulable,
        queueable: isQueueable,
        cells
      };

      await postResourceVirtualGroup(result)
        .then(() => {
          getData()
          onClose()
          setIsCreating(false)
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`)
        });
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
      setIsCreating(false)
    }
  };

  /**
   * @author odin
   * @description 根據 activeSystemData 組合出 CPU、GPU、Memory 的選項
  */
  useEffect(() => {
    const { cells, usedCells } = activeSystemData;
    const judge = !isEmpty(usedCells);

    const list = Object.entries({ ...defaultResource }).reduce((acc, [key]) => {
      const { name, number } = get(cells, key, { name: key, number: 0 });
      const maxnum = judge ? number - usedCells[key] : number;

      return [
        ...acc,
        {
          key,
          name,
          maxnum
        }
      ]
    }, []);

    setResourceList(list);
  }, [activeSystemData])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{ root: classes.mr_10 }}
            disabled={isCreating}
            onClick={() => onClose()}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isCreating || (name === '')}
            onClick={() => onSubmit()}
            type={'submit'}
          />
        </>
      }
      onClose={onClose}
      size="sm"
      title={`${t('add')}${t('enSpace')}${t('group')}`}
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
            direction="column"
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
                      className={`${classes.p_8} ${classes.textOverflowEllipsis} ${classes.overflowHidden}`}
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

CreateGroupModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  activeSystemData: PropTypes.object
};

export default memo(CreateGroupModal, (prevProps, nextProps) => isEqual(prevProps, nextProps));
