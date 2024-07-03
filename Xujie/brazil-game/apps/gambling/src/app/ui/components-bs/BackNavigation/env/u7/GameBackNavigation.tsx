import cx from '../../../../utils/cx';

type IGameBackNavigation = {
  onClick?: () => void;
  className?: string;
};

export const GameBackNavigation = (props: IGameBackNavigation) => {
  return (
    <div
      className={cx(
        'border-popup-button linear-3-button rounded-full ',
        'fixed z-[100] top-5 left-5',
        'flex items-center box-border cursor-pointer',
        'py-2 px-[30px] text-sm font-bold text-[var(--grayscale-100)]'
      )}
      onClick={props.onClick}
    >
      {'Retornar'}
    </div>
  );
};
