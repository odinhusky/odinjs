import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import GlobalContext from '../../GlobalContext';
import indexStyle from './Topbar.module.scss';

import { theme } from 'theme';

const Topbar = () => {
  const {
    productVersion
  } = window.ENV
  const { locale, setLocale, asyncIsFileExist } = useContext(GlobalContext);
  const { i18n } = useTranslation();
  const [isDropdown, setIsDropdown] = useState(false);
  const switchLang = data => {
    i18n.changeLanguage(data);
    setLocale(data);
    cookies.set('lang', data, { path: '/' });
  };

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/pageHeaderIcon.svg')
      .then(res => setSvgExist(res))
  }, [])

  useEffect(() => {
    const cookiesLang = cookies.get('lang') ? cookies.get('lang') : 'zh-CN';
    i18n.changeLanguage(cookiesLang);
    setLocale(cookiesLang);
  }, []);

  const getLangText = lang => {
    switch (lang) {
      case 'en':
        return ' English';
      case 'zh-CN':
        return ' 简体中文';
      case 'zh-TW':
        return ' 繁體中文';
      case 'jp':
        return ' 日本語';
      default:
        return ' English';
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        minHeight: '50px',
        width: '100%',
        background: theme.themePageHeaderPrimary,
        zIndex: 1,
        display: 'flex'
        // justifyContent: 'space-between',
        // alignItems: 'center'
      }}
    >
      <div className={indexStyle.logo}>
        <Link to="/entry">
          <div className={indexStyle.logoBlock}>
            {
              svgExist &&
              <>
                <img
                  src="/assets/img/trademark/pageHeaderIcon.svg"
                />
                {productVersion && <div className={indexStyle.logoVersion}>{productVersion}</div>}
              </>
            }
          </div>
        </Link>
      </div>
      <div className={indexStyle.menu}>
        <div
          className={`${indexStyle.dropdown} ${indexStyle.dropdownhover}`}
          onClick={() => setIsDropdown(!isDropdown)}
        >
          <li>
            <a
              className="dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              style={{ color: 'white' }}
            >
              <i className="fa fa-globe" />
              {getLangText(locale)}
            </a>
          </li>
          { isDropdown ?
            <ul>
              <li
                onClick={() => {
                  switchLang('en')
                }}
              >
                <a href="#">
                  {
                    locale === 'en' &&
                    <i className="fa fa-check" />
                  }
                  English
                </a>
              </li>
              <li
                onClick={() => {
                  switchLang('zh-CN')
                }}
              >
                <a href="#">
                  {
                    locale === 'zh-CN' &&
                    <i className="fa fa-check" />
                  }
                  简体中文
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    switchLang('zh-TW')
                  }}
                >
                  {
                    locale === 'zh-TW' &&
                    <i className="fa fa-check" />
                  }
                  繁體中文
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    switchLang('jp')
                  }}
                >
                  {
                    locale === 'jp' &&
                    <i className="fa fa-check" />
                  }
                  日本語
                </a>
              </li>
            </ul>
            : <div />
          }
        </div>
      </div>
    </header>
  );
};

export default Topbar;
