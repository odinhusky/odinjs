import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import BreadCrumbs from 'components/BreadCrumbs';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';

import Context from '../../Context';
import Table from './components/Table';
import CreateModal from './components/CreateModal';

const useStyles = makeStyles(() => ({
  marginRight10: {
    marginRight: 10
  },
  heightAuto: {
    height: 'auto'
  },
  iconClearMarginLeft: {
    marginLeft: 0
  }
}))

export const IndexPage = ({ match }) => {
  const { getIndexPageData } = useContext(Context);
  const { t } = useTranslation();
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  return (
    <>
      <BreadCrumbs />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('mount')}`}
            classes={{
              root: classes.marginRight10,
              startIcon: classes.iconClearMarginLeft
            }}
            onClick={() => setIsModalOpen(true)}
            startIcon={<Icon>add</Icon>}
          />
          <DefaultButton
            children={t('refresh')}
            onClick={getIndexPageData}
            startIcon={<Refresh />}
          />
        </div>
        <div>
          <MuiAutocomplete
            classes={{ root: `${classes.marginRight10} ${classes.heightAuto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Table
          keyword={keyword}
          match={match}
        />
      </div>
      {
        isModalOpen &&
        <CreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      }
    </>
  )
}

IndexPage.propTypes = {
  match: PropTypes.object
}

export default IndexPage;
