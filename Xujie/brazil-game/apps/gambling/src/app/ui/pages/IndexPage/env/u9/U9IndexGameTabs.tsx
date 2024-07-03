import cx from 'apps/gambling/src/app/ui/utils/cx';
import { IndexGameTab } from '../../hooks/useU9IndexPageBase';
import U9DragSlider from './U9DragSlider';
import U9IndexGameTabUnit from './U9IndexGameTabUnit';

interface U9IndexGameTabsProps {
  indexGameTabs: IndexGameTab[];
}

export const U9IndexGameTabs = ({ indexGameTabs }: U9IndexGameTabsProps) => {
  // console.log('@@ indexGameTabs', indexGameTabs);
  const heightClass = cx('h-[60px]');

  return (
    // 這一層是佔一個空間
    <div className={cx('relative w-full', 'box-all-border', heightClass)}>
      {/* 絕對定位這層才是真正的內容，為了符合滿版的設計 */}
      <div
        className={cx(
          'absolute top-0 left-[-16px]',
          'w-screen max-w-[376px]',
          heightClass,
          'relative',
          'bg-secondary-main',
          'px-2',
          'border-t-[0.5px] border-b-[0.5px] border-[var(--grayscale-50)]'
        )}
      >
        <U9DragSlider>
          {indexGameTabs.map((item) => (
            <U9IndexGameTabUnit {...item} heightClass={heightClass} />
          ))}
        </U9DragSlider>
      </div>
    </div>
  );
};

export default U9IndexGameTabs;
