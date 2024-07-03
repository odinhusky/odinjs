import React from "react";
import { TermsOfServicePage as CocoTermsOfServicePage } from './env/u1';
import { TermsOfServicePage as RioTermsOfServicePage } from './env/u2';
import { TermsOfServicePage as U5TermsOfServicePage } from './env/u5';
import { TermsOfServicePage as U6TermsOfServicePage } from './env/u6';
import { TermsOfServicePage as U7TermsOfServicePage } from './env/u7';
import { renderByUVersion } from "../../utils/renderByUVersion";


const TermsOfServicePage = () => {

  return renderByUVersion({
    "u1": <CocoTermsOfServicePage />,
    "u2": <RioTermsOfServicePage />,
    "u5": <U5TermsOfServicePage />,
    "u6": <U6TermsOfServicePage />,
    "u7": <U7TermsOfServicePage />
  }, <CocoTermsOfServicePage />)
}

export default TermsOfServicePage;
