import {IDailyCashbackPage} from "../../index";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import cx from "classnames";
import {ActivityRecordButton} from "../../../HallPage/ActivityRecordButton";
import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";
import {CacheImage} from "../../../../../components/image/CacheImage";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import React, {useEffect} from "react";
import {TranslateStringToDOM} from "../../../TranslateStringToDOM";
import {environment} from "../../../../../../../environments/environment";
import {notification} from "antd";
import {ActivityPageRouter} from "../../../index";


type BoxContainer = {
    children: React.ReactNode;
}
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
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (redeemState) {
            api.info({
                message: (<div className={'text-[var(--grayscale-100)]'}>{redeemState.message}</div>),
                className: cx(
                    'rounded-md bg-[var(--grayscale-20)] border',
                    redeemState.isError
                        ? 'border-[var(--state-error-main)]'
                        : 'border-[var(--state-success-main)]',
                ),
                icon: (
                    <CacheImage
                        className={cx('anticon anticon-check-circle w-8 -mr-1')}
                        alt={'icon_success'}
                        src={redeemState.isError ?
                            `assets/${environment.uVersion}/icon_error_full.png`
                            : `assets/${environment.uVersion}/icon_success_full.png`
                        }
                    />
                ),
                closeIcon: (
                    <CacheImage
                        className={cx('anticon-close anticon w-4 mt-1 hover:brightness-[1.3] active:brightness-[0.7]')}
                        alt={'icon_close'}
                        src={`assets/${environment.uVersion}/icon_close_empty.png`}
                    />
                )
            })
            if (onRefreshDalyCashback) {
                onRefreshDalyCashback();
            }
        }
    }, [redeemState])


    const BoxContainer = (props: BoxContainer) => {
        return (
            <div className={cx(
                'rounded-lg bg-[var(--grayscale-20)]',
                {'p-8': isDesktop},
                {'p-5': isTablet},
                {'p-4': isMobile}
            )}>
                {props.children}
            </div>
        )
    }

    return (
        <PageContainer>
            {contextHolder}
            <BackNavigation
                onClick={() => {
                    navigate(PageOrModalPathEnum.ActivityHallPage);
                }}
            />

            <section className={cx(
                {'mt-5': isDesktop},
                {'mt-1': isTablet},
                {'mt-0': isMobile},
            )}>
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
                            {'text-[48px] px-[60px] w-2/3': isDesktop},
                            {'text-[30px] px-[48px] w-2/3': isTablet},
                            {'text-[16px] px-[32px] w-4/5': isMobile},
                            'flex flex-wrap font-extrabold',
                            'absolute transform -translate-y-1/2 top-1/2',
                            'justify-start'
                        )}>

                        {bannerTitle.split(/\s+/).map(item =>
                            <ActivityTextContainer
                                children={item}
                                fontConfig={fontConfig}
                            />
                        )}
                    </div>
                </div>
            </section>


            <section className={cx('mt-4',
                isDesktop ? 'text-[18px]' : isTablet ? 'text-[14px]' : 'text-[12px]')}>
                <BoxContainer>

                    {/*活動記錄按鈕*/}
                    <div className={cx(
                        'flex flex-wrap items-center justify-end',
                        {'justify-center': isMobile}
                    )}>
                        <ActivityRecordButton
                            name={"Reg de Coletas"}
                            className={cx(
                                'linear-2-button',
                                'font-extrabold',
                                {'text-sm py-2 px-[50px]': isMobile}
                            )}
                            onClick={() => {
                                onClickToActivity({category: ActivityPageRouter.RECORD})
                            }}
                        />
                    </div>

                    {/*當前活動累積*/}
                    <div
                        className={cx(
                            'flex flex-wrap justify-between items-center mt-4 text-[var(--grayscale-100)] mt-4 p-4',
                            'rounded-lg bg-[var(--grayscale-30)]',
                            'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.40),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.40)]',
                            'text-center',
                            {'text-lg': isDesktop},
                            {'text-base': isTablet},
                            {'text-sm': isMobile},
                        )}>
                        <div
                            className={cx('flex flex-wrap justify-center gap-2 flex-1 items-center border-r-[1px] border-[var(--transparente-50)] px-2')}>
                            <div className={cx('w-full')}>Apostas de ontem</div>
                            <div
                                className={cx('w-full text-[var(--state-error-main)]')}>{yesterdayBets}</div>
                        </div>

                        <div
                            className={cx('flex flex-wrap justify-center gap-2 flex-1 items-center px-2')}>
                            <div className={cx('w-full ')}>Bônus de suporte de hoje</div>
                            <div
                                className={cx('w-full text-[var(--state-success-main)]',)}>{todayBonus}</div>
                        </div>
                    </div>

                    {/*活動獎勵里程描述*/}
                    <div className="overflow-x-auto text-[var(--grayscale-100)] text-center rounded-xl mt-4">
                        <table className="w-full">
                            <thead
                                className={cx('bg-linear-2-disabled')}>
                            <tr>
                                {tableHeads.map((item, index) => {
                                    return (<th className={cx('p-4')}>{item}</th>)
                                })}
                            </tr>
                            </thead>
                            <tbody className={''}>
                            {tableBody.map((item, index) => {
                                return (
                                    item.subs.map((sItem, sIndex) => {
                                        const tableRowBg = index % 2 === 0 ? 'bg-[var(--grayscale-15)]' : 'bg-[var(--grayscale-10)]';
                                        return (
                                            <tr className={cx('', tableRowBg)}>
                                                {sIndex === 0 &&
                                                    <td rowSpan={item.subs.length}
                                                        className={cx('p-4',
                                                        )}>
                                                        {item.amount}
                                                    </td>
                                                }
                                                <td className={cx(
                                                    'p-4',
                                                )}>{sItem.brandName}</td>
                                                <td className={cx(
                                                    'p-4',
                                                )}>{sItem.rewards}</td>
                                            </tr>
                                        )
                                    })
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/*liner/5/light(hover)*/}
                    <div className={'flex justify-center'}>
                        <button
                            className={cx(
                                ' rounded-full text-white font-extrabold',
                                {'px-[200px] py-3 text-base mt-8': isDesktop},
                                {'px-[130px] py-2.5 text-sm mt-5': isTablet},
                                {'px-[73px] py-2.5 text-sm mt-4': isMobile},
                                isRedeemable
                                    ? cx(
                                        'linear-2-button'
                                    )
                                    : 'bg-linear-2-disabled',
                            )}
                            disabled={!isRedeemable}
                            onClick={onClickRedeemable}
                        >
                            <div className={'drop-shadow-lg'}>{'Receber'}</div>
                        </button>
                    </div>
                </BoxContainer>

            </section>


            <section className={'mt-4 mb-8'}>
                <BoxContainer>
                    <div
                        className={cx('w-full bg-[var(--grayscale-10)] text-[var(--grayscale-80)] text-start rounded-xl',
                            {'px-5 py-4 text-base': isDesktop},
                            {'px-5 py-4 text-base': isTablet},
                            {'p-4 text-sm': isMobile}
                        )}>
                        <p className={'font-extrabold text-white'}>Nota especial:</p>
                        <TranslateStringToDOM htmlContext={description}/>
                    </div>
                </BoxContainer>
            </section>

        </PageContainer>
    )
}