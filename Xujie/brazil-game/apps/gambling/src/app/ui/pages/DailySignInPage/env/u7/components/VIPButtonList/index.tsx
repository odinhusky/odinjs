import React from "react";
import {environment} from "../../../../../../../../environments/environment";
import {DragScrollContainer} from "../../../../../../components/DragScrollContainer";
import cx from "../../../../../../utils/cx";

const vips: number[] = [];

for (let i = 1; i <= 25; i += 1) {
    vips.push(i);
}

interface VIPButtonListProps {
    selectedVIP: number;
    setSelectedVIP: React.Dispatch<React.SetStateAction<number>>;
    currentVIP: number;
}

export const VIPButtonList = (props: VIPButtonListProps) => {
    const {selectedVIP, setSelectedVIP, currentVIP,} = props;
    return (
        <div
            id={'VIPButtonList'}
            className={'relative'}
        >
            <DragScrollContainer
                className={cx('relative flex gap-3 h-12 overflow-x-scroll')}>
                {vips.map((vip) => {
                    return (
                        <button
                            key={vip}
                            className={cx(
                                'relative flex gap-[5px] flex-shrink-0',
                                'text-base rounded-lg',
                                'w-[100px] h-9',
                                // 'mobile:w-[100px] w-[72px] h-9',
                                'justify-center items-center shadow-[0px_4px_4px_#00000040] font-medium',
                                vip >= currentVIP ? 'vip-tab-lock' : 'vip-tab-unlock',
                                vip === selectedVIP ? 'selected' : '',

                            )}
                            onClick={() => {
                                setSelectedVIP(vip);
                            }}
                        >
                            {/* 锁 */}
                            {vip >= currentVIP && (
                                <img
                                    className="w-3"
                                    src={`assets/${environment.uVersion}/icon_lock.png`}
                                    alt="lock"
                                />
                            )}

                            {/* 箭头 */}
                            {vip === selectedVIP && (
                                <img
                                    className="absolute w-5 h-[10px] bottom-[-10px] left-1/2 -translate-x-1/2"
                                    src={`assets/${environment.uVersion}/icon_arrow3_down.png`}
                                    alt={'arrow-down'}
                                />
                            )}
                            VIP {vip}
                        </button>
                    );
                })}
            </DragScrollContainer>
        </div>
    );
};
