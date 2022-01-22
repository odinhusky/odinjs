import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Topbar from './components/Topbar';
import GlobalContext from './GlobalContext';

import { getAllowRegister } from 'utils/api';

import 'utils/i18n';

const Minimal = props => {
  const { children } = props;
  const [locale, setLocale] = useState('en');
  const [isAllowRegister, setIsAllowRegister] = useState();

  function doesImageFileExist(urlToFile) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(!xhr.getResponseHeader('Content-Type').startsWith('text/html'));
        } else {
          reject(false);
        }
      }
      xhr.onerror = function () {
        reject(false);
      };
      xhr.send();
    })
  }

  const asyncIsFileExist = async (urlToFile) => {
    try {
      return await doesImageFileExist(urlToFile)
    } catch (err) {
      return false
    }
  }

  const contextValue = {
    locale,
    setLocale,
    isAllowRegister,
    asyncIsFileExist
  }

  useEffect(() => {
    getAllowRegister()
      .then((res) => setIsAllowRegister(res.allowRegister))
  }, [])

  return (
    <GlobalContext.Provider value={contextValue}>
      <Topbar />
      {children}
    </GlobalContext.Provider>
  );
};

Minimal.propTypes = {
  children: PropTypes.node
};

export default Minimal;
