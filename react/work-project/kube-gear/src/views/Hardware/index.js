import React from 'react';
import { Route } from 'react-router-dom';

import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import ImagePage from './Pages/ImagePage';

import indexStyle from './index.module.scss'

const Hardware = () => {
  return (
    <div className={indexStyle.container}>
      <Route
        exact
        path="/cluster-view/hardware"
        render={matchProps => (
          <IndexPage {...matchProps} />
        )}
      />
      <Route
        exact
        path="/cluster-view/hardware/detail"
        render={matchProps => (
          <DetailPage {...matchProps} />
        )}
      />
      <Route
        exact
        path="/cluster-view/hardware/image"
        render={matchProps => (
          <ImagePage {...matchProps} />
        )}
      />
    </div>
  );
};

export default Hardware;
