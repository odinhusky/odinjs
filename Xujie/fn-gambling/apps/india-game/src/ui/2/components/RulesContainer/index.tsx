import { cx } from '@libs/commonUtils';

interface RulesContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const RulesContainer = ({
  children,
  className,
}: RulesContainerProps) => {
  return (
    <div
      className={cx(
        'bgi-[var(--linear-1)]',
        'border bgi-border-[var(--base-1-light)]',
        'after-rounded-lg rounded-lg',
        'w-full',
        className
      )}
    >
      {children}
    </div>
  );
};
export default RulesContainer;
