import {environment} from "../../../../../../environments/environment";
import {PageContainer} from "../../../../components-bs/PageContainer";
import cx from "../../../../utils/cx";
import {ClickEvent, useTelegramBase} from "../../hooks/useTelegramBase";
import {U7InternalBanner} from "../../../../components/Banner/U7InternalBanner";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {BackNavigation} from "../../../../components-bs/BackNavigation/BackNavigation";

export const TelegramPage = () => {
    const {uiState, handleClick} = useTelegramBase();
    const {isMobile, isTablet} = useBreakpoint()
    const genieRes = `assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_telegram_genie${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;
    const bannerRes = `assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_telegram${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;
    return (
        <PageContainer className={cx('mx-auto')}>
            <BackNavigation
                onClick={() => handleClick(ClickEvent.TO_INDEX)}
            />

            <div
                className={cx('mx-auto text-[var(--grayscale-100)] w-full',
                    'flex flex-col justify-center items-center',
                    'mt-4 mobile:mt-8.5 tablet:mt-8',
                    'space-y-5 mobile:space-y-8'
                )}>

                {/*Banner*/}
                <U7InternalBanner
                    bannerTitle={uiState.bannerTitle}
                    bannerBgRes={bannerRes}
                    bannerGenieRes={genieRes}
                />

                {/* depiction */}
                <div className={cx('border-stroke-popup rounded-xl text-[var(--grayscale-100)]  w-full')}>
                    <div className={cx('bg-linear-4-main p-5 mobile:p-8')}>
                        <div
                            className={cx(
                                'mb-4 mobile:mb-8',
                                'text-sm mobile:text-base'
                            )}>
                            {uiState.depictionTitle}
                        </div>

                        <div
                            className={cx(
                                'mb-4 mobile:mb-8',
                                'font-bold text-lg mobile:text-xl'
                            )}>
                            {uiState.depictionStart}
                        </div>

                        <div
                            className={cx('text-sm mobile:text-base')}>
                            {uiState.depictions.map(item => {
                                return (
                                    <p>{item}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <button
                    className={cx(
                        'linear-1-button rounded-full',
                        'm-auto py-3 mobile:px-[163px]',
                        'w-full mobile:w-auto',
                        'font-bold text-lg',
                        "border-solid border border-[var(--grayscale-60)]",
                        "shadow-[0px_4px_4px_0px_#00000040]",
                    )}
                    onClick={() => handleClick(ClickEvent.OPEN_TELEGRAM)}
                >
                    {uiState.buttonText}
                </button>


            </div>
        </PageContainer>
    );
};
