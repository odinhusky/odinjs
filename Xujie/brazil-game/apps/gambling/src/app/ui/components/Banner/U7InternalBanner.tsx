import cx from "../../utils/cx";
import {CacheImage} from "../image/CacheImage";


type IInternalBanner = {
    className?: string;
    bannerTitle: string;
    bannerBgRes: string;
    bannerGenieRes: string;
}

export const U7InternalBanner = (props: IInternalBanner) => {
    const {bannerTitle, bannerBgRes, bannerGenieRes} = props;
    const bannerHeight = `h-[134px]  mobile:h-[200px] tablet:h-[280px]`;
    const bannerWidth = `max-w-[294px] mobile:max-w-[580px] tablet:max-w-[880px]`;
    const bannerFont = `font-bold text-lg mobile:text-4xl tablet:text-5xl -mr-10`;

    return (
        <div
            style={{
                backgroundImage: `url('${bannerBgRes}')`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'revert-layer',
                backgroundSize: 'cover',
                textShadow: `0px 4px 4px rgba(0,0,0,0.25)`
            }}
            className={cx(
                'relative flex items-center justify-center',
                'w-full rounded-lg px-6',
                bannerHeight,
                props.className)}>
            <div className={cx(
                'flex justify-between items-center',
                bannerWidth
            )}>
                <div
                    className={cx('z-10', bannerFont)}>
                    <div className={cx('',)}>{bannerTitle}</div>
                </div>

                <CacheImage
                    id={'bannerGenieRes'}
                    alt={'bannerGenieRes'}
                    src={bannerGenieRes}
                    className={cx('', bannerHeight)}
                />
            </div>
        </div>
    )
}