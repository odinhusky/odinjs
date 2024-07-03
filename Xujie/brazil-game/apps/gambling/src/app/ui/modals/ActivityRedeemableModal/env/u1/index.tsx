import cx from "classnames";
import styled from "styled-components";
import {CloseICON} from "../../../../components-bs/Icons/CloseICON";
import {IActivityRedeemableModal} from "../../index";


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
                    "rounded-2xl border-solid border-[1px] border-[var(--primary-assistant)]",
                    "bg-gradient-to-b from-[var(--background-modal-from)] to-[var(--background-modal-to)]",
                    "flex flex-col items-center",
                    "p-4",
                    "text-center text-white",
                    // NOTE:
                    "w-[90vw] max-w-[336px] h-auto"
                )}
            >
                <div className={"flex flex-row justify-end mb-2 absolute right-[10px] top-[10px]"}>
                    <div className={'cursor-pointer'}
                        onClick={onCloseClick}
                    >
                        <CloseICON/>
                    </div>
                </div>

                <section className={'mt-2 text-[20px] w-full px-10'}>
                    <div>{title}</div>
                </section>

                <section className={'mt-3 text-[24px]'}>
                    <div>
                        {redeemableAmount}
                    </div>
                </section>
                <section className={'mt-8 mb-4 text-[18px] w-full px-10'}>
                    <button
                        className={cx(
                            'rounded-[8px] py-3 w-full',
                            'bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)]',)}
                        onClick={onClick}
                    >{submitText}
                    </button>
                </section>
            </Container>
        </div>
    )
}