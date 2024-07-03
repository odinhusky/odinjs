import {BackNavigation} from '../../../../components-bs/BackNavigation/BackNavigation'
import {PageContainer} from '../../../../components-bs/PageContainer'
import {usePrivacyAgreementBase} from '../../hooks/usePrivacyAgreementBase';
import cx from '../../../../utils/cx';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

export const PrivacyAgreementPage = () => {
    const {uiState} = usePrivacyAgreementBase();
    const {isDesktop} = useBreakpoint();
    return (
        <PageContainer className='text-[var(--transparent-white-80)]'>
            <BackNavigation/>

            <div className={cx('mx-auto w-full rounded-xl',
                'flex flex-col justify-center items-center',
                'mt-2 tablet:mt-8',
                'p-0 tablet:p-8',
                'space-y-5 mobile:space-y-8',
                isDesktop ? 'bg-linear-4-main' : '',
            )}>

                {/* title */}
                <div
                    className={cx(
                        'text-[var(--grayscale-100)] font-medium text-center',
                        'text-base mobile:text-lg tablet:text-2xl')}>
                    {uiState.title}
                </div>

                {/* policy contents */}
                <div className={cx(
                    'overflow-auto w-full h-full',
                    'space-y-4 mobile:space-y-6',
                    'font-medium text-sm mobile:text-base'
                )}>
                    {uiState.policyItems.map(item => {
                        return (
                            <div>
                                {/* policy title*/}
                                <div className={cx(item.title ? 'block' : 'hidden')}>{item.title}</div>

                                {/* policy contents*/}
                                <div className={cx(
                                    'space-y-2 mobile:space-y-3',
                                )}>
                                    {item.contents.map(content => {
                                        return (<p>{content}</p>)
                                    })}
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>
        </PageContainer>
    )
}
