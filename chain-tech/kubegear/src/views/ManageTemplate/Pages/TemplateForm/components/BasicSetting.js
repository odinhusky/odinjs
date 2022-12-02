import React, {
  useContext
} from 'react';

// ? context
import Context from '../Context'

// ^ Material-ui Componets(Functions)
import Grid from '@material-ui/core/Grid';

// ? Self-packed Components || Functions
import BasePanel from 'components/BasePanel';
import { TextField, RadioGroup, Dropdown, SpinButton } from './Form';

// ^ Plugin
import { useTranslation } from 'react-i18next';
// import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/BasicSetting
 * @component BasicSetting
 * @description BasicSetting component
*/
const BasicSetting = () => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    jobInformation,
    setJobInformation,
    jobTemplate,
    setJobTemplate,
    isEditMode,
    basicSettingVgOptions,
    classes
  } = useContext(Context);

  return (
    <BasePanel
      title={`${t('basic')}${t('enSpace')}${t('setting')}`}
    >
      <Grid
        className={`${classes.manageTemplateFormContent}`}
        container
        direction="column"
      >
        {
          !isEditMode &&
          <>
            <TextField
              onChange={(text) => setJobTemplate(prev => ({ ...prev, name: text }))}
              title={`${t('template')}${t('enSpace')}${t('name')}`}
              value={jobTemplate.name}
            />
            <TextField
              onChange={(text) => setJobTemplate(prev => ({ ...prev, description: text }))}
              title={t('description')}
              value={jobTemplate.description}
            />
            <RadioGroup
              onChange={(e) => {
                const value = e.target.value;
                setJobTemplate(prev => ({ ...prev, publicMode: Number(value) }))
              }}
              options={[
                { key: 1, text: t('view') },
                { key: 2, text: t('edit') },
                { key: 0, text: t('private') }
              ]}
              row
              title={t('Permission')}
              value={jobTemplate.publicMode}
            />
            <TextField
              onChange={(text) => setJobInformation(prev => ({ ...prev, name: text }))}
              title={`${t('job')}${t('enSpace')}${t('name')}`}
              value={jobInformation.name}
            />
          </>
        }
        <Dropdown
          onChange={(e) => {
            const value = e.target.value;
            setJobInformation(prev => ({ ...prev, virtualCluster: value }))
          }}
          options={basicSettingVgOptions}
          title={t('group')}
          value={jobInformation.virtualCluster}
        />
        <SpinButton
          InputProps={{ inputProps: { min: 0 } }}
          onChange={value => setJobInformation(prev => ({ ...prev, jobRetryCount: value }))}
          title={`${t('retryCount')}(${t('optional')})`}
          value={jobInformation.jobRetryCount}
        />
      </Grid>
    </BasePanel>
  );
};

export default BasicSetting;