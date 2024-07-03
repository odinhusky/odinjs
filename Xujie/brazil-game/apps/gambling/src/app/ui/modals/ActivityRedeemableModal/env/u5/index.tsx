import cx from "classnames";
import styled from "styled-components";
import {IActivityRedeemableModal} from "../../index";
import React from "react";
import {environment} from "../../../../../../environments/environment";
import {CacheImage} from "../../../../components/image/CacheImage";


const Container = styled.div`
  background-size: 100% 100%;
`;
export const ActivityRedeemableModal = (props: IActivityRedeemableModal) => {
    const {redeemableAmount, title, submitText, onClick, onCloseClick,} = props;
    return (
        <div
            className={"z-[1002] fixed left-0 top-0 right-0 bottom-0 flex flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"}
            onClick={() => {}}>

            <div className={"relative"}>
                <Container
                    className={cx(
                        "rounded-2xl",
                        "bg-linear-5-main",
                        "flex flex-col items-center",
                        "p-8",
                        "text-center text-white",
                        // NOTE:
                        "w-[90vw] max-w-[336px] h-auto"
                    )}
                >
                    <section className={'text-sm w-full px-10 font-bold text-[var(--grayscale-100)]'}>
                        <div>{title}</div>
                    </section>

                    <section className={'mt-4 text-base font-bold'}>
                        <div>
                            {redeemableAmount}
                        </div>
                    </section>

                    <section className={'mt-4 text-sm font-extrabold w-full'}>
                        <button
                            className={cx(
                                'state-info-button  rounded-full text-[var(--grayscale-100)] w-full py-2.5',
                            )}
                            onClick={onClick}
                        >
                            <div className={'drop-shadow-lg'}>{submitText}</div>
                        </button>
                    </section>
                </Container>

                <div className={'cursor-pointer justify-end absolute right-[-10px] top-[-10px]'}>
                    <div
                        className={cx( 'linear-5-button','rounded-full w-10 h-10 flex justify-center items-center cursor-pointer')}
                           
                        onClick={onCloseClick}
                    >
                        <CacheImage
                            alt={'close'}
                            className={'w-6 h-6'}
                            src={`assets/${environment.uVersion}/icon_close.png`}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}