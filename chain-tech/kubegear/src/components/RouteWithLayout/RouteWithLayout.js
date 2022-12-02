import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import cookies from 'js-cookie';

const checkAuth = () => {
  return cookies.get('token') ? true : false
};

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, auth, ...rest } = props;
  return (
    auth ?
      checkAuth() ?
        <Route
          {...rest}
          render={matchProps => (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          )}
        />
        :
        <Redirect to="/" />
      :
      <Route
        {...rest}
        render={matchProps => (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        )}
      />
  )
};

RouteWithLayout.propTypes = {
  auth: PropTypes.bool,
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
