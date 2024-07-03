import {BackNavigation} from '../../../../components-bs/BackNavigation/BackNavigation';
import {PageContainer} from '../../../../components-bs/PageContainer';
import cx from '../../../../utils/cx';
import {ClickEvent} from '../../../LicensePage/hooks/useLicenseBase';
import {useCompanyProfileBase} from '../../hooks/useCompanyProfileBase';


export const CompanyProfilePage = () => {
    const {uiState, handleClick} = useCompanyProfileBase();
    return (
        <PageContainer className={cx('mx-auto')}>
            <BackNavigation
                onClick={() => handleClick(ClickEvent.TO_INDEX)}
            />

            <div
                className={cx(
                    'w-full mx-auto text-start w-full',
                    'flex flex-col justify-center items-center',
                    'mt-4 mobile:mt-8.5 tablet:mt-8',
                    'space-y-5 mobile:space-y-8',
                    'text-[var(--grayscale-100)]'
                )}>

                {/* title */}
                <div
                    className={'w-full flex justify-start items-center space-x-3'}>
                    <div
                        className={'flex-none font-bold text-2xl mobile:text-4xl'}>
                        {uiState.title}
                    </div>
                    <div className={'font-bold text-sm mobile:text-xl text-[var(--transparent-white-80)]'}>
                        {uiState.subTitle}
                    </div>
                </div>

                {/* milestones */}
                <div className={'space-y-4 mobile:space-y-8'}>
                    {uiState.milestones.map(item => {
                        return (
                            <div>
                                {/* milestones title */}
                                <div
                                    className={cx(
                                        'flex justify-start items-center space-x-3',
                                        'mb-2 mobile:mb-3',
                                        'text-[var(--grayscale-100)]'
                                    )}>
                                    <div
                                        className={'font-bold text-lg mobile:text-2xl'}>
                                        {item.year}
                                    </div>
                                    <div className={'font-bold text-sm mobile:text-base'}>
                                        {item.milestoneTitle}
                                    </div>
                                </div>

                                {/* milestones content */}
                                <div className={'font-medium text-sm mobile:text-base text-[var(--grayscale-70)]'}>
                                    {item.milestoneContent}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* licensing */}
                <div className={cx('border-stroke-popup rounded-xl')}>
                    <div className={cx('bg-linear-4-main p-5 mobile:p-8')}>
                        <div className={'font-bold text-base mobile:text-lg mb-3'}>
                            {uiState.licensingTitle}
                        </div>
                        <div
                            className={cx('text-sm mobile:text-base text-[var(--transparent-white-70)]')}>
                            {uiState.licensingContents.map(item => {
                                return (
                                    <p>{item}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
