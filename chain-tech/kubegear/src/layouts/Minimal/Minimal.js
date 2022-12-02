import React, {
  useState,
  useEffect
} from 'react';

// # API
import { getAllowRegister } from 'utils/api';

// ^ Redux
import { useDispatch, useSelector } from 'react-redux';

// ? context
import GlobalContext from './GlobalContext';

// ? Self-packed Components || Functions
import Topbar from './components/Topbar';
import 'utils/i18n';

// ^ Plugins
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

const Minimal = ({ children }) => {

  // ^ Redux
  const dispatch = useDispatch();

  // # states
  const [locale, setLocale] = useState('en');
  const [isAllowRegister, setIsAllowRegister] = useState();
  const [backgroundImageExist, setBackgroundImageExist] = useState(false);
  const [svgExist, setSvgExist] = useState(false);

  // - methods
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

  // & handled data
  const contextValue = {
    locale,
    setLocale,
    isAllowRegister,
    asyncIsFileExist,
    backgroundImageExist,
    svgExist,
    dispatch,
    useSelector
  }

  useEffect(() => {
    getAllowRegister()
      .then((res) => setIsAllowRegister(res.allowRegister))
    asyncIsFileExist('/assets/img/bg.png')
      .then(res => setBackgroundImageExist(res))
    asyncIsFileExist('/assets/img/trademark/LoginRegister.svg')
      .then(res => setSvgExist(res))
  }, [])

  return (
    <GlobalContext.Provider value={contextValue}>
      <ToastContainer
        containerId="mainToast"
        position="top-center"
        style={{
          zIndex: 10000000 // bigger than modal
        }}
      />
      <Topbar />
      {children}
    </GlobalContext.Provider>
  );
};

Minimal.propTypes = {
  children: PropTypes.node
};

export default Minimal;
