import {environment} from '../../../../../../environments/environment'
import {PageContainer} from '../../../../components-bs/PageContainer'
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint'
import {BackNavigation} from '../../../../components-bs/BackNavigation/BackNavigation'
import {IInitialChargePage} from '../..'
import {ClickEvent, useInitialChargeBase} from '../../hooks/useInitialChargeBase';
import cx from '../../../../utils/cx';
import {U7InternalBanner} from "../../../../components/Banner/U7InternalBanner";


export const InitialChargePage = (props: IInitialChargePage) => {
    const {handleClick, uiState} = useInitialChargeBase();
    const {isMobile, isTablet, isDesktop} = useBreakpoint()

    const genieRes = `assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_primeira_recarga_genie${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;
    const bannerRes = `assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_primeira_recarga${isMobile ? '_m' : isTablet ? '_t' : ''}.png`;

    return (
        <PageContainer className={cx('mx-auto')}>
            <BackNavigation
                // title={isDesktop ? uiState.navTextPc : uiState.navText}
                onClick={() => {
                    props?.isFromActivity ? handleClick(ClickEvent.TO_ACTIVITY) : handleClick(ClickEvent.TO_INDEX)
                }}
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
                <div className={cx('border-stroke-popup rounded-xl')}>
                    <div className={cx('bg-linear-4-main p-5 mobile:p-8')}>
                        <div
                            className={cx(
                                'mb-4 mobile:mb-8',
                                'font-bold text-lg mobile:text-xl text-[var(--grayscale-100)]'
                            )}>
                            {uiState.depictionTitle}
                        </div>
                        <div
                            className={cx('text-sm mobile:text-base text-[var(--grayscale-80)]')}>
                            {uiState.depictions.map(item => {
                                return (
                                    <p>{item}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>


                {/* warn */}
                <div className={cx('border-stroke-popup rounded-xl')}>
                    <div className={cx('bg-linear-4-main rounded-xl p-5 mobile:p-8')}>
                        <div
                            className={cx('text-sm mobile:text-base text-[var(--grayscale-80)]')}>
                            {uiState.warnContent}
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
                        "shadow-[0px_4px_4px_0px_#00000040]"
                    )}
                    onClick={() => handleClick(ClickEvent.TO_WALLET)}
                >
                    {uiState.buttonText}
                </button>


            </div>
        </PageContainer>
    )
}
