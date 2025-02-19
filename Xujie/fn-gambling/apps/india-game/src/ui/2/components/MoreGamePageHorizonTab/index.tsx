import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { handleMoreGamePageHorizonTabClick } from '@libs/mode2/action/moreGameaction/acitonType';
import useMoreGamePageActions, {
  ActionClickPayloadMap,
  HandleMoreGamePageClickProps,
} from '@libs/mode2/action/moreGameaction/useMoreGamePageActions';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useMoreGamePageStoreStore } from '@libs/mode2/zustand/page/moreGamePage';
import { MoreGamePageTabType } from '@mode2/@types/moreGamePageTabType';

interface MoreGamePageHorizonTabProps {
  handleMoreGamePageAction: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMoreGamePageClickProps<T>) => void;
}

export const horizonTabs = [
  MoreGamePageTabType.ALL,
  MoreGamePageTabType.HOT,
  MoreGamePageTabType.RECENT,
];

export const MoreGamePageHorizonTab = ({
  handleMoreGamePageAction,
}: MoreGamePageHorizonTabProps) => {
  const activeHorizonTab = useMoreGamePageStoreStore(
    (state) => state.activeHorizonTab
  );

  return (
    <div className={cx('w-full max-w-[750px]', FLEX_ITEMS_CENTER, 'px-4')}>
      {horizonTabs.map((tabName, index, arr) => {
        const isFirst = index === 0;
        const isLast = index + 1 === arr.length;
        const isActive = tabName === activeHorizonTab;

        return (
          <button
            key={tabName}
            onClick={() => {
              handleMoreGamePageAction({
                actionName: handleMoreGamePageHorizonTabClick,
                payload: { tabName },
              });
            }}
            className={cx(
              'flex-1',
              FLEX_CENTER,
              'relative',
              'py-[10px]',
              'bg-shadow-[var(--horizon-tab-inset-shadow)]',
              'text-base',
              {
                'bgi-text-[var(--base-1-main)] bgi-[var(--base-2-variant15)]':
                  isActive,
                'bgi-text-[var(--grayscale-100)] bgi-[var(--base-2-variant11)]':
                  !isActive,
              },
              {
                'rounded-tl-full rounded-bl-full': isFirst,
                'rounded-tr-full rounded-br-full': isLast,
              }
            )}
          >
            {tabName}

            {isActive ? (
              <img
                src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
                alt="Tab Active Bottom background image"
                className={cx(
                  'w-full h-full',
                  'object-contain',
                  'absolute bottom-0 left-0'
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default MoreGamePageHorizonTab;
