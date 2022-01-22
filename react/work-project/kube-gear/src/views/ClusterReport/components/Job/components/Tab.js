import React from 'react';
import { useTranslation } from 'react-i18next';

import BaseTab from 'components/BaseTab';
import PropTypes from 'prop-types';
import { PivotItem } from 'office-ui-fabric-react';

const Tab = ({ onChange }) => {
  const { t } = useTranslation();
  return (
    <BaseTab
      onLinkClick={item => onChange(item.props.itemKey)}
      styles={{ root: { link: { height: '40px' } } }}
    >
      <PivotItem
        headerText={`${t('jobLayerOverview')}`}
        itemKey={'job'}
      />
      <PivotItem
        headerText={`${t('taskRoleLayerOverview')}`}
        itemKey={'taskRole'}
      />
      <PivotItem
        headerText={`${t('taskLayerOverview')}`}
        itemKey={'task'}
      />
    </BaseTab>
  );
};

Tab.propTypes = {
  onChange: PropTypes.func
};
export default Tab;