import React from 'react';
import * as querystring from 'querystring';
import { useTranslation } from 'react-i18next';
import Header from 'components/Header';

const DetailPage = () => {
  const { t } = useTranslation();
  const query = querystring.parse(location.search.replace(/^\?/, ''));
  const ip = query['instance'];
  const iframeUrl = `${window.ENV.grafanaUri}/dashboard/db/jie-dian-shi-tu?var-node=${ip}`;
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
        src={iframeUrl}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </>
  );
};

export default DetailPage;