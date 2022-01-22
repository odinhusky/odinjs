/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { BaseModal } from 'components/BaseModal';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';
import BaseTextField from 'components/BaseMuiInput/BaseTextField';
import MuiDropdown from 'components/BaseMuiDropdown';
import Grid from '@material-ui/core/Grid';

import { postResource, getGroupData } from 'utils/api';

import { formatBytes } from 'utils';
import { MB } from 'constant';

import Context from '../../../../Context';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  }
}))

function CreateRoleModal({ isOpen, onClose, data, resourceUnits }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { getData } = useContext(Context);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [unitsList, setUnitsList] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [allGroup, setAllGroup] = useState([]);

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
    getGroupData('')
      .then(res => setAllGroup(res))
      .catch(err => toast.error(err.data ? err.data.message : err.message))
      .finally(() => setIsCreating(false))
  }

  const onSubmit = async() => {
    try {
      setIsCreating(true)
      const cells = Object.values(selectedUnits).reduce((acc, { key, number }) => {
        if (number <= 0) {
          return { ...acc }
        } else {
          return { ...acc, [key]: { number } }
        }
      }, {})
      const result = {
        name: name,
        group: selectedGroup === '' ? null : selectedGroup,
        parent: data.parent === null ? 'system' : data.name,
        cells: cells
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

  useEffect(() => {
    getAllGroupData()
    const { cells, usedCells } = data;
    const remainCellsWithNum = Object.entries(cells).reduce((acc, [key, value]) => {
      const { name, number, resourceUnit } = value;
      const units = resourceUnits[resourceUnit]
      return [
        ...acc,
        {
          key, units, name,
          number: usedCells[key] ? number - usedCells[key] : number,
          maxnum: usedCells[key] ? number - usedCells[key] : number
        }
      ]
    }, [])
    setUnitsList(remainCellsWithNum.filter(item => item.number !== 0))
  }, [data])

  return (
    <BaseModal
      isCloseIcon
      isOpen={isOpen}
      modalWidth={500}
      onClose={onClose}
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
                        name: child.props.text,
                        number: '',
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
              value={selectedUnits.map(item => item.name)}
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
                      {item.name}
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
            onClick={() => onClose()}
          />
          <PrimaryButton
            children={t('confirm')}
            disabled={isCreating || (name === '')}
            onClick={() => onSubmit()}
            type={'submit'}
          />
        </Grid>
      </Grid>
    </BaseModal>
  );
}

CreateRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  resourceUnits: PropTypes.object
};

export default CreateRoleModal;
