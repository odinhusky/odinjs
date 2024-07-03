import {ILossBenefitPage} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";
import {CacheImage} from "../../../../../components/image/CacheImage";
import cx from "classnames";
import {ActivityRecordButton} from "../../../HallPage/ActivityRecordButton";
import {ActivityRedeemableButton} from "../../../ActivityRedeemableButton";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import React, {useEffect} from "react";
import {TranslateStringToDOM} from "../../../TranslateStringToDOM";
import {environment} from "../../../../../../../environments/environment";
import {notification} from "antd";
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
            <section className={'flex flex-wrap justify-between items-center'}>
                <BackNavigation
                    onClick={() => {
                        navigate(PageOrModalPathEnum.ActivityHallPage);
                    }}
                />

                {isDesktop && <ActivityRecordButton
                    name={"REG DE COLETAS"}
                    className={cx(
                        'text-[var(--primary-main-to)] text-[16px] py-2 px-4 rounded-full font-bold',
                        'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
                    )}
                    onClick={() => {
                        onClickToActivity({category: ActivityPageRouter.RECORD})
                    }}
                />}
            </section>

            <section>
                {isMobile && <ActivityRecordButton
                    name={"REG DE COLETAS"}
                    className={cx(
                        'text-[var(--primary-main-to)] text-[16px] py-2 px-4 rounded-full font-bold w-full',
                        'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
                    )}
                    onClick={() => {
                        onClickToActivity({category: ActivityPageRouter.RECORD})
                    }}
                />}
            </section>

            <section className={cx(isMobile ? 'mt-4' : 'mt-6')}>
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
                            {'text-[2.5vw] px-[60px] w-2/3': isDesktop},
                            {'text-[5vw] px-[32px] w-3/4': isMobile},
                            'flex flex-wrap ',
                            'absolute transform -translate-y-1/2 top-1/2',
                            'justify-start'
                        )}
                    >
                        {bannerTitle.split(/\s+/).map(item =>
                            <ActivityTextContainer
                                children={item}
                                fontConfig={fontConfig}
                            />
                        )}
                    </div>
                </div>
            </section>

            <section className={cx(
                'items-center text-[var(--grayscale-100)]',
                {'text-center': isMobile},
                isMobile ? 'text-[14px]' : 'text-[18px]',
                isMobile ? 'mt-3 grid grid-rows-2 gap-2' : 'mt-7 flex flex-wrap justify-between gap-5',
            )}>
                <div
                    className={cx('border border-[var(--table-light)] bg-[var(--background-item)] gap-2 flex-1 items-center',
                        'flex flex-wrap justify-center',
                        isMobile ? 'rounded-full p-2' : 'rounded-xl p-4')}>
                    <div className={cx()}>Perdas de ontem</div>
                    <div className={cx('text-[var(--text-primary)]')}>{yesterdayLoss}</div>
                </div>
                {/*--table-light*/}
                <div
                    className={cx('border border-[var(--table-light)] bg-[var(--background-item)] gap-2 flex-1 items-center',
                        'flex flex-wrap justify-center',
                        isMobile ? 'rounded-full p-2' : 'rounded-xl p-4')}>
                    <div className={cx()}>Bônus de suporte de hoje</div>
                    <div className={cx('text-[var(--text-primary)]')}>{todayBonus}</div>
                </div>

            </section>

            <section className={cx(
                isMobile ? 'mt-3' : 'mt-7',
                isMobile ? 'text-[12px]' : 'text-[18px]')}>

                <div className={cx(
                    'overflow-x-auto text-white text-center rounded-xl',
                    {'border border-[var(--outline-table)]': isMobile}
                )}>
                    {isDesktop && <table className="w-full bg-[var(--table-main)]">
                        <thead className={cx('')}>
                        <tr>
                            {tableHeads.map((item, index) => {
                                return (<th className={cx(
                                    {'border-l border-[var(--table-light)]': index !== 0},
                                    'p-4'
                                )}>{item}</th>)
                            })}
                        </tr>
                        </thead>
                        <tbody className={''}>
                        {tableBody.map((item, index) => {
                            return (
                                item.subs.map((sItem, sIndex) => {
                                    return (
                                        <tr className={cx({'bg-[#006D79]' : index % 2 === 0})}>
                                            {sIndex === 0 &&
                                                <td rowSpan={item.subs.length}
                                                    className={cx('p-4 text-[var(--state-error-main)]',
                                                    )}>{item.amount}</td>}
                                            <td className={cx(
                                                'p-4 border-l border-[var(--table-light)]',
                                            )}>{sItem.brandName}</td>
                                            <td className={cx(
                                                'p-4 border-l border-[var(--table-light)] text-[var(--state-success-main)]',
                                            )}>{sItem.rewards}</td>
                                        </tr>
                                    )
                                })
                            )
                        })}
                        </tbody>
                    </table>}

                    {isMobile && <table className="w-full bg-[var(--table-main)] text-justify">
                        {tableBody.map((item, index) => {
                            return (
                                item.subs.map((sItem, sIndex) => {
                                    const borderClass = 'border-t border-[var(--outline-table)]';
                                    return (
                                        <tbody className={''}>

                                        {sIndex === 0 &&
                                            <tr className={cx({borderClass: index !== 0})}>
                                                <th className={cx('p-2')}>{tableHeads[0]}</th>
                                                <th className={cx('p-2 text-end')}>{item.amount}</th>
                                            </tr>
                                        }

                                        <tr className={cx('bg-[var(--table-varient)]', borderClass)}>
                                            <td className={cx('p-2')}>{tableHeads[1]}</td>
                                            <td className={cx('p-2 text-end')}>{sItem.brandName}</td>
                                        </tr>
                                        <tr className={cx('bg-[var(--table-varient)] ', borderClass)}>
                                            <td className={cx('p-2')}>{tableHeads[2]}</td>
                                            <td className={cx('p-2 text-end')}>{sItem.rewards}</td>
                                        </tr>
                                        </tbody>
                                    )
                                })
                            );
                        })}
                    </table>}

                </div>
            </section>

            {/*--outline-secondary*/}
            <section className={cx(isMobile ? 'mt-3' : 'mt-7')}>
                <div className={cx('w-full bg-[var(--background-instruction-80)] text-white text-start rounded-xl',
                    'border border-[var(--outline-secondary)]',
                    isMobile ? 'py-4 px-3' : 'p-5',
                    isMobile ? 'text-[14px]' : 'text-[16px]')}>
                    <p className={'font-bold mb-2'}>Nota especial:</p>
                    <TranslateStringToDOM htmlContext={description}/>
                </div>
            </section>

            <section className={cx(
                'flex justify-center',
                isMobile ? 'mt-3' : 'mt-7'
            )}>
                <ActivityRedeemableButton
                    text={'RECEBER'}
                    className={cx(
                        'rounded-full font-bold',
                        isRedeemable ? 'text-[var(--primary-main-to)]' : 'text-[var(--white)]',
                        isRedeemable ? 'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]' : 'bg-gradient-to-b from-[var(--button-disabled-from)] to-[var(--button-disabled-to)]',
                        isMobile ? 'text-[16px]' : 'text-[24px]',
                        isMobile ? 'w-full py-2' : 'px-[200px] py-5',
                    )}
                    disabled={!isRedeemable}
                    onClick={onClickRedeemable}
                />
            </section>
            <section className={'mb-20'}></section>
        </PageContainer>
    )

}