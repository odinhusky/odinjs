import React, {
  useState,
  useContext
} from 'react';

// ? context
import NFSDiskListContext from '../../NFSDiskListContext';

// ^ Material-ui Components(Functions)
import Icon from '@material-ui/core/Icon';
import { Refresh } from '@material-ui/icons';

// ? Self-packed Components || Functions
import BreadCrumbs from 'components/BreadCrumbs';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { PrimaryButton, DefaultButton } from 'components/BaseButton';
import Table from './components/Table';
import CreateModal from './components/CreateModal';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/NFSDiskList/IndexPage
 * @component IndexPage
 * @description IndexPage page
*/
export const IndexPage = ({ match }) => {

  // $ init data
  const { t } = useTranslation();

  // ? context
  const {
    getIndexPageData,
    classes
  } = useContext(NFSDiskListContext);

  // # states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  return (
    <>
      <BreadCrumbs />
      <div
        className={`
          ${classes.flex_justify_between}
          ${classes.mb_16}
        `}
      >
        <div>
          <PrimaryButton
            children={`${t('add')}${t('enSpace')}${t('mount')}`}
            classes={{
              root: classes.mr_10,
              startIcon: classes.ml_0
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
            classes={{ root: `${classes.mr_10} ${classes.h_auto}` }}
            onInputChange={(e, value) => setKeyword(value)}
            placeholder={`${t('search')}${t('enSpace')}${t('name')}`}
            value={keyword}
          />
        </div>
      </div>
      <div className={`${classes.flexGrow1} ${classes.overflowHidden}`}>
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
