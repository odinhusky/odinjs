import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import { BasicSection } from '../basic-section';
import Card from 'components/Card';
import { DebouncedTextField } from './debounced-text-field';

import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { TEMPLATE_ERROR_MESSAGE_ID } from '../../utils/errorCode';
import Context from '../../components/context';

const TEXT_FILED_REGX = /^[a-zA-Z0-9\u4e00-\u9fa5-._~]+$/;

export const Templates = React.memo(
  ({ templatesState, setTemplates, onSelect, selected }) => {
    const { t } = useTranslation();
    const { existTemplateNameList, setErrorMessage } = useContext(Context);

    const onValueChangeName = useCallback((val) => {
      setTemplates({ ...templatesState, name: val });
    }, [templatesState]);

    const onValueChangeDescription = useCallback((val) => {
      setTemplates({ ...templatesState, description: val });
    }, [templatesState]);

    const onValueChangeMode = useCallback((val) => {
      setTemplates({ ...templatesState, publicMode: val });
    }, [templatesState]);

    const _onGetErrorMessage = value => {
      const match = TEXT_FILED_REGX.exec(value);
      const hasName = existTemplateNameList.find(name => name === value);
      if (isEmpty(match)) {
        setErrorMessage(TEMPLATE_ERROR_MESSAGE_ID, t('error'));
        return `${t('nameShouldNotBeEmpty')}`;
      }
      if (hasName) {
        setErrorMessage(TEMPLATE_ERROR_MESSAGE_ID, t('duplicateName'));
        return t('duplicateName');
      }
      setErrorMessage(TEMPLATE_ERROR_MESSAGE_ID, {});
      return '';
    };

    return (
      <div style={{ paddingTop: 20 }}>
        <div style={{ backgroundColor: '#F0FAF7', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 18, paddingRight: 8 }}>
            {t('Template')}
          </div>
        </div>
        <Card>
          <Grid
            container
            direction="column"
            justifyContent="center"
            spacing={1}
          >
            <Grid item>
              <BasicSection sectionLabel={t('saveAsTemplate')}>
                <Checkbox
                  checked={selected}
                  color="primary"
                  onChange={(e, checked) => {
                    if (!checked) {
                      setErrorMessage(TEMPLATE_ERROR_MESSAGE_ID, {});
                      setTemplates({ name: '', description: '', publicMode: 0, jobConfig: null, canReadUsers:[], canWriteUsers: [] });
                    }
                    onSelect(checked)
                  }}
                />
              </BasicSection>
            </Grid>
            {
              selected &&
              <>
                <Grid item>
                  <BasicSection sectionLabel={`${t('template')}${t('enSpace')}${t('name')}`}>
                    <DebouncedTextField
                      error={_onGetErrorMessage(templatesState.name)}
                      helperText={_onGetErrorMessage(templatesState.name)}
                      onChange={(text) => {
                        onValueChangeName(text)
                      }}
                      value={templatesState.name}
                    />
                  </BasicSection>
                </Grid>
                <Grid item>
                  <BasicSection sectionLabel={t('description')}>
                    <DebouncedTextField
                      onChange={(text) => {
                        onValueChangeDescription(text)
                      }}
                      value={templatesState.description}
                    />
                  </BasicSection>
                </Grid>
                <Grid item>
                  <BasicSection sectionLabel={t('Permission')}>
                    <RadioGroup
                      aria-label="permission"
                      name="permission"
                      onChange={(e) => {
                        const value = e.target.value;
                        onValueChangeMode(Number(value))
                      }}
                      row
                      value={templatesState.publicMode}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label={t('view')}
                        value={1}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label={t('edit')}
                        value={2}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label={t('private')}
                        value={0}
                      />
                    </RadioGroup>
                  </BasicSection>
                </Grid>
              </>
            }
          </Grid>
        </Card>
      </div>
    );
  },
);

Templates.propTypes = {
  setTemplates: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  templatesState: PropTypes.object,
  isDuplicateTemplateNameFlag: PropTypes.bool,
  existTemplateNameList: PropTypes.array
};
