import React, {
  useEffect,
  useState,
  useContext,
  memo
} from 'react';

// # API
import { putResource, getGroupData } from 'utils/api';

// ? context
import ResourceManageContext from '../../../../ResourceManageContext';

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModalNew } from 'components/BaseModalNew';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import MuiDropdown from 'components/BaseMuiDropdown';
import { NUMBER_REGEX } from 'common/commonConstant'

// ^ plugins
import { toast } from 'react-toastify';
import { isEmpty, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level views/ResourceManage/ModifyResourceModal
 * @component ModifyResourceModal
 * @description ModifyResourceModal component
*/
function ModifyResourceModal({
  isOpen,
  onClose,
  getData,
  modifyResourceData,
  originModifyResourceSelectedData
}) {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    classes
  } = useContext(ResourceManageContext);

  // # states
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const [resourceList, setResourceList] = useState([]);
  const [resourceObj, setResourceObj] = useState({
    cpu: 0,
    gpu: 0,
    memory: 0
  });

  const [allGroup, setAllGroup] = useState([]);

  // - methods
  const addDropDownOptionKey = optionItems => {
    return optionItems.map((item) => ({
      key: item,
      text: item,
      ...item
    }));
  };

  const getAllGroupData = () => {
    setIsCreating(true)
    getGroupData()
      .then(res => {
        setAllGroup(res)
        setIsCreating(false)
      })
      .catch(err => {
        toast.error(err.data ? err.data.message : err.message)
        setIsCreating(false)
      })
  };

  const onSubmit = async() => {
    try {
      setIsCreating(true)

      const cells = Object.entries(resourceObj).reduce((acc, [ key, number ]) => {
        const num = Number(number)
        if (num <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number: num } }
        }
      }, {})

      const result = {
        name: name,
        group: selectedGroup === '' ? null : selectedGroup,
        cells
      }
      await putResource(modifyResourceData.name, result)
        .then(() => {
          getData()
          onClose()
          toast.success(`${t('modify')}${t('enSpace')}${t('success')}`)
          setIsCreating(false)
        })
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
      setIsCreating(false)
    }
  };

  useEffect(() => {
    if (!isEmpty(modifyResourceData) && !isEmpty(originModifyResourceSelectedData)) {
      // 更新取得叢集 data
      getAllGroupData()

      const { name, group, cells: modifyCells } = modifyResourceData;
      const resourceValueObj = {};
      const { cells: originCells } = originModifyResourceSelectedData;
  
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

      setName(name);
      setSelectedGroup(group === null ? '' : group);
      setResourceList(list);
      setResourceObj(resourceValueObj);
    }
  }, [modifyResourceData, originModifyResourceSelectedData])

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
      title={`${t('modify')}${t('enSpace')}${t('resourceAllocation')}`}
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
            item
            lg={6}
            md={6}
            sm={6}
            xl={6}
          >
            <MuiDropdown
              // classes={{ root: classes.heightAuto }}
              // inputLabelProps={{ classes: {} }}
              list={addDropDownOptionKey(allGroup)}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedGroup(value);
              }}
              // selectProps={{
              //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
              // }}
              text={`${t('group2')}${t('enSpace')}${t('name')}`}
              value={selectedGroup}
              width={'100%'}
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
                const { key } = item;
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

ModifyResourceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  getData: PropTypes.func,
  modifyResourceData: PropTypes.object,
  originModifyResourceSelectedData: PropTypes.object
};

export default memo(ModifyResourceModal, (prevProps, nextProps) => isEqual(prevProps, nextProps));
