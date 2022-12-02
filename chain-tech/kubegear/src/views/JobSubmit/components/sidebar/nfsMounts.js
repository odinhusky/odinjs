import React, { useContext, useMemo } from 'react';

// % context
import Context from '../context';

// ^ Material-ui Components(Functions)
// import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import { NfsMountLists } from '../controls/nfs-mount-list-mui';
import { GlusterfsMountLists } from '../controls/glusterfs-mount-list-mui';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const NFSMounts = React.memo(
  ({
    nfsMounts,
    onChange,
    glusterfsMounts,
    onGlusterfsMountChange
  })=> {

    // $ init data
    const { t } = useTranslation();
    const isTablet = useMediaQuery('(max-width: 1280px)');

    // ? context
    const { nfsNames, glusterfsNames, classes } = useContext(Context);

    // - methods
    const options = useMemo(
      () => {
        return nfsNames.map(nfsName => ({
          key: nfsName,
          text: nfsName
        }));
      },
      [nfsNames]
    );

    const glusterfsOptions = useMemo(
      () => {
        return glusterfsNames.map(gfs => ({
          key: gfs,
          text: gfs
        }));
      },
      [glusterfsNames]
    );

    return (
      <div className={`${classes.pt_20}`}>
        <div className={`${classes.tabFormContainer} ${classes.flex_align_center}`}>
          <div className={`${classes.pt_8} ${classes.fz_18}`}>
            {t('storageSetting')}
          </div>
        </div>
        <div className={`${classes.nfsMountContainer}`}>
          <>
            {
              <>
                <NfsMountLists
                  classNameObj={{
                    firstInput: `${isTablet ? classes.pr_10 : classes.pr_8}`,
                    secondInputGrid: `${isTablet ? classes.pl_2 : classes.pl_4}`,
                    secondInput: `${isTablet ? classes.pr_20 : classes.pr_16}`
                  }}
                  hint={t('toolTipsNFS')}
                  keyOptions={options}
                  name="NFS List"
                  nfsMounts={nfsMounts}
                  onChange={onChange}
                  title={t('NFS')}
                />
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <div style={{ flexGrow: 1, borderBottom: '1px solid #eaeaea', marginLeft: 20, marginTop: 20, marginBottom: 20 }} />
                </div>
                <GlusterfsMountLists
                  classNameObj={{
                    firstInput: `${isTablet ? classes.pr_10 : classes.pr_8}`,
                    secondInputGrid: `${isTablet ? classes.pl_2 : classes.pl_4}`,
                    secondInput: `${isTablet ? classes.pr_20 : classes.pr_16}`
                  }}
                  hint={t('toolTipsNFS')}
                  keyOptions={glusterfsOptions}
                  name="GlusterFS List"
                  nfsMounts={glusterfsMounts}
                  onChange={onGlusterfsMountChange}
                  title={t('glusterfs')}
                />
              </>
            }
          </>
        </div>
      </div>
    );
  }
);

NFSMounts.propTypes = {
  glusterfsMounts: PropTypes.array.isRequired,
  nfsMounts: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onGlusterfsMountChange: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};
