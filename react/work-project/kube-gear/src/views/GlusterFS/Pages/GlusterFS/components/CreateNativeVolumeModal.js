import React, { useState, useContext, useEffect } from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModal from 'components/BaseModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';

import PropTypes from 'prop-types';
import Context from './Context';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { createGlusterfsVolume } from 'utils/api';

import styles from './CreateNativeVolumeModal.module.scss';
import { GB } from 'constant';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  iconClearMarginLeft: {
    marginLeft: 0
  },
  formControl: {
    flex: 1,
    display: 'flex',
    overflow: 'auto',
    border: '1px solid #A19F9D',
    borderRadius: '4px'
  },
  formControlLabel: {
    marginLeft: 0,
    marginRight: 0,
    display: 'flex'
  },
  formLabel: {
    margin: '10px 0'
  },
  height100: {
    height: '100%'
  }
}))

function CreateNativeVolumeModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { getData, volumeCanBind } = useContext(Context);

  const [choiceGroupData, setChoiceGroupData] = useState({});
  const [createGlusterfsData, setCreateGlusterfsData] = useState({});
  const [isGlusterfsDataCreating, setGlusterfsDataCreating] = useState(false);
  const [selectedSource, setSelectedSource] = useState();
  const [isNameError, setIsNameError] = useState('');

  const onSubmit = async() => {
    if (createGlusterfsData.name && createGlusterfsData.source && createGlusterfsData.target) {
      try {
        setGlusterfsDataCreating(true);
        await createGlusterfsVolume(createGlusterfsData);
        toast.success(t('success'));
        setChoiceGroupData({});
        setCreateGlusterfsData({});
        setGlusterfsDataCreating(false);
        onClose();
        getData();
      } catch (err) {
        setChoiceGroupData({});
        setCreateGlusterfsData({});
        toast.error(err?.data?.message ? err?.data?.message : err?.message);
        setGlusterfsDataCreating(false);
      }
    } else {
      toast.success(t('error'));
    }
  };

  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  useEffect(() => {
    if (selectedSource !== undefined) {
      const findData = volumeCanBind.find(item => item.source === selectedSource)
      setChoiceGroupData(findData)
      setCreateGlusterfsData(submitData => ({ ...submitData, source: findData.source, target: findData.target }));
    }
  }, [selectedSource])

  return (
    <BaseModal
      isOpen={isOpen}
      modalWidth={500}
      title={`${t('bind')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
    >
      <BaseTextField
        error={isNameError}
        helperText={isNameError === '' ? '' : isNameError}
        label={t('name')}
        onChange={(e) => {
          const value = e.target.value;
          setCreateGlusterfsData(submitData => ({ ...submitData, name: value }));
          const checkField = rules.required(value);
          setIsNameError(checkField)
        }}
        required
        type="text"
      />
      <FormLabel classes={{ root: classes.formLabel }}>{`${t('select')}${t('enSpace')}${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}</FormLabel>
      <div className={styles.wrapper} >
        <div className={styles.volume}>
          <FormControl
            classes={{
              root: classes.formControl
            }}
          >
            <RadioGroup
              aria-label="permission"
              classes={{ root: volumeCanBind.length > 0 ? '' : classes.height100 }}
              name="permission"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSource(value)
              }}
              value={selectedSource}
            >
              {
                volumeCanBind.length > 0
                  ?
                  volumeCanBind.map(item => {
                    return (
                      <FormControlLabel
                        classes={{ root: classes.formControlLabel }}
                        control={<Radio />}
                        label={item.source}
                        value={item.source}
                      />
                    )
                  })
                  : <div className={styles.noVolumeCanBind}>{t('noVolumeCanBind')}</div>
              }
            </RadioGroup>
          </FormControl>
        </div>
        <div className={styles.volumeDetail}>
          <BaseTextField
            classes={{ root: classes.marginBottom10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.source !== undefined ? true : false }}
            label={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
            required
            type="text"
            value={choiceGroupData.source}
          />
          <BaseTextField
            classes={{ root: classes.marginBottom10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.size !== undefined ? true : false }}
            label={`${t('size')} GB`}
            required
            type="text"
            value={choiceGroupData.size === undefined ? '' : ((choiceGroupData.size) / GB).toFixed(2)}
          />
          <BaseTextField
            classes={{ root: classes.marginBottom10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.used !== undefined ? true : false }}
            label={`${t('used')} GB`}
            required
            type="text"
            value={choiceGroupData.used === undefined ? '' : ((choiceGroupData.used) / GB).toFixed(2)}
          />
          <BaseTextField
            classes={{ root: classes.marginBottom10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.available !== undefined ? true : false }}
            label={`${t('available')} GB`}
            required
            type="text"
            value={choiceGroupData.available === undefined ? '' : ((choiceGroupData.available) / GB).toFixed(2)}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <DefaultButton
          children={t('cancel')}
          classes={{
            root: classes.marginRight10,
            startIcon: classes.iconClearMarginLeft
          }}
          disabled={isGlusterfsDataCreating}
          onClick={() => {
            onClose();
            setCreateGlusterfsData({});
            setChoiceGroupData({});
          }}
        />
        {
          isGlusterfsDataCreating
            ? <CircularProgress />
            :
            <PrimaryButton
              children={t('confirm')}
              disabled={createGlusterfsData.target && createGlusterfsData.name ? false : true}
              onClick={onSubmit}
            />
        }
      </div>
    </BaseModal>
  );
}

CreateNativeVolumeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateNativeVolumeModal;
