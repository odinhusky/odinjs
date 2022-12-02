import React, { useContext } from 'react';

// ? context
import HardwareContext from 'views/Hardware/HardwareContext';

// ? Self-packed Components || Functions
import Header from 'components/Header';
import * as querystring from 'querystring';

// ^ Plugins
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Hardware/DetailPage
 * @component DetailPage
 * @description DetailPage
*/
const DetailPage = () => {

  // $ init data
  const { t } = useTranslation();
  const query = querystring.parse(location.search.replace(/^\?/, ''));
  const ip = query['instance'];
  const iframeUrl = `${window.ENV.grafanaUri}/dashboard/db/jie-dian-shi-tu?var-node=${ip}`;

  // ? context
  const { classes } = useContext(HardwareContext);
  return (
    <>
      <Header
        headerPath={[
          {
            title: t('hardware'),
            link: '/cluster-view/hardware'
          },
          {
            title: `${t('hardwareUseOverview')}: ${ip}`,
            link: '#'
          }
        ]}
      />
      <iframe
        className={`
          ${classes.d_block}
          ${classes.w_full}
          ${classes.h_full}
          ${classes.border_none}
        `}
        src={iframeUrl}
      />
    </>
  );
};

export default DetailPage;