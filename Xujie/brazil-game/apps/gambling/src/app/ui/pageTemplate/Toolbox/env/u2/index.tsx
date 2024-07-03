
import React, {useEffect, useState} from "react";
import useBreakpoint from "../../../hooks/useBreakpoint";
import styled from "styled-components";

import {useDispatch, useSelector} from "react-redux";
import {appSlice} from "../../../../../reduxStore/appSlice";
import {TShowToolboxConfig} from "../../../base/types";
import {FixedToolStyle} from "../../FixedToolStyle";
import {ToolButton} from "../../ToolButton";
import {twMerge} from "tailwind-merge";
import {environment} from "../../../../../../environments/environment";
import {usePageNavigate} from "../../../../router/hooks/usePageNavigate";
import cx from "classnames";
import {ActivityBadge} from "../../../../components/Badge/ActivityBadge";

const FixedToolContainer = styled.div`
  width: 80px;
  border-radius: 11px 0 0 11px;
  overflow: hidden;
  z-index: 10;
  ${FixedToolStyle}
`

export type IToolbox = {
  showToolboxConfig?: TShowToolboxConfig;
  onClickToDownload: () => void;
  onClickToOpenTelegramService: () => void;
  onClickToOpenTelegramManager: () => void;
  className?: string;
}

export const Toolbox = (props: IToolbox) => {
  const { showToolboxConfig } = props;
  const mobileShowToolbox = showToolboxConfig === undefined || ( typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== false);
  const desktopShowToolbox = showToolboxConfig === undefined || ( typeof showToolboxConfig !== 'boolean' && showToolboxConfig.desktop !== false)

  // 預設關
  const mobileShowDownload = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.download === true;
  // 預設關
  const mobileShowCustomerService =  showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.customerService === true;
  // 活動大廳入口
  const mobileShowActivity = showToolboxConfig !== undefined && typeof showToolboxConfig !== 'boolean' && showToolboxConfig.mobile !== undefined && typeof showToolboxConfig.mobile !== 'boolean' && showToolboxConfig.mobile.activity === true;

  const desktopShowDownload = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !=='boolean' && showToolboxConfig.desktop.download !==false)))
  const desktopShowCustomerService = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !=='boolean' && showToolboxConfig.desktop.customerService !==false)))
  const desktopShowManage = showToolboxConfig === undefined || (typeof showToolboxConfig !== 'boolean' && (showToolboxConfig.desktop === undefined || (typeof showToolboxConfig.desktop !=='boolean' && showToolboxConfig.desktop.manager !==false)))

  const {isDesktop, isMobile} = useBreakpoint();
  const dispatch=useDispatch();
  const {onClickToActivity} = usePageNavigate();
  const [isShowActivity , setIsShowActivity] = useState<boolean>(false);


  useEffect(()=> {
    setIsShowActivity(mobileShowActivity);
  }, [mobileShowActivity])

  return (
    <>
      {
        !isDesktop && mobileShowToolbox && (mobileShowDownload || mobileShowCustomerService) && (
          <div className={twMerge(props.className)}>

            {isShowActivity && (
                <div className={"mb-2"}>
                  <ToolButton isMobile={!isDesktop} className='bg-[#FFFFFFA3] animate-bounce'>
                    <div className={'relative'}>
                      <img
                          alt={"activity"}
                          className={cx(
                              'cursor-pointer',
                              isMobile ? 'w-[54px]' : 'w-[64px]',
                          )}
                          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_activity_m.png`}
                          onClick={()=> {onClickToActivity();}}
                      />
                      <ActivityBadge  className={'absolute top-0 right-0 w-4 h-4 m-1'}/>
                    </div>
                    <img
                        alt={"activity_close"}
                        className='w-3.5 absolute top-0 right-0 cursor-pointer'
                        src={`assets/${environment.uVersion}/icon_flt_close.png`}
                        onClick={() => {
                          setIsShowActivity(false);
                        }}
                    />

                  </ToolButton>

                </div>
            )}

            {mobileShowDownload && (
              <div className={"mb-2"}>
                <ToolButton isMobile={!isDesktop} className='bg-[var(--primary-main)]' onClick={props.onClickToDownload}>
                  <img alt={"download"} className={twMerge("w-14", isMobile && "w-9")} src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download_m.png`}/>
                </ToolButton>
              </div>
            )}
            {
              mobileShowCustomerService && (
                <div>
                  <ToolButton isMobile={!isDesktop} className='fixed right-4 bg-[var(--secondary-main)]' onClick={() => {
                    dispatch(appSlice.actions.setShowTelegramDetailContactModal(true))
                  }}>
                    <img alt={"telegram"} className={twMerge("w-14", isMobile && "w-9")} src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_telegram_m.png`} />
                  </ToolButton>
                </div>
              )
            }
          </div>
        )
      }

      {
        isDesktop && desktopShowToolbox && (desktopShowDownload || desktopShowCustomerService || desktopShowManage) && (
          <div className={"fixed right-0 bottom-[300px] text-white flex flex-col z-20"}>

            {
              desktopShowDownload && (
                <FixedToolContainer className={"flex flex-col justify-center items-center px2 py-3 mb-4 bg-[var(--primary-main)]"}>
                  <div className={"text-xs font-light mb-2"}>Download</div>
                  <ToolButton
                    onClick={props.onClickToDownload}>
                    <img alt={"download"} className="w-[40px]" src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_download.png`}/>
                  </ToolButton>
                </FixedToolContainer>
              )
            }

            {
              (desktopShowCustomerService || desktopShowManage) && (
                <FixedToolContainer className={"flex flex-col justify-center items-center p-4 text-center bg-[var(--secondary-main)]"}>
                  <div className={"text-xs font-lights mb-2 whitespace-nowrap"}>Contate-nos</div>
                  {
                    desktopShowCustomerService && (
                      <div>
                        <ToolButton
                          className={"mb-1"}
                          onClick={()=>{
                            dispatch(appSlice.actions.setShowTelegramDetailContactModal(true))
                          }}
                        >
                          <img alt={"telegram"} className="w-[40px]" src={`assets/${environment.uVersion}/${environment.mVersion}/icon_flt_telegram.png`}/>
                        </ToolButton>
                      </div>
                    )
                  }

                  {/*{*/}
                  {/*  desktopShowManage && (*/}
                  {/*    <div className={""}>*/}
                  {/*      <ToolButton*/}
                  {/*        className={"mb-1"}*/}
                  {/*        onClick={props.onClickToOpenTelegramManager}*/}
                  {/*      >*/}
                  {/*        <img alt={"telegram"} className="w-[40px]" src={`assets/${environment.assetPrefix}/icon_flt_telegram.png`}/>*/}
                  {/*      </ToolButton>*/}
                  {/*      <div className={"text-xs font-lights"}>Gerente</div>*/}
                  {/*    </div>*/}
                  {/*  )*/}
                  {/*}*/}
                </FixedToolContainer>
              )
            }
          </div>
        )
      }
    </>
  )
}
