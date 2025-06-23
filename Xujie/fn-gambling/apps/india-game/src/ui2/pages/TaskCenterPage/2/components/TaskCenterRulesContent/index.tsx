import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import InnerHtmlWrapper from '@components/InnerHtmlWrapper';

export const TaskCenterRulesContent = () => {
  const ruleInnerHtml = useTaskCenterPageStore((state) => state.ruleInnerHtml);
  return (
    <InnerHtmlWrapper
      className={'bgi-[var(--base-2-variant10)] !bgi-text-[var(--base-2-variant2)] rounded-b-md'}
      __html={ruleInnerHtml}
    />
  );
  //
};

export default TaskCenterRulesContent;
