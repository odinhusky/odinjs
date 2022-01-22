import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import Grid from '@material-ui/core/Grid';
import BasePanel from 'components/BasePanel';
import { TextField, RadioGroup, Dropdown, SpinButton } from './Form';

import styles from '../index.module.scss';

import Context from '../Context'
const BasicSetting = () => {
  const { t } = useTranslation();
  const { jobInformation, setJobInformation, jobTemplate, setJobTemplate, vgInfos, isEditMode } = useContext(Context);

  const options = useMemo(() => {
    const hasSchedulable = Object.entries(vgInfos).filter(([, item]) => item.schedulable !== false).map(([, item]) => ({ key: item.name, text: item.name }))
    const notHasSchedulable = Object.entries(vgInfos).filter(([, item]) => item.schedulable === false).map(([, item]) => ({ key: item.name, text: item.name }))

    if (!isEmpty(hasSchedulable)) {
      return [
        { key: 'group', text: t('group'), itemType: 2 },
        ...notHasSchedulable,
        { key: 'divider_1', text: '-', itemType: 0 },
        { key: 'scheduleGroup', text: `${t('schedule')}${t('enSpace')}${t('group')}`, itemType: 2 },
        ...hasSchedulable
      ]
    } else {
      return [ ...notHasSchedulable ]
    }
  }
  , [vgInfos]);

  return (
    <BasePanel
      title={`${t('basic')}${t('enSpace')}${t('setting')}`}
    >
      <Grid
        className={styles.formContent}
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
          options={options}
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