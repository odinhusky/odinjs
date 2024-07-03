import {useEffect} from "react";
import {useImageLoad} from "../../../../hooks/useImageLoag";
import {CacheImage} from "../../../../components/image/CacheImage";
import cx from "../../../../utils/cx";


export interface IMenuDrawerGenieItem {
    title: string;
    subTitle: string;
    className?: string;
    icon?: string;
    defIcon?: string;
    onClick?: () => void;
    isActivePage?: boolean;
}

export const MenuDrawerGenieItem = (props: IMenuDrawerGenieItem) => {
    const {title, subTitle, className = '', icon, onClick, isActivePage} = props;
    const {loadImageAndCache, imageCache} = useImageLoad()
    const iconSrc = props?.icon || '';
    const defIconSrc = props?.defIcon || '';

    useEffect(() => {
        loadImageAndCache(iconSrc, defIconSrc, -1);
    }, []);

    return (
        <button
            className={cx(className,
                'h-[56px] min-h-[56px] w-full rounded-lg items-center relative',
                'text-[var(--grayscale-100)] text-left text-sm font-medium',
                'active:brightness-75 hover:brightness-125',
                isActivePage ? 'brightness-75' : '',
            )}
            onClick={onClick && onClick}
        >

            <CacheImage
                src={iconSrc}
                defSrc={defIconSrc}
                className={cx('w-full h-full aspect-square absolute bottom-0 object-scale-down')}
            />


            <div className={cx(
                'absolute transform -translate-y-1/2 top-1/2 p-2',
                'flex flex-col items-start',
            )}>
                <div className="w-full leading-5">
                    {title}
                </div>
                <div className="w-full leading-5">
                    {subTitle}
                </div>
            </div>
        </button>
    )
}
