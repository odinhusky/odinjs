import {useState} from 'react';
import {AppLocalStorage} from '../../../persistant/localstorage';
import {useAllowLoginRouterRules} from '../../router/hooks/useAllowLoginRouterRules';

import {SettingPage as PSettingPage} from "./env/p1/SettingPage";
import {SettingPage as WSettingPage} from "./env/wild/SettingPage";
import {SettingPage as CSettingPage} from "./env/u1/SettingPage";
import { SettingPage as RioSettingPage } from './env/u2';
import { SettingPage as U5SettingPage } from './env/u5';
import { SettingPage as U6SettingPage } from './env/u6';
import U7SettingPage from './env/u7';
import { SettingPage as U9SettingPage } from './env/u9';
import {renderByUVersion} from "../../utils/renderByUVersion";
import {AppLocalStorageKey} from "../../../persistant/AppLocalStorageKey";

export const SettingPage = () => {
  useAllowLoginRouterRules();

  const [editing, setEditing] = useState(false);
  const userInfo = JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}');
  const { phone, nickname } = userInfo;

  const defaultProps = {
    nickname,
    phone
  };

  const defaultPropsWithEdit = {
    editing,
    setEditing,
    ...defaultProps
  };

  return renderByUVersion({
    "wild777bet": (
      <WSettingPage {...defaultPropsWithEdit} />
    ),
    "p1": (
      <PSettingPage {...defaultPropsWithEdit} />
    ),
    "u1": (
      <CSettingPage {...defaultPropsWithEdit} />
    ),
    "u2": (
      <RioSettingPage {...defaultProps} />
    ),
    "u5": (
      <U5SettingPage {...defaultProps} />
    ),
    "u6": (
      <U6SettingPage {...defaultProps} />
    ),
    "u7": (
      <U7SettingPage {...defaultPropsWithEdit} />
    ),
    "u9": (
      <U9SettingPage {...userInfo} />
    )
  }, (
    <PSettingPage {...defaultPropsWithEdit} />
  ))
};
