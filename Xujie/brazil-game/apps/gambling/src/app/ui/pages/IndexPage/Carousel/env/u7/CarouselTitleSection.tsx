import cx from "../../../../../utils/cx";

type ICarouselSubTitle = {
    children: React.ReactNode;
    className?: string;
}
export const CarouselTitleSection = (props: ICarouselSubTitle) => {
    return (
        <div
            className={cx(
                'text-white text-left',
                'absolute transform -translate-y-1/2 w-3/5 top-1/2',
                'text-lg font-bold px-4',
                'mobile:text-4xl mobile:leading-[46px] mobile:px-11 mobile:w-2/3',
                'tablet:text-2xl tablet:px-3 tablet:w-[75%]',
                props.className,
            )}
        >
            {props.children}
        </div>
    )
}
