import React, { useEffect } from 'react';

// ^ Redux
import { useDispatch, useSelector } from 'react-redux';
import { changeLocale } from 'layouts/Main/features/locale/localeSlice';

// ? Style
import { theme } from 'theme';
import styled from 'styled-components';
const StyledToggleButton = styled.a`
  .open & {
    background-color: ${theme.themePageHeaderPrimaryHover} !important;
  }
  &:hover {
    background-color: ${theme.themePageHeaderPrimaryHover} !important;
  }
`;

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SwitchLangButton({ setIsNotifycationDropdownOpen }) {

  // $ init data
  const { i18n } = useTranslation();
  const langs = [
    {
      key: 'en',
      text: 'English'
    },
    {
      key: 'zh-TW',
      text: '繁體中文'
    },
    {
      key: 'zh-CN',
      text: '简体中文'
    },
    {
      key: 'jp',
      text: '日本語'
    }
  ]

  // ^ Redux
  const dispatch = useDispatch();
  const locale = useSelector(state => state.locale);

  // - methods
  const switchLang = data => {
    i18n.changeLanguage(data);
    dispatch(changeLocale(data));
    cookies.set('lang', data, { path: '/' });
  };

  const currentLang = () => {
    const find = langs.find(lang => lang.key === locale)
    return find ? find.text : 'English'
  }

  // * hooks
  useEffect(() => {
    const cookiesLang = cookies.get('lang');
    if (!cookiesLang) return;
    i18n.changeLanguage(cookiesLang);
    dispatch(changeLocale(cookiesLang));
  }, []);

  return (
    <li className="dropdown">
      <StyledToggleButton
        className="dropdown-toggle"
        data-toggle="dropdown"
        href="#"
        onClick={() => setIsNotifycationDropdownOpen(false)}
      >
        <i
          className="fas fa-globe-americas"
          style={{ marginRight: 5 }}
        />
        <span className="hidden-sm hidden-xs">
          {currentLang()}
        </span>
      </StyledToggleButton>
      <ul className="dropdown-menu">
        {
          langs.map(item => (
            <li key={item.key}>
              <a
                href="#"
                onClick={() => {
                  switchLang(item.key)
                }}
              >
                {
                  locale === item.key ?
                    <FontAwesomeIcon
                      icon={locale === item.key ? 'check' : ''}
                    />
                    :
                    <svg height="16px" />
                }
                {item.text}
              </a>
            </li>
          ))
        }
      </ul>
    </li>
  );
}

SwitchLangButton.propTypes = {
  setIsNotifycationDropdownOpen: PropTypes.func
}
