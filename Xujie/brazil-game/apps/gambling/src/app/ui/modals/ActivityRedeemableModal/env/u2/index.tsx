import cx from "classnames";
import styled from "styled-components";
import {IActivityRedeemableModal} from "../../index";
import React from "react";


const Container = styled.div`
  background-size: 100% 100%;
`;
export const ActivityRedeemableModal = (props: IActivityRedeemableModal) => {
    const {redeemableAmount, title, submitText, onClick, onCloseClick,} = props;
    return (
        <div
            className={"z-[1002] fixed left-0 top-0 right-0 bottom-0 flex flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"}
            onClick={() => {}}>
            <Container
                className={cx(
                    "relative",
                    "rounded-2xl",
                    "bg-[var(--grayscale-20)]",
                    "flex flex-col items-center",
                    "p-3",
                    "text-center text-white",
                    // NOTE:
                    "w-[90vw] max-w-[336px] h-auto"
                )}
            >
                <section className={''}>
                    <div className={"flex flex-row justify-end mb-2 absolute right-[10px] top-[10px]"}>
                        <div className={'cursor-pointer'}
                             onClick={onCloseClick}
                        >
                            <img
                                src="https://file.rendit.io/n/quh2LBV1P1lsK5SJUZ94.svg"
                                alt="XCircle"
                                id="XCircle"
                                className="w-10"
                            />
                        </div>
                    </div>
                </section>

                <section className={'mt-10 text-[18px] w-full px-10 text-[var(--grayscale-70)]'}>
                    <div>{title}</div>
                </section>

                <section className={'mt-3 text-[20px]'}>
                    <div>
                        {redeemableAmount}
                    </div>
                </section>
                <section className={'mt-8 text-[20px] w-full'}>
                    <button
                        className={cx(
                            'py-3.5 rounded-xl text-[var(--white)] w-full bg-[var(--primary-main)]',
                            'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]',
                        )}
                        onClick={onClick}
                    >{submitText}
                    </button>
                </section>
            </Container>
        </div>
    )
}