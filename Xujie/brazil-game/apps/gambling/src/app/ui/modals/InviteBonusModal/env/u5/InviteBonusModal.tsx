import {IInitialChargeModal} from "../../index";
import React from "react";
import {useInviteConfig} from "../../../../hooks/useInviteConfig";
import cx from "classnames";
import {environment} from "../../../../../../environments/environment";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";


type IItem = {
    title: string;
    money: number;
    className: string;
}
const Item = (props: IItem) => {
    return (

        <div
            className={cx(
                'flex flex-row justify-between',
                'bg-linear-4-dark-active',
                'shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.10)',
                'w-full items-start rounded-lg',
                'text-base font-bold',
                'mb-3 p-3',
                props.className
            )}>
            <div className="text-left">
                {props.title}
            </div>
            <div className="text-right">
                {`R$ ${props.money}`}
            </div>
        </div>
    )
}


type IInviteBonusButton = {
    className?: string;
    click: () => void;
    name: string;
}
const InviteBonusButton = (props: IInviteBonusButton) => {
    return (
        <button
            className={cx(
                'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
                'text-base font-extrabold flex justify-center rounded-full',
                props.className
            )}
            onClick={() => {
                props.click();
            }}
        >
            {props.name}
        </button>
    )
}

export const InviteBonusModal = (props: IInitialChargeModal) => {
    const {currentConfig} = useInviteConfig();
    const currentConfigItems = currentConfig ? currentConfig?.items : []
    const {isDesktop} = useBreakpoint();

    const textSize = isDesktop ? 'text-base' : 'text-sm'
    return (
        <div
            className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex flex-col flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)] px-4"}
            onClick={() => {
                // props.close();
            }}>

            <div
                id="Alert1"
                className={cx(
                    'relative bg-linear-4-main flex flex-col gap-2 items-center rounded-lg',
                    'text-[var(--grayscale-100)]',
                    'w-full mx-4  max-h-[85vh]',
                    isDesktop ? 'max-w-[424px]' : 'max-w-[360px]'
                )}>

                <button
                    className={cx(
                        'linear-4-button',
                        'absolute -right-2.5 -top-2.5 w-10 h-10 rounded-full flex justify-center items-center',
                    )}
                    onClick={()=> {
                        props.close();
                    }}>

                    <img
                        className="w-6 h-6"
                        src={`assets/${environment.uVersion}/icon_close.png`}
                        alt="close"
                    />
                </button>

                <div className={'w-full'}>
                    <img
                        src={`assets/${environment.uVersion}/icon_invite_bonus_mobile.png`}
                        alt="invite_bonus_mobile"
                    />
                </div>

                <div
                    style={{
                        scrollbarWidth: 'none'
                    }}
                    className={cx(
                        'text-center font-bold overflow-auto px-4',
                        textSize)}>

                    <p className={cx('font-extrabold px-2',
                        isDesktop ? 'text-xl' : textSize,
                    )}>
                        Convite de recompensa
                    </p>

                    <p className={cx(
                        'px-2',
                        isDesktop ? textSize : 'text-sm'
                    )}>
                        Bônus de primeira recarga para usuários convidados
                    </p>

                    <div className={cx('w-full max-h-[48vh] gap-3 mt-3')}>
                        {currentConfigItems.map((item, index) => {
                            if (currentConfigItems.length - 1 !== index) {
                                // NOTICE: 型別遺失 這個沒有寫 number 沒有被檢測到要number, money={Number(item.reward)}
                                return (
                                    <Item
                                        className={textSize}
                                        key={index}
                                        title={`Convidar ${item.num}-${Number(currentConfigItems[index + 1]?.num) - 1}`}
                                        money={(Number(item.reward) / 100)}/>
                                )
                            } else {
                                return (
                                    <Item
                                        className={textSize}
                                        key={index} title={`Convidar > ${item.num}`}
                                        money={Number(item.reward) / 100}/>
                                )
                            }
                        })}
                    </div>
                </div>

                <div className={'w-full flex flex-row gap-3 justify-between px-3 mb-4'}>
                    <InviteBonusButton
                        className={cx(
                            'state-info-button flex-1 py-3',
                            textSize)}
                        name={'Ganhar Dinheiro'}
                        click={() => {
                            props.close();
                        }}
                    />
                    <InviteBonusButton
                        className={cx(
                            'state-info-button flex-1 py-3',
                            textSize)}
                        name={'Convide Agora'}
                        click={() => {
                            props.onConfirm();
                        }}
                    />
                </div>
            </div>
        </div>
    )

}
