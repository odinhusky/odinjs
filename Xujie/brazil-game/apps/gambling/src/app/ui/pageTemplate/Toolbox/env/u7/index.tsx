import React, { useEffect, useState } from "react";
import useBreakpoint from "../../../hooks/useBreakpoint";

import { useDispatch } from "react-redux";
import { appSlice } from "../../../../../reduxStore/appSlice";
import { TShowToolboxConfig } from "../../../base/types";
import { environment } from "../../../../../../environments/environment";
import cx from "../../../../utils/cx";
import { CacheImage } from "../../../../components/image/CacheImage";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";


export type IToolbox = {
    showToolboxConfig?: TShowToolboxConfig;
    onClickToDownload: () => void;
    onClickToOpenTelegramService: () => void;
    onClickToOpenTelegramManager: () => void;
    className?: string;
}

/**
 * 悬浮按钮
 */
export const Toolbox = (props: IToolbox) => {
    const { showToolboxConfig } = props;
    const mobileShowToolbox = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== false);
    const desktopShowToolbox = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && showToolboxConfig.desktop !== false)
    // 預設關
    const mobileShowDownload = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.download === true;
    // 預設關
    const mobileShowCustomerService = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.customerService === true;
    // 活動大廳入口
    // const mobileShowActivity = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.activity === true;
    const mobileShowActivity = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.customerService === true;

    const desktopShowDownload = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !== 'boolean' && showToolboxConfig.desktop.download !== false)))
    // const desktopShowCustomerService = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !== 'boolean' && showToolboxConfig.desktop.customerService !== false)))
    const desktopShowActivity = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.desktop !== undefined && typeof showToolboxConfig.desktop !== 'boolean' && showToolboxConfig.desktop.customerService === true;
    const desktopShowManage = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !== 'boolean' && showToolboxConfig.desktop.manager !== false)))
    const { isDesktop, isTablet, isMobile } = useBreakpoint();
    const dispatch = useDispatch();
    const [isShowActivity, setIsShowActivity] = useState<boolean>(true);
    const [isShowDownload, setIsShowDownload] = useState<boolean>(true);
    const [isShowCustomerService, setIsShowCustomerService] = useState<boolean>(true);

    const { onClickToActivity } = usePageNavigate();

    // useEffect(() => {
    //     setIsShowActivity(mobileShowActivity);
    // }, [mobileShowActivity])

    // useEffect(() => {
    //     setIsShowDownload(mobileShowDownload);
    // }, [mobileShowDownload])

    // useEffect(() => {
    //     setIsShowCustomerService(mobileShowCustomerService);
    // }, [mobileShowCustomerService])

    return (
        <>
            {/* 手機 & 平板，顯示 浮動按鈕*/}
            {!isDesktop && mobileShowToolbox && (mobileShowDownload || mobileShowActivity) && (/** */

                <div className={cx(
                    'z-20 grid grid-cols-1 gap-2 justify-stretch',
                    isMobile ? 'w-[64px] text-[10px]' : 'w-[96px] text-xs'
                )}
                >
                    {(mobileShowActivity && isShowActivity) && (
                        <div className={'w-full h-auto items-center flex relative z-10 '}>
                            <button
                                className={'w-full'}
                                onClick={() => { onClickToActivity();}}>
                                {/* {isTablet && */}
                                    <CacheImage
                                        alt={'Activity'}
                                        className={'w-full'}
                                        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_eventos${isDesktop || isTablet ? '_t' : '_m'}.png`}
                                    />
                                {/* } */}
                                {/* <div className={''}>{'Eventos'}</div> */}
                                <button
                                    className={cx(
                                        'absolute top-0 right-0 cursor-pointer',
                                        isMobile ? 'w-4 h-4' : 'w-5 h-5'
                                    )}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsShowActivity(false);
                                    }}
                                />
                            </button>

                            {/* <img
                                alt={"download_close"}
                                className={cx(
                                    'opacity-70 absolute top-0 right-0 cursor-pointer',
                                    'active:brightness-75 hover:brightness-125',
                                    isMobile ? 'w-3' : 'w-4'
                                )}
                                src={`assets/${environment.uVersion}/ic_closed.png`}
                                onClick={() => {
                                    setIsShowDownload(false);
                                }}
                            /> */}
                        </div>
                    )}
                    {/* {isShowCustomerService && (
                        <div className={'items-center flex relative z-10'}>
                            <img alt={'flt_telegram'}
                                className={'object-scale-down'}
                                src={`assets/${environment.uVersion}/icon_flt_telegram.png`} />
                            <button
                                className={'linear-1-button w-full absolute bottom-0 py-1 flex flex-row justify-center gap-1'}
                                onClick={() => {
                                    dispatch(appSlice.actions.setShowTelegramDetailContactModal(true));
                                }}>
                                {isTablet &&
                                    <CacheImage
                                        alt={'telegram'}
                                        className={'w-4'}
                                        src={`assets/${environment.uVersion}/icon_telegram.png`}
                                    />
                                }
                                <div className={''}>{'Contate-nos'}</div>
                            </button>
                            <img
                                alt={"customer_service_close"}
                                className={cx(
                                    'opacity-70 absolute top-0 right-0 cursor-pointer',
                                    'active:brightness-75 hover:brightness-125',
                                    isMobile ? 'w-3' : 'w-4'
                                )}
                                src={`assets/${environment.uVersion}/ic_closed.png`}
                                onClick={() => {
                                    setIsShowCustomerService(false);
                                }}
                            />
                        </div>
                    )} */}
                    {isShowDownload && (
                        <div className={'w-full h-auto items-center flex relative z-10 '}>
                            <button
                                className={'w-full'}
                                onClick={props.onClickToDownload}
                            >
                                {/* {isTablet && */}
                                    <CacheImage
                                        alt={'download'}
                                        className={'w-full'}
                                        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download${isDesktop || isTablet ? '_t' : '_m'}.png`}
                                    />
                                {/* } */}
                                <button
                                    className={cx(
                                        'absolute top-0 right-0 cursor-pointer',
                                        isMobile ? 'w-4 h-4' : 'w-5 h-5'
                                    )}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsShowDownload(false);
                                    }}
                                />
                            </button>
                        </div>
                    )
                    }
                </div>
            )}

            {/* PC 顯示 浮動按鈕*/}
            {isDesktop && desktopShowToolbox && (desktopShowDownload || desktopShowActivity || desktopShowManage) && (
                <div className={'z-20 w-[96px] grid grid-cols-1 gap-5 justify-stretch'}>
                    {/* {desktopShowToolbox && isShowActivity && ( */}
                    {((desktopShowActivity || desktopShowManage) && isShowActivity) && (
                        <div className={'w-full h-auto items-center flex relative z-10'}>
                            {/* <img alt={'flt_download'}
                                className={'object-scale-down'}
                                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download.gif`} /> */}
                            <button
                                className={'w-full'}
                                onClick={() => { onClickToActivity(); }}>
                                <CacheImage
                                    alt={'Activity'}
                                    className={'w-full'}
                                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_eventos.png`}
                                />
                                {/* <div className={''}>{'Eventos'}</div> */}
                                <button
                                    className={cx(
                                        'absolute top-0 right-0 cursor-pointer',
                                        'w-5 h-5'
                                    )}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsShowActivity(false);
                                    }}
                                />
                            </button>
                        </div>
                    )}
                    {/* {desktopShowDownload && isShowDownload && ( */}
                    {(desktopShowDownload && isShowDownload)&& (
                        <div className={'w-full h-auto items-center flex relative z-10'}>
                            {/* <img alt={'flt_download'}
                                className={'object-scale-down'}
                                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download.gif`} /> */}
                            <button
                                className={'w-full'}
                                onClick={props.onClickToDownload}
                            >
                                <CacheImage
                                    alt={'download'}
                                    className={'w-full'}
                                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download.png`}
                                />
                                {/* <div className={''}>{'Eventos'}</div> */}
                                <button
                                    className={cx(
                                        'absolute top-0 right-0 cursor-pointer',
                                        'w-5 h-5'
                                    )}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsShowDownload(false);
                                    }}
                                />
                            </button>
                        </div>
                    )}
                    {/* {(desktopShowCustomerService || desktopShowManage) && (
                        <div className={'items-center flex relative z-10'}>
                            <img alt={'flt_telegram'}
                                className={'object-scale-down'}
                                src={`assets/${environment.uVersion}/icon_flt_telegram.png`} />
                            <button
                                className={'linear-1-button absolute bottom-0 w-full py-1 flex flex-row justify-center gap-1'}
                                onClick={() => {
                                    dispatch(appSlice.actions.setShowTelegramDetailContactModal(true));
                                }}>
                                <CacheImage
                                    alt={'telegram'}
                                    className={'w-4'}
                                    src={`assets/${environment.uVersion}/icon_telegram.png`}
                                />
                                <div className={''}>{'Contate-nos'}</div>
                            </button>

                        </div>
                    )} */}
                </div>
            )}
        </>
    )
}
