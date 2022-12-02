import React, {
  useCallback,
  useContext,
  memo
} from 'react';

// ? context
import Context from '../../components/context';

// ^ Material-ui Components(Functions)
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// ? Self-packed Components || Functions
import { BasicSection } from '../basic-section';
import Card from 'components/Card';
import { DebouncedTextField } from './debounced-text-field';
import { TEMPLATE_ERROR_MESSAGE_ID } from '../../utils/errorCode';

const TEXT_FILED_REGX = /^[a-zA-Z0-9\u4e00-\u9fa5-._~]+$/;

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

/**
 * @author odin
 * @level views/JobSubmit/Templates
 * @component Templates
 * @description Templates component - 詢問是否要將此次的設定值存成模板
*/
export const Templates = memo(
  ({
    templatesState,
    setTemplates,
    onSelect,
    isTemplatesSelected,
    setErrorMessage,
    existTemplateNameList
  }) => {

    // $ init data
    const { t } = useTranslation();

    // ? context
    const {
      classes
    } = useContext(Context);

    // - methods
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
      <div className={`${classes.pt_20}`}>
        <div className={`${classes.tabFormContainer} ${classes.fz_18} ${classes.flex_align_center}`}>
          <div className={`${classes.pr_8}`}>
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
              <BasicSection
                classNameObj={{
                  container: `${classes.h_40px}`
                }}
                sectionLabel={t('saveAsTemplate')}
              >
                <Checkbox
                  checked={isTemplatesSelected}
                  className={`${classes.m_0} ${classes.templateCheckBoxStyleAdjustment}`}
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
              isTemplatesSelected &&
              <>
                {/* 模板名稱 */}
                <Grid item>
                  <BasicSection
                    classNameObj={{
                      labelSection: `${classes.alignItemsStart} ${classes.pt_12}`
                    }}
                    sectionLabel={`${t('template')}${t('enSpace')}${t('name')}`}
                  >
                    <DebouncedTextField
                      className={`${classes.unlimitWidthInput}`}
                      error={_onGetErrorMessage(templatesState.name)}
                      helperText={_onGetErrorMessage(templatesState.name)}
                      onChange={(text) => {
                        onValueChangeName(text)
                      }}
                      value={templatesState.name}
                    />
                  </BasicSection>
                </Grid>

                {/* 說明 */}
                <Grid item>
                  <BasicSection
                    classNameObj={{
                      labelSection: `${classes.alignItemsStart} ${classes.pt_12}`
                    }}
                    sectionLabel={t('description')}
                  >
                    <DebouncedTextField
                      className={`${classes.unlimitWidthInput}`}
                      onChange={(text) => {
                        onValueChangeDescription(text)
                      }}
                      value={templatesState.description}
                    />
                  </BasicSection>
                </Grid>

                {/* 權限 */}
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
                      className={`${classes.mb_0}`}
                      control={<Radio />}
                      label={t('view')}
                      value={1}
                    />
                    <FormControlLabel
                      className={`${classes.mb_0}`}
                      control={<Radio />}
                      label={t('edit')}
                      value={2}
                    />
                    <FormControlLabel
                      className={`${classes.mb_0}`}
                      control={<Radio />}
                      label={t('private')}
                      value={0}
                    />
                  </RadioGroup>
                </BasicSection>
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
  isTemplatesSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  templatesState: PropTypes.object,
  existTemplateNameList: PropTypes.array,
  setErrorMessage: PropTypes.func
};
