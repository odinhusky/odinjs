import React, { useContext } from 'react';

// % context
import Context from '../context';

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { BasicSection } from '../basic-section';
import { KeyValueListMui } from '../controls/key-value-list-mui';
const PORT_LABEL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// ^ Plugins
import { isNaN } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const PortsList = React.memo(({ onChange, ports, classNameObj }) => {

  // $ init data
  const { t } = useTranslation();
  const isTablet = useMediaQuery('(max-width: 1280px)');

  // ? context
  const {
    classes
  } = useContext(Context);

  return (
    <BasicSection
      childrenGrid={isTablet ? 12 : 9}
      classNameObj={{
        labelSection: `${classes.portListLabelSection}`,
        formlabel: `${ports.length === 0 ? classes.portListFormLabelWithoutValue : classes.portListFormLabel}`
      }}
      containerItem
      sectionLabel={`${t('port')}${t('enSpace')}${t('setting')}(${t('optional')})`}
      titleGrid={isTablet ? 12 : 3}
      titleOptions={isTablet ? { justify: 'flex-start' } : { justify: 'flex-end', alignItems: 'center' }}
    >
      <KeyValueListMui
        classNameObj={classNameObj}
        keyField="key"
        keyName={t('portName')}
        name="Port List"
        onChange={onChange}
        onValidateKey={val => {
          if (!PORT_LABEL_REGEX.test(val)) {
            return `${t('stringFormatIs')} ^[a-zA-Z_][a-zA-Z0-9_]*$`;
          }
        }}
        onValidateValue={val => {
          let int = val;
          if (typeof val === 'string') {
            int = parseInt(val, 10);
          }
          if (int < 0 || isNaN(int)) {
            return `${t('fillInAnInteger')}`;
          }
        }}
        value={ports}
        valueField="value"
        valueName={t('portNumber')}
      />
    </BasicSection>
  );
});

PortsList.propTypes = {
  ports: PropTypes.array,
  onChange: PropTypes.func,
  classNameObj: PropTypes.object
};
