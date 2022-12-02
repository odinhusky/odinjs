import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import { createGlusterfsVolume } from 'utils/api';

// ? context
import Context from './Context';
import GlusterFSContext from 'views/GlusterFS/GlusterFSContext';

// ^ Material-ui Components(Functions)
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

// ? Self-packed Components || Functions
import { BaseTextField } from 'components/BaseMuiInput';
import BaseModalNew from 'components/BaseModalNew';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { GB } from 'constant';

// ^ Plugins
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/GlusterFSRoute/GlusterFS/CreateNativeVolumeModal
 * @component CreateNativeVolumeModal
 * @description CreateNativeVolumeModal to create native volume
*/
function CreateNativeVolumeModal({ isOpen, onClose }) {

  // $ init data
  const { t } = useTranslation();
  const rules = {
    required: value => (value ? '' : t('fieldRequired'))
  };

  // ? context
  const { classes } = useContext(GlusterFSContext);
  const { getData, volumeCanBind } = useContext(Context);

  // # states
  const [choiceGroupData, setChoiceGroupData] = useState({});
  const [createGlusterfsData, setCreateGlusterfsData] = useState({});
  const [isGlusterfsDataCreating, setGlusterfsDataCreating] = useState(false);
  const [selectedSource, setSelectedSource] = useState();
  const [isNameError, setIsNameError] = useState('');

  // - methods
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

  // * hooks
  useEffect(() => {
    if (selectedSource !== undefined) {
      const findData = volumeCanBind.find(item => item.source === selectedSource)
      setChoiceGroupData(findData)
      setCreateGlusterfsData(submitData => ({ ...submitData, source: findData.source, target: findData.target }));
    }
  }, [selectedSource])

  return (
    <BaseModalNew
      isOpen={isOpen}
      modalFoot={
        <>
          <DefaultButton
            children={t('close')}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
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
        </>
      }
      size="sm"
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
      <div className={`${classes.createNativeVolumeModalWrapper}`} >
        <div className={`${classes.createNativeVolumeModalVolume}`}>
          <FormControl
            classes={{
              root: classes.createNativeVolumeModalFormControl
            }}
          >
            <RadioGroup
              aria-label="permission"
              classes={{ root: volumeCanBind.length > 0 ? '' : classes.h_full }}
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
                        classes={{ root: `${classes.mx_0} ${classes.d_flex}` }}
                        control={<Radio />}
                        label={item.source}
                        value={item.source}
                      />
                    )
                  })
                  : <div className={`${classes.createNativeVolumeModalNoVolumeCanBind}`}>{t('noVolumeCanBind')}</div>
              }
            </RadioGroup>
          </FormControl>
        </div>
        <div className={`${classes.createNativeVolumeModalVolumeDetail}`}>
          <BaseTextField
            classes={{ root: classes.mb_10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.source !== undefined ? true : false }}
            label={`${t('PhysicalGlusterFS')}${t('enSpace')}${t('volumeGlusterFS')}`}
            required
            type="text"
            value={choiceGroupData.source}
          />
          <BaseTextField
            classes={{ root: classes.mb_10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.size !== undefined ? true : false }}
            label={`${t('size')} GB`}
            required
            type="text"
            value={choiceGroupData.size === undefined ? '' : ((choiceGroupData.size) / GB).toFixed(2)}
          />
          <BaseTextField
            classes={{ root: classes.mb_10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.used !== undefined ? true : false }}
            label={`${t('used')} GB`}
            required
            type="text"
            value={choiceGroupData.used === undefined ? '' : ((choiceGroupData.used) / GB).toFixed(2)}
          />
          <BaseTextField
            classes={{ root: classes.mb_10 }}
            disabled
            InputLabelProps={{ shrink: choiceGroupData.available !== undefined ? true : false }}
            label={`${t('available')} GB`}
            required
            type="text"
            value={choiceGroupData.available === undefined ? '' : ((choiceGroupData.available) / GB).toFixed(2)}
          />
        </div>
      </div>
    </BaseModalNew>
  );
}

CreateNativeVolumeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default CreateNativeVolumeModal;
