import React, {
  useState,
  useContext,
  useEffect
} from 'react';

// # API
import { updateProject } from 'utils/api';

// ? context
import RepositoryContext from '../../../../RepositoryContext';

// ^ Material-ui Componets(Functions)
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// ? Self-packed Components || Functions
import { PrimaryButton } from 'components/BaseButton';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Repository/Setting
 * @component Setting
 * @description Setting
*/
const Setting = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    currentProject,
    getProjectList,
    classes
  } = useContext(RepositoryContext);

  // # states
  const [selectedPublicModeKey, setSelectedPublicModeKey] = useState(null);

  // - methods
  const handleSubmit = () => {
    const isPublic = selectedPublicModeKey === 2 ? true : false
    updateProject(currentProject.project_id, isPublic)
      .then(() => {
        toast.success(t('updateSuccess'));
        getProjectList();
      })
      .catch(err => toast.error(err.data ? err.data.message : err.message));
  };

  // * hooks
  useEffect(() => {
    const { metadata } = currentProject
    if (!metadata) return;
    const { public: pb } = metadata
    setSelectedPublicModeKey(pb === 'true' ? 2 : 1)
  }, [currentProject])

  return (
    <div className={`${classes.bg_white} ${classes.flexGrow1}`}>
      <FormControl classes={{ root: `${classes.directionRow} ${classes.flex_align_center}` }}>
        <FormLabel classes={{ root: `${classes.mx_20}` }}>{t('repositoryPrivacy')}</FormLabel>
        <RadioGroup
          aria-label="repositoryPrivacy"
          name="repositoryPrivacy"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPublicModeKey(Number(value))
          }}
          row
          value={selectedPublicModeKey}
        >
          <FormControlLabel
            classes={{ root: classes.mb_0 }}
            control={<Radio />}
            label={t('public')}
            value={2}
          />
          <FormControlLabel
            classes={{ root: classes.mb_0 }}
            control={<Radio />}
            label={t('private')}
            value={1}
          />
        </RadioGroup>
      </FormControl>
      <div className={`${classes.projectDetailSettingFormGroup}`}>
        <PrimaryButton
          children={t('submit')}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Setting;