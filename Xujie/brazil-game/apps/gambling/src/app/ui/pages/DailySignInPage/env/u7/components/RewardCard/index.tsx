import {environment} from "../../../../../../../../environments/environment";
import cx from "../../../../../../utils/cx";
import {formatLocaleMoney} from "../../../../../../utils/format";
import {forwardRef} from "react";
import {RedemptionStates} from "../../index";

interface RewardCardProps {
    state: RedemptionStates;
    day: number;
    cashback: number;
    onClickToSignIn: () => void;
}

const strokeClassNames = {
    ['ALREADY_REDEEMED']: 'border-vip-get-button',
    ['NON_REDEEMABLE']: 'border-vip-button',
    ['REDEEMABLE']: 'border-line-button before:rounded-lg before:border-1'
};

const bgClassNames = {
    ['ALREADY_REDEEMED']: 'bg-linear-1-disabled',
    ['NON_REDEEMABLE']: 'bg-game-bar',
    ['REDEEMABLE']: 'bg-linear-1-main shadow-[0px_4px_4px_0px_#00000040,0px_0px_12px_0px_#FFFFFF_inset]'
};
const boxIcons = {
    ['ALREADY_REDEEMED']: 'icon_box_used',
    ['NON_REDEEMABLE']: 'icon_box_disable',
    ['REDEEMABLE']: 'icon_box_available'
}

export const RewardCard = forwardRef((props: RewardCardProps, ref: any) => {
    const {state, day, cashback, onClickToSignIn,} = props;
    const hoverClassName = state === 'REDEEMABLE' ? 'cursor-pointer hover:brightness-[1.3] active:brightness-[0.7]' : 'cursor-default'
    const strokeClassName = strokeClassNames[state];
    const bgClassName = bgClassNames[state];
    const boxIconRes = `assets/${environment.uVersion}/${boxIcons[state]}.png`;

    return (
        <div
            className={cx(hoverClassName)}
            onClick={(e) => {
                if (state === 'REDEEMABLE') {
                    e.stopPropagation();
                    onClickToSignIn();
                }
            }}
        >
            <div className={cx(
                'rounded-lg',
                strokeClassName)
            }>
                <div className={cx(
                    'flex flex-col items-center rounded-lg',
                    bgClassName)}>
                    {/*  title */}
                    <div className={cx('mt-3.5 font-bold text-sm mobile:text-lg text-center px-1.5')}>
                        R$ {formatLocaleMoney(cashback)}
                    </div>
                    {/*  icon */}
                    <img
                        className={cx('')}
                        src={boxIconRes}
                    />
                </div>
            </div>
            <div className={cx(
                'w-full mt-2',
                'text-center text-[var(--transparent-white-80)]',
                'font-bold text-sm mobile:text-base tablet:text-lg'
            )}>
                Dia {day}
            </div>
        </div>
    );
});
