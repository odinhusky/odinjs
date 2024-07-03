import cx from 'classnames';

import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {QuestionSection1} from "../common/QuestionSection1";
import {QuestionSection2} from "../common/QuestionSection2";
import {QuestionSection3} from "../common/QuestionSection3";
import {QuestionSection4} from "../common/QuestionSection4";
import {environment} from "../../../../../../../environments/environment";


export const QuestionContent = (props: any) => {
  const {isMobile, isTablet} = useBreakpoint();

  return (
    <div
      className={cx(`text-xs p-3 sm:p-12 mt-4 sm:text-base`, props.className)}>
      <img className={cx(
        'mb-4 mx-auto ',
        isMobile ? 'w-full' : 'w-1/2',
      )} src={`assets/${environment.uVersion}/acting.png`}/>


      <div className="mb-4 text-white"><QuestionSection1/></div>

      <div
        className="mb-3 py-3.5 px-6 py-sm:mb-4 sm:py-6 sm:px-9 border bg-[#013E42CC] border-[var(--primary-assistant)] rounded-xl text-[var(--white)]">
        <div>Por exemplo:</div>
        <QuestionSection2/>
      </div>

      <div className="mb-4 py-3.5 px-6 py-sm:mb-4 sm:py-6 sm:px-9 bg-[#FF9000] text-[var(--white)] rounded-xl"><QuestionSection3/></div>
      <div className="mb-4 py-3.5 px-6 py-sm:mb-4 sm:py-6 sm:px-9 bg-[var(--main-state-error)] text-[var(--white)] rounded-xl">
        <QuestionSection4/>
      </div>
    </div>
  )

}
