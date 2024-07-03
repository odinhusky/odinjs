import { CacheImage } from '../../../../../components/image/CacheImage';
import { IActivityButton } from '../../ActivityItem';
import { ActivityTextContainer } from '../../../ActivityTextContainer';
import { environment } from '../../../../../../../environments/environment';
import cx from '../../../../../utils/cx';
import { ActivityBadge } from '../../../../../components/Badge/ActivityBadge';
import { X_CENTER } from 'apps/gambling/src/assets/constant/style';

export const ActivityItem = (props: IActivityButton) => {
  const { category, isTop, title, subTitle, src, bgSrc, onClick, fontConfig } = props;

  return (
    <div className={cx('relative', props.className)}>
      <button className="relative overflow-hidden w-full" onClick={onClick && onClick}>
        <div className={'relative overflow-hidden w-full rounded-xl shadow-[0px_0px_4px_0px_#FFFFFF_inset]'} style={{
          backgroundImage: `url('${bgSrc}')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'revert-layer',
          backgroundSize: 'cover',
        }}>
          <CacheImage className={'relative w-[40vw] float-right right-[-30px]'} src={src ? src : ''} />

          {isTop && (
            <CacheImage
              alt={''}
              className={cx(
                'absolute left-[0px] top-[3px]',
                'mobile:top-[3px]',
                'tablet:left-[0px] tablet:top-[6px]'
              )}
              src={`assets/${environment.uVersion}/${environment.mVersion}/activity_hot_tag.png`}
            />
          )}

          {/* <div
            className={cx(
              'flex flex-wrap justify-start box-border',
              'absolute transform -translate-y-1/2 top-1/2 pl-4 pr-20 tablet:pl-8'
            )}
          >
            {title.split(/\s+/).map((item) => (
              <ActivityTextContainer
                className="text-2xl font-normal"
                children={item}
                fontConfig={fontConfig}
              />
            ))}
          </div> */}

          <div className={cx('absolute flex flex-col w-full text-[var(--grayscale-100)] px-[3%] top-1/2 -translate-y-1/2 text-left font-normal')}>
            <div className='text-base drop-shadow-[0px_4.12px_4.12px_#00000014]'>{title}</div>
            <div className='text-2xl drop-shadow-[0px_4.12px_4.12px_#00000014]'>{subTitle}</div>
          </div>

        </div>
      </button>
      <ActivityBadge
        activityType={category}
        className={cx(
          'bg-[var(--state-error-main)]',
          'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
          'absolute top-[-3px] right-[-3px] w-4 h-4',
          ' mobile:w-5 mobile:h-5'
        )}
      />
    </div>
  );
};
