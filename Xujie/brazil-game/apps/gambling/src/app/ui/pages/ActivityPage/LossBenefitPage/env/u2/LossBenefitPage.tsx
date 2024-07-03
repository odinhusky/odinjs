import {ILossBenefitPage} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";
import {CacheImage} from "../../../../../components/image/CacheImage";
import cx from "classnames";
import {ActivityRecordButton} from "../../../HallPage/ActivityRecordButton";
import React, {useEffect} from "react";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import {TranslateStringToDOM} from "../../../TranslateStringToDOM";
import {ActivityRedeemableButton} from "../../../ActivityRedeemableButton";
import {notification} from "antd";
import {environment} from "../../../../../../../environments/environment";
import {ActivityPageRouter} from "../../../index";


export const LossBenefitPage = (props: ILossBenefitPage) => {
    const {
        lossBenefitData,
        redeemState,
        onRefreshLossBenefit,
        internalBannerRes,
        navigate,
        onClickToActivity,
        onClickRedeemable,
        isMobile,
        isTablet,
        isDesktop,
        fontConfig
    } = props;
    const {bannerTitle, yesterdayLoss, todayBonus, tableHeads, tableBody, description, isRedeemable} = lossBenefitData;
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (redeemState) {
            api.open({
                message: (<div className={'text-[var(--white)]'}>{redeemState.message}</div>),
                className: cx(
                    'rounded-md',
                    redeemState.isError ? 'bg-[var(--state-error-main)]' : 'bg-[var(--state-success-main)]'
                ),
                icon: (
                    <CacheImage
                        className={cx('anticon anticon-check-circle')}
                        alt={'icon_success'}
                        src={redeemState.isError ?
                            `assets/${environment.uVersion}/icon_warn.png`
                            : `assets/${environment.uVersion}/icon_success.png`
                        }
                    />
                ),
                closeIcon: (
                    <CacheImage
                        className={cx('anticon-close anticon')}
                        alt={'icon_close'}
                        src={`assets/${environment.uVersion}/icon_close.png`}
                    />
                ),
            })
            if (onRefreshLossBenefit) {
                onRefreshLossBenefit();
            }
        }
    }, [redeemState])

    return (
        <PageContainer>
            {contextHolder}
            <BackNavigation
                onClick={() => {
                    navigate(PageOrModalPathEnum.ActivityHallPage);
                }}
            />
            <section className={''}>
                <div className={cx(
                    'relative overflow-hidden'
                )}>
                    <CacheImage
                        className={cx('w-[100vw]')}
                        alt={'dalyCashback'}
                        src={internalBannerRes}
                    />

                    <div
                        className={cx(
                            {'text-[3vw] px-[60px] w-2/3': isDesktop},
                            {'text-[4vw] px-[48px] w-2/3': isTablet},
                            {'text-[5vw] px-[32px] w-2/3': isMobile},
                            'flex flex-wrap ',
                            'absolute transform -translate-y-1/2 top-1/2',
                            'justify-start'
                        )}
                    >
                        {
                            bannerTitle.split(/\s+/).map(item =>
                                <ActivityTextContainer
                                    children={item}
                                    fontConfig={fontConfig}
                                />
                            )}
                    </div>
                </div>
            </section>

            <section className={cx(
                'flex flex-wrap justify-between items-center mt-4 text-[var(--grayscale-100)] gap-5',
                {'text-center': isMobile},
                isDesktop ? 'text-[18px]' : 'text-[14px]'
            )}>

                <div
                    className={cx('bg-[var(--grayscale-20)] flex flex-wrap justify-between p-4 rounded-xl gap-2 flex-1 items-center')}>
                    <div className={cx({'w-full': isMobile})}>Perdas de ontem</div>
                    <div className={cx('text-[var(--state-error-main)]', {'w-full': isMobile})}>{yesterdayLoss}</div>
                </div>


                <div
                    className={cx('bg-[var(--grayscale-20)] flex flex-wrap justify-between p-4 rounded-xl gap-2 flex-1 items-center')}>
                    <div className={cx({'w-full': isMobile})}>Bônus de suporte de hoje</div>
                    <div className={cx('text-[var(--state-success-main)]', {'w-full': isMobile})}>{todayBonus}</div>
                </div>

            </section>


            <section className={'flex flex-wrap justify-end items-center mt-4'}>
                <ActivityRecordButton
                    name={"Reg de Coletas"}
                    className={cx(
                        'text-white py-2 px-4 rounded-lg font-lg',
                        'bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]',
                        isDesktop ? 'text-[18px]' : 'text-[14px]',
                        {'w-full': isMobile}
                    )}
                    onClick={() => {
                        onClickToActivity({category: ActivityPageRouter.RECORD})
                    }}
                />
            </section>

            <section className={cx('mt-4',
                isDesktop ? 'text-[18px]' : isTablet ? 'text-[14px]' : 'text-[12px]')}>
                <div className="overflow-x-auto text-white text-center rounded-xl">
                    <table className="w-full">
                        <thead className={cx('bg-[var(--grayscale-30)]')}>
                        <tr>
                            {tableHeads.map((item, index) => {
                                return (<th className={cx(
                                    {'border-l border-[var(--grayscale-10)]': index !== 0},
                                    'p-4'
                                )}>{item}</th>)
                            })}
                        </tr>
                        </thead>
                        <tbody className={''}>
                        {tableBody.map((item, index) => {
                            return (
                                item.subs.map((sItem, sIndex) => {
                                    const tableRowBg = index % 2 === 0 ? 'bg-[var(--grayscale-15)]' : 'bg-[var(--grayscale-20)]';
                                    return (
                                        <tr className={cx('', tableRowBg)}>
                                            {sIndex === 0 &&
                                                <td rowSpan={item.subs.length}
                                                    className={cx('p-4 text-[var(--state-error-main)]',
                                                        {'border-t border-[var(--grayscale-10)]': index !== 0}
                                                    )}>{item.amount}</td>}
                                            <td className={cx(
                                                'p-4 border-l border-t border-[var(--grayscale-10)]',
                                            )}>{sItem.brandName}</td>
                                            <td className={cx(
                                                'p-4 border-l border-t border-[var(--grayscale-10)] text-[var(--state-success-main)]',
                                            )}>{sItem.rewards}</td>
                                        </tr>
                                    )
                                })
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={'mt-4 flex justify-center'}>
                <ActivityRedeemableButton
                    text={'Receber'}
                    className={cx(
                        'px-[120px] py-3.5 rounded-xl text-[var(--white)] w-full',
                        'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]',
                        isRedeemable ? 'bg-[var(--primary-main)]' : 'bg-[var(--state-disable-variant)]',
                        isDesktop ? 'text-[20px]' : isTablet ? 'text-[16px]' : 'text-[14px]'
                    )}
                    disabled={!isRedeemable}
                    onClick={onClickRedeemable}
                />
            </section>

            <section className={'mt-4 mb-8'}>
                <div className={cx('w-full bg-[var(--white-20)] text-white text-start rounded-xl p-4',
                    isDesktop ? 'text-[20px]' : 'text-[14px]')}>
                    <p className={'font-bold'}>Nota especial:</p>
                    <TranslateStringToDOM htmlContext={description}/>
                </div>
            </section>


            {isMobile && <section className={'mb-20'}></section>}
            {isTablet && <section className={'mb-20'}></section>}
        </PageContainer>
    )

}