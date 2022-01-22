import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import InfoStyle from './index.module.scss';

const ProjectInfo = ({ info }) => {
  const { t } = useTranslation();
  const { total, unused, using } = info;
  return (
    <div className={InfoStyle.container}>
      <div className={InfoStyle.row}>
        <div className={InfoStyle.info}>
          <span>{t('image')}</span>
        </div>
        <div className={InfoStyle.info}>
          <span>{unused}</span>
          <span>{t('unused')}</span>
        </div>
        <div className={InfoStyle.info}>
          <span>{using}</span>
          <span>{t('using')}</span>
        </div>
        <div className={InfoStyle.info}>
          <span>{total}</span>
          <span>{t('total2')}</span>
        </div>
      </div>
    </div>
  );
};

ProjectInfo.propTypes = {
  info: PropTypes.object
};

export default ProjectInfo;
