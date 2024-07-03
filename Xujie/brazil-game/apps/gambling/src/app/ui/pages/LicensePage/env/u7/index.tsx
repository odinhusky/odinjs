import {environment} from '../../../../../../environments/environment'
import {BackNavigation} from '../../../../components-bs/BackNavigation/BackNavigation'
import {PageContainer} from '../../../../components-bs/PageContainer'
import {WatermarkPhoto} from '../../../../components/WatermarkPhoto'
import {ClickEvent, useLicenseBase} from '../../hooks/useLicenseBase';
import cx from '../../../../utils/cx';

export const LicensePage = () => {
    const {uiState, handleClick} = useLicenseBase();
    return (
        <PageContainer className={cx('mx-auto')}>
            <BackNavigation
                onClick={() => handleClick(ClickEvent.TO_INDEX)}
            />

            <div
                className={cx('mx-auto text-center text-[var(--grayscale-100)] w-full',
                    'flex flex-col justify-center items-center',
                    'mt-4 mobile:mt-8.5 tablet:mt-8',
                    'space-y-5 mobile:space-y-8'
                )}>

                <div>
                    {/* title */}
                    <div className={cx('font-bold text-3xl mobile:text-4xl',
                        'mb-3 mobile:mb-2')}>
                        {uiState.title}
                    </div>

                    {/* sub title */}
                    <div className={cx('font-bold text-sm mobile:text-xl text-[var(--transparent-white-80)]',)}>
                        {uiState.subTitle}
                    </div>
                </div>

                <div className='flex flex-none justify-center w-full'>
                    <img
                        src={`assets/shared/footer-gaming-curacao.png`}
                        alt='logo'
                        className='h-10 mobile:h-16'
                    />
                </div>

                {/* depiction */}
                <div className={cx('border-stroke-popup rounded-xl text-[var(--grayscale-100)]')}>
                    <div className={cx('bg-linear-4-main p-5 mobile:p-8')}>
                        <div
                            className={cx(
                                'mb-4 mobile:mb-8',
                                'text-sm mobile:text-base'
                            )}>
                            {uiState.depiction}
                        </div>

                        <div className={cx('max-w-[304px] mobile:max-w-[338px] m-auto')}>
                            <WatermarkPhoto
                                className='rounded-xl'
                                src={`assets/license/license.jpeg`}
                                content={`${environment.platformGroup} (CC)`}
                                row={12}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
