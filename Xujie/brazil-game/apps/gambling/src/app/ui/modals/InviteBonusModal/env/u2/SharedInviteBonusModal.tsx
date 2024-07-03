import {IInitialChargeModal} from "../../index";
import React from "react";
import {MoneyButton} from "../u1/MoneyButton";
import {useInviteConfig} from "../../../../hooks/useInviteConfig";
import cx from "classnames";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import useAnimation from "../../../../hooks/useAnimation";

type IItem = {
    title: string;
    money: number;
}
const Item = (props: IItem) => {
    return (
        <div
            className="bg-[rgba(255,255,255,0.2)] border-solid border-white/20 shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] flex flex-row justify-between w-full h-16 items-start pt-2 px-2 rounded-lg">
            <div className="flex flex-col w-2/5 items-start">
                <div className="font-bold leading-[24px] text-white">
                    {props.title}
                </div>
                <div className="text-sm font-medium leading-[20px] text-white">
                    Prêmio
                </div>
            </div>
            <div className="text-right font-bold leading-[24px] text-white mt-2">
                <MoneyButton money={props.money}/>
            </div>
        </div>
    )
}
export const SharedInviteBonusModal = (props: IInitialChargeModal) => {
    const {currentConfig} = useInviteConfig();
    const currentConfigItems = currentConfig ? currentConfig?.items : []
    const {isMobile, isTablet, isDesktop} = useBreakpoint();

    const handleClose = () => {
        setIsCloseAnimation(true)
    }
    const [isCloseAnimation, setIsCloseAnimation] = useAnimation(props.close);

    return (
        <div
            className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)] px-4"}
            onClick={(event) => {
                // props.close();
            }}
        >
            <div
                id="Alert1"
                className={cx(
                    'bg-[linear-gradient(145deg,var(--liner-main-from)_-7%,var(--liner-main-to)_109%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col gap-2 items-center rounded-lg',
                    'w-full mx-4 max-w-[336px] max-h-[85vh] animate__animated animate__faster animate__backInDown',
                    isCloseAnimation ? 'animate__bounceOut' : ''
                )}
            >
                <section className={'w-full relative'}>
                    <div className="flex flex-col w-full items-center mt-[-38px]">
                        <img
                            src="https://file.rendit.io/n/BNH9SwsC8CxPBeTY9hIF.png"
                            alt="Image1"
                            id="Image1"
                            className="w-24"
                        />
                        <img
                            src="https://file.rendit.io/n/g0h2r60bWpPVXrQuhBYs.png"
                            alt="Image2"
                            id="Image2"
                        />
                    </div>

                    <div className={'absolute top-0 right-0 p-3 cursor-pointer'}>
                        <img
                            src="https://file.rendit.io/n/quh2LBV1P1lsK5SJUZ94.svg"
                            alt="XCircle"
                            id="XCircle"
                            className="w-10"
                            onClick={() => handleClose()}
                        />
                    </div>
                    
                </section>

                <section>
                    <div className="text-center font-medium leading-[24px] text-white h-12 px-6">
                        Bônus de primeira recarga para usuários convidados
                    </div>
                </section>

                <section className={'w-full px-6 mb-4'}>
                    <div className={cx('w-full max-h-[48vh] overflow-auto')}>
                        {currentConfigItems?.map((item, index) => {
                            if (currentConfigItems.length - 1 !== index) {
                                // NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
                                return (
                                    <Item key={index}
                                          title={`Convidar ${item.num}-${Number(currentConfigItems[index + 1]?.num) - 1}`}
                                          money={(Number(item.reward) / 100)}/>
                                )
                            } else {
                                return (
                                    <Item key={index} title={`Convidar > ${item.num}`}
                                          money={Number(item.reward) / 100}/>
                                )
                            }
                        })}

                        {(isMobile || isTablet) && <div className="flex flex-row gap-3 items-start w-full my-3">
                            <button
                                id="Btn"
                                className="text-sm font-medium leading-[20px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)] flex flex-row justify-center pt-2 w-1/2 h-10 cursor-pointer items-start rounded-lg"
                                onClick={() => handleClose()}
                            >
                                Ganhar Dinheiro
                            </button>
                            <button
                                id="Btn1"
                                className="text-sm font-medium leading-[20px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--primary-main)] flex flex-row justify-center pt-2 w-1/2 h-10 cursor-pointer items-start rounded-lg"
                                onClick={() => {
                                    props.onConfirm();
                                }}
                            >
                                Convide Agora
                            </button>
                        </div>}
                    </div>
                </section>

                {isDesktop && <section className={'w-full px-6 mb-4'}>
                    <div className="flex flex-row gap-3 items-start w-full">
                        <button
                            id="Btn"
                            className="text-sm font-medium leading-[20px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)] flex flex-row justify-center pt-2 w-1/2 h-10 cursor-pointer items-start rounded-lg"
                            onClick={() => handleClose()}
                        >
                            Ganhar Dinheiro
                        </button>
                        <button
                            id="Btn1"
                            className="text-sm font-medium leading-[20px] text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--primary-main)] flex flex-row justify-center pt-2 w-1/2 h-10 cursor-pointer items-start rounded-lg"
                            onClick={() => {
                                props.onConfirm();
                            }}
                        >
                            Convide Agora
                        </button>
                    </div>
                </section>}
            </div>
        </div>
    )
}
