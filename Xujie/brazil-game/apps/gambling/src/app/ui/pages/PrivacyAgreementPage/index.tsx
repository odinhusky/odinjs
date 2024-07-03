import React from 'react';
import {PrivacyAgreementPage as CocoPrivacyAgreementPage} from './env/u1';
import {PrivacyAgreementPage as RioPrivacyAgreementPage} from './env/u2';
import {PrivacyAgreementPage as P1PrivacyAgreementPage} from './env/p1';
import {PrivacyAgreementPage as U5PrivacyAgreementPage} from './env/u5';
import {PrivacyAgreementPage as U6PrivacyAgreementPage} from './env/u6';
import {PrivacyAgreementPage as U7PrivacyAgreementPage} from './env/u7';
import {renderByUVersion} from "../../utils/renderByUVersion";

export const PrivacyAgreementPage = () => {

  return renderByUVersion({
    "p1": <P1PrivacyAgreementPage/>,
    "u1": <CocoPrivacyAgreementPage/>,
    "u2": <RioPrivacyAgreementPage/>,
    "u5": <U5PrivacyAgreementPage/>,
    "u6": <U6PrivacyAgreementPage/>,
    "u7": <U7PrivacyAgreementPage/>,
  }, <CocoPrivacyAgreementPage/>)
};
