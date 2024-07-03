import {IPanelMode} from "../index";
import {HowToImage as WHowToImage} from "./env/wild/HowToImageContainer";
import {HowToImage as CHowToImage} from "./env/u1/HowToImageContainer";
import {renderByUVersion} from "../../../utils/renderByUVersion";
import {HowToImage as PHowToImage} from "./env/p1/HowToImageContainer";
import {QuestionContent as CQuestionContent} from "./env/u1/QuestionContent";
import {QuestionContent as WQuestionContent} from "./env/wild/QuestionContent";
import {QuestionContent as PQuestionContent} from "./env/p1/QuestionContent";
import {HowToInviteTabSection as RHowToInviteTabSection} from './env/u2'
import {HowToInviteTabSection as U5HowToInviteTabSection} from './env/u5'
import {HowToInviteTabSection as U6HowToInviteTabSection} from './env/u6'
import {HowToInviteTabSection as U7HowToInviteTabSection} from './env/u7'

export type IHowToInviteTabSection = {
  inviteUrl: string;
} & IPanelMode
export const HowToInviteTabSection = (props: IHowToInviteTabSection ) => {



  
  return (

    <div className={'mb-[80px] min-w-[300px]'}>
      {renderByUVersion({
        "wild777bet": (
          <>
            <WHowToImage className="p-4 rounded-2xl" />
            <WQuestionContent />
          </>
        ),
        "p1": (
          <>
            <PHowToImage className="p-4 rounded-2xl" inviteUrl={props.inviteUrl} />
            <PQuestionContent />
          </>
        ),
        "u1": (
          <>
            <CHowToImage className="p-4 sm:p-0 rounded-2xl" />
            <CQuestionContent />
          </>),
        "u2": <RHowToInviteTabSection {...props} />,
        "u5": <U5HowToInviteTabSection {...props} />,
        "u6": <U6HowToInviteTabSection {...props} />,
        "u7": <U7HowToInviteTabSection {...props} />,
      }, (
        <>
          <PHowToImage className="p-4 rounded-2xl" />
          <PQuestionContent />
        </>))}
    </div>
  );
};
