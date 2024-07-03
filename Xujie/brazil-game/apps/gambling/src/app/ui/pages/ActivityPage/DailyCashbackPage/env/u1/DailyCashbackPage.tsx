import {IDailyCashbackPage} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import cx from "classnames";
import {ActivityRecordButton} from "../../../HallPage/ActivityRecordButton";
import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {ActivityRedeemableButton} from "../../../ActivityRedeemableButton";
import React, {useEffect} from "react";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import {TranslateStringToDOM} from "../../../TranslateStringToDOM";
import {notification} from "antd";
import {environment} from "../../../../../../../environments/environment";
import {ActivityPageRouter} from "../../../index";


export const DailyCashbackPage = (props: IDailyCashbackPage) => {
    const {
        dalyCashbackData,
        redeemState,
        onRefreshDalyCashback,
        internalBannerRes,
        navigate,
        onClickToActivity,
        onClickRedeemable,
        isMobile,
        isTablet,
        isDesktop,
        fontConfig
    } = props;
    const {bannerTitle, yesterdayBets, todayBonus, tableHeads, tableBody, description, isRedeemable} = dalyCashbackData;
    const activityDailyCashbackTitle = "Bônus de apostas diário";
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

            if (onRefreshDalyCashback) {
                onRefreshDalyCashback();
            }
        }
    }, [redeemState])
    return (
        <PageContainer>
            {contextHolder}
            <BackNavigation
                title={isMobile &&
                    <div className={"w-full text-center font-bold"}>{activityDailyCashbackTitle}</div>}
                onClick={() => {
                    navigate(PageOrModalPathEnum.ActivityHallPage);
                }}
            />
            <section className={'mt-4'}>
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
                            {'text-[3vw] px-[60px] w-1/2': isDesktop},
                            {'text-[5vw] px-[32px] w-2/3': isMobile},
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

            <section className={'flex flex-wrap justify-between items-center mt-4'}>
                {isDesktop && (
                    <div className={cx('text-start items-center text-4xl font-bold text-[var(--white)]')}>
                        {activityDailyCashbackTitle}
                    </div>
                )}

                <ActivityRecordButton
                    name={"Reg de Coletas"}
                    className={cx(
                        'text-white py-2 px-4 rounded-lg font-lg text-[18px]',
                        'bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]',
                        {'w-full': isMobile}
                    )}
                    onClick={() => {
                        onClickToActivity({category: ActivityPageRouter.RECORD})
                    }}
                />
            </section>

            <section className={'mt-4 text-[16px]'}>
                <div className="overflow-x-auto text-white text-center rounded-xl">
                    {isDesktop && (
                        <table className="table table-zebra w-full">
                            <caption
                                style={{
                                    captionSide: "top"
                                }}
                                className={cx('bg-[var(--white-20)] text-white')}>
                                <div className={cx(
                                    'flex flex-wrap w-full justify-center',
                                    {'gap-8 p-4 ': isDesktop},
                                    {'gap-2 p-2 ': isMobile}
                                )}>
                                    <div>Apostas de ontem
                                        <span className={'text-[var(--state-success-main)] m-2'}>
                                        {yesterdayBets}
                                    </span>
                                    </div>
                                    <div>Bônus de suporte de hoje
                                        <span className={'text-[var(--state-info-main)] m-2'}>
                                        {todayBonus}
                                    </span>
                                    </div>
                                </div>
                            </caption>

                            <thead>
                            <tr>
                                {tableHeads.map((item, index) => {
                                    return (<th className={cx(
                                        {'border-l border-[rgba(255,255,255,0.2)]': index !== 0},
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
                                            <tr className={cx()}>
                                                {sIndex === 0 &&
                                                    <td rowSpan={item.subs.length}
                                                        className={cx('p-4',
                                                            {'border-t border-[rgba(255,255,255,0.2)]': index !== 0}
                                                        )}>{item.amount}</td>}
                                                <td className={cx(
                                                    'p-4 border-l border-[rgba(255,255,255,0.2)]',
                                                    {'border-t': index !== 0}
                                                )}>{sItem.brandName}</td>
                                                <td className={cx(
                                                    'p-4 border-l border-[rgba(255,255,255,0.2)] text-[var(--secondary-assistant)]',
                                                    {'border-t': index !== 0}
                                                )}>{sItem.rewards}</td>
                                            </tr>
                                        )
                                    })
                                )
                            })}
                            </tbody>
                        </table>
                    )}

                    {isMobile && (
                        <table className="table table-zebra w-full">
                            <caption
                                style={{
                                    captionSide: "top"
                                }}
                                className={cx('bg-[var(--white-20)] text-white')}>
                                <div className={cx(
                                    'flex flex-wrap w-full justify-center',
                                    {'gap-8 p-4 ': isDesktop},
                                    {'gap-2 p-2 ': isMobile}
                                )}>
                                    <div>Apostas de ontem
                                        <span className={'text-[var(--state-success-main)] m-2'}>
                                        {yesterdayBets}
                                    </span>
                                    </div>
                                    <div>Bônus de suporte de hoje
                                        <span className={'text-[var(--state-info-main)] m-2'}>
                                        {todayBonus}
                                    </span>
                                    </div>
                                </div>
                            </caption>

                            {tableBody.map((item) => {
                                return (
                                    item.subs.map((sItem, sIndex) => {
                                        return (
                                            <tbody className={''}>

                                            {sIndex === 0 &&
                                                <tr className={cx('')}>
                                                    <th className={cx('p-4 border-r border-[rgba(255,255,255,0.2)]')}>{tableHeads[0]}</th>
                                                    <th className={cx('p-4')}>{item.amount}</th>
                                                </tr>
                                            }

                                            <tr className={cx()}>
                                                <td className={cx('p-4 border-r border-[rgba(255,255,255,0.2)]')}>{tableHeads[1]}</td>
                                                <td className={cx('p-4')}>{sItem.brandName}</td>
                                            </tr>
                                            <tr className={cx()}>
                                                <td className={cx('p-4 border-r border-[rgba(255,255,255,0.2)]')}>{tableHeads[2]}</td>
                                                <td className={cx('p-4 text-[var(--secondary-assistant)]')}>{sItem.rewards}</td>
                                            </tr>
                                            </tbody>
                                        )
                                    })
                                );
                            })
                            }
                        </table>
                    )}
                </div>
            </section>

            <section className={'mt-4'}>
                <div className={cx('w-full bg-[var(--white-20)] text-white text-start rounded-xl p-4',
                    isMobile ? 'text-[14px]' : 'text-[16px]')}>
                    <p>Nota especial:</p>
                    <TranslateStringToDOM htmlContext={description}/>
                </div>
            </section>

            <section className={'mt-4 mb-8 flex justify-center'}>
                <ActivityRedeemableButton
                    text={'Receber'}
                    className={cx(
                        'px-[120px] py-3.5 rounded-xl text-[var(--white)] text-[18px]',
                        isRedeemable ? 'bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]' : 'bg-[var(--state-disable-variant)]'
                    )}
                    disabled={!isRedeemable}
                    onClick={onClickRedeemable}
                />
            </section>

            {isMobile && <section className={'mb-20'}></section>}
            {isTablet && <section className={'mb-20'}></section>}
        </PageContainer>
    )
}