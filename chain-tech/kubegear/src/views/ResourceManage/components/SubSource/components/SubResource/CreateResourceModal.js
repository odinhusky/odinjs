/* eslint-disable react/no-multi-comp */
import React, {
  memo,
  useEffect,
  useState,
  useContext
} from 'react';

// # API
import { postResource, getGroupData } from 'utils/api';

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

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { isEmpty, isEqual, get } from 'lodash';

/**
 * @author odin
 * @level views/ResourceManage/CreateRoleModal
 * @component CreateRoleModal
 * @description CreateRoleModal component
*/
function CreateRoleModal({
  isOpen,
  onClose,
  activeSystemData,
  getData
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
    classes
  } = useContext(ResourceManageContext);

  // # states
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');

  const [resourceList, setResourceList] = useState([]);
  const [resourceObj, setResourceObj] = useState({ ...defaultResource });

  const [selectedGroup, setSelectedGroup] = useState('');
  const [allGroup, setAllGroup] = useState([]);

  // - methods
  const addDropDownOptionKey = optionItems => {
    return optionItems.map((item) => ({
      key: item,
      text: item,
      ...item
    }));
  };

  /**
   * @author odin
   * @description 取得所有的叢集
  */
  const getAllGroupData = () => {
    setIsCreating(true)
    getGroupData('')
      .then(res => setAllGroup(res))
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsCreating(false))
  }

  /**
   * @author odin
   * @description 送出新增資源分配
  */
  const onSubmit = async() => {
    try {
      setIsCreating(true)
      const cells = Object.entries(resourceObj).reduce((acc, [ key, number ]) => {
        if (number <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number } }
        }
      }, {});

      const result = {
        name: name,
        group: selectedGroup === '' ? null : selectedGroup,
        parent: activeSystemData.parent === null ? 'system' : activeSystemData.name,
        cells
      }

      await postResource(result)
        .then(() => {
          getData()
          onClose()
          setIsCreating(false)
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`)
        })
    } catch (err) {
      toast.error(err?.data ? err.data?.message : err?.message)
      setIsCreating(false)
    }
  };

  // * hooks
  /**
   * @author odin
   * @description 根據 activeSystemData 組合出 CPU、GPU、Memory 的選項
  */
  useEffect(() => {
    // 更新取得叢集 data
    getAllGroupData();

    // 整理出可以用的資源
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
      title={t('resourceAllocation')}
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
              resourceList.map((item) => {
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

CreateRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  getData: PropTypes.func,
  activeSystemData: PropTypes.object
};

export default memo(CreateRoleModal, (prevProps, nextProps) => isEqual(prevProps, nextProps));
