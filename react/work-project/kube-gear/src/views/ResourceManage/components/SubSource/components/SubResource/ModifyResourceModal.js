import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModal } from 'components/BaseModal';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import MuiDropdown from 'components/BaseMuiDropdown';

import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

import { putResource, getGroupData } from 'utils/api';

import { formatBytes } from 'utils';
import { MB } from 'constant';

import Context from '../../../../Context';

// import indexStyle from './ModifyResourceModal.module.scss';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

function ModifyResourceModal({ isOpen, onClose, resourceUnits }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { getData, modifyResourceData, originModifyResourceSelectedData } = useContext(Context);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [unitsList, setUnitsList] = useState([]);
  const [allGroup, setAllGroup] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const addDropDownOptionKey = optionItems => {
    return optionItems.map((item) => ({
      key: item,
      text: item,
      ...item
    }));
  };

  const addDropDownOptionKeys = optionItems => {
    return optionItems.map((item) => ({
      text: `${item.name} ( ${item.units.gpu !== null ? item.units.gpu : 0} GPU, ${item.units.cpu} CPU, ${formatBytes(item.units.memory * MB)} ${t('Memory')})`,
      optionkey: item.key,
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
  }

  const onSubmit = async() => {
    try {
      setIsCreating(true)
      const cells = Object.values(selectedUnits)
        .map(item => ({ ...item, number: item.number === '' ? 0 : item.number }))
        .reduce((acc, { key, number }) => {
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
        cells: cells
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
      getAllGroupData()

      const { name, group, cells } = modifyResourceData;
      setName(name)
      setSelectedGroup(group === null ? '' : group)
      const remainCellsWithNum = Object.entries(cells).reduce((acc, [key, details]) => {
        const { name, number, resourceUnit } = details;
        const units = resourceUnits[resourceUnit]
        return [
          ...acc,
          { key, units, name, number, maxnum: number }
        ]
      }, [])
      setUnitsList(remainCellsWithNum)


      const { cells: originCells } = originModifyResourceSelectedData
      const selectedUnits = Object.entries(originCells).reduce((acc, [key, details]) => {
        const { resourceUnit, name, number } = details
        const units = resourceUnits[resourceUnit]
        return [
          ...acc,
          {
            key,
            text: `${name} (${units.cpu} CPU, ${units.gpu !== null ? units.gpu : 0} GPU, ${units.memory} ${t('Memory')})`,
            number,
            maxnum: modifyResourceData['cells'][key]['number']
          }
        ]
      }, [])

      setSelectedUnits(selectedUnits)

    }
  }, [modifyResourceData, originModifyResourceSelectedData])

  return (
    <BaseModal
      isCloseIcon
      isOpen={isOpen}
      modalWidth={500}
      onClose={onClose}
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
          container
          item
        >
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xl={12}
          >
            <MuiDropdown
              // classes={{ root: classes.heightAuto }}
              // inputLabelProps={{ classes: {} }}
              list={addDropDownOptionKeys(unitsList)}
              multiple
              onChange={(e, child) => {
                setSelectedUnits(
                  selectedUnits.find(item => item.key === child.props.optionkey) === undefined
                    ?
                    [
                      ...selectedUnits,
                      {
                        key: child.props.optionkey,
                        text: child.props.text,
                        number: 0,
                        maxnum: child.props.maxnum
                      }
                    ]
                    :
                    selectedUnits.filter(selected => selected.key !== child.props.optionkey),
                )
              }}
              onChangeChecked={(valueOrigin, item) => {
                return valueOrigin.find(data => data.key === item.optionkey) !== undefined ? true : false
              }}
              // selectProps={{
              //   SelectDisplayProps: { style: { paddingTop: 17, paddingBottom: 13, fontSize: 16 } }
              // }}
              text={`${t('Select')}${t('enSpace')}${t('unit')}`}
              value={selectedUnits.map(item => item.text)}
              valueOrigin={selectedUnits}
              width={'100%'}
            />
          </Grid>
        </Grid>
        <Grid
          item
          style={{ height: 300 }}
        >
          <Grid
            container
            direction="column"
            style={{ border: '1px solid rgba(0, 0, 0, 0.12)', flexWrap: 'nowrap', height: '100%', borderRadius: 4, overflow: 'auto' }}
          >
            {
              selectedUnits.map(item => {
                const { key } = item;
                return (
                  <Grid
                    alignItems="center"
                    container
                    direction="row"
                    item
                    justify="center"
                    key={key}
                    spacing={2}
                    style={{ padding: 8 }}
                  >
                    <Grid
                      item
                      lg={8}
                      md={8}
                      sm={8}
                      style={{ padding: 8, textOverflow: 'ellipsis', overflow: 'hidden' }}
                      xl={8}
                    >
                      {item.text}
                    </Grid>
                    <Grid
                      item
                      lg={3}
                      md={3}
                      sm={3}
                      style={{ padding: 8 }}
                      xl={3}
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
                          const regex = /^[0-9]+$/;
                          const selectedUnit = selectedUnits.find(unit => unit.key === item.key)
                          const restrictedValue = regex.test(value) ? Math.min(Math.max(+value, 0), selectedUnit?.maxnum) : ''
                          const find = { ...selectedUnit, number: restrictedValue }
                          const findIndex = selectedUnits.findIndex(unit => unit.key === item.key)
                          const filterUnits = selectedUnits.filter(unit => unit.key !== item.key)
                          filterUnits.splice(findIndex, 0, find)

                          setSelectedUnits(filterUnits)
                        }}
                        required
                        type="number"
                        value={item.number}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={1}
                      md={1}
                      sm={1}
                      style={{ padding: 8 }}
                      xl={1}
                    >
                      / {item.maxnum}
                    </Grid>
                  </Grid>
                )
              })
            }
          </Grid>
        </Grid>
        <Grid
          item
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <DefaultButton
            children={t('cancel')}
            classes={{ root: classes.marginRight10 }}
            disabled={isCreating}
            onClick={() => (onClose())}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isCreating}
            onClick={() => onSubmit()}
            type={'submit'}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}

ModifyResourceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  resourceUnits: PropTypes.object
};

export default ModifyResourceModal;
