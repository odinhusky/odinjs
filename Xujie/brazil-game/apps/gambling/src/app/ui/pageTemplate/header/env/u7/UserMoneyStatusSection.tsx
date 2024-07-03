import {CSSProperties, useCallback} from "react";
import {ThreeDots} from "react-loading-icons";
import {useUserMoneyStatusSection} from "../../hooks/useUserMoneyStatusSection";
import {formatLocaleMoney, formatLocaleMoneyWithAbbr} from "../../../../utils/format";
import {environment} from "../../../../../../environments/environment";
import {debounce} from "lodash";
import cx from "../../../../utils/cx";
import {CacheImage} from "../../../../components/image/CacheImage";
import {IProps} from "../../UserMoneyStatusSection";
import useBreakpoint from "../../../hooks/useBreakpoint";
import {IconTooltip} from "../../../../components/Tooltips/IconTooltip";
import {EyeOutlined} from "@ant-design/icons";

export const UserMoneyStatusSection = (props: IProps) => {
    const {
        onClickToWallet,
        totalBalanceSheetValue,
        update,
        isUserMoneyStatusLoading,
    } = useUserMoneyStatusSection();

    const debouncedOnUpdate = useCallback(
        debounce(update, 1000), // 500ms的去抖动时间
        [] // 依赖项数组，空数组意味着该函数在组件的生命周期内不会改变
    );
    const {isMobile} = useBreakpoint();

    // const totalBalanceMax = `${totalBalanceSheetValue}`.length > 8;
    // const userBalanceValue = isMobile && totalBalanceMax
    //     ? formatLocaleMoneyWithAbbr(totalBalanceSheetValue)
    //     : formatLocaleMoney(totalBalanceSheetValue);

    return (
        <div
            className={cx('flex flex-row justify-between items-center',
                'h-9 px-2 gap-2 ml-2 text-sm',
                'mobile:h-10 mobile:px-2 mobile:gap-3 mobile:text-base',
                'tablet:h-10 tablet:px-2 tablet:gap-3 tablet:text-xl',
                props.className)}>
            <button
                className={'flex-none aspect-square'}
                onClick={(e) => {
                    e.stopPropagation();
                    debouncedOnUpdate()
                }}>
                <CacheImage
                    className={cx(
                        'hover:opacity-70 aspect-square',
                        'h-5 w-5',
                        'tablet:h-7 tablet:w-7 animate-none',
                        {
                           "animate-spin": isUserMoneyStatusLoading,//旋转
                        }
                    )}
                    alt={'refresh'}
                    src={`assets/${environment.uVersion}/icon_reload.png`}/>
            </button>
            <div
                className={cx(
                    'flex-auto text-start justify-start tablet:justify-center basis-1/2 font-medium',
                    'text-[var(--grayscale-100)]',
                    props.textClassName
                )}>
                {isUserMoneyStatusLoading ?
                    <ThreeDots width={80} height={20} className={cx('w-4')}/> : `R$ ${formatLocaleMoney(totalBalanceSheetValue)}`
                }
            </div>
            {/*{*/}
            {/*    isMobile && totalBalanceMax ? (*/}
            {/*        <div className="mr-1 ml-1">*/}
            {/*            <IconTooltip*/}
            {/*                id="check-balance"*/}
            {/*                place="bottom"*/}
            {/*                tooltipStyle={{*/}
            {/*                    background: 'var(--grayscale-40)',*/}
            {/*                    borderRadius: '8px',*/}
            {/*                    padding: '4px 8px',*/}
            {/*                    width: 'auto',*/}
            {/*                    height: 'auto',*/}
            {/*                    maxWidth: '200px',*/}
            {/*                    wordWrap: 'break-word',*/}
            {/*                    fontSize: '16px',*/}
            {/*                }}*/}
            {/*                offset={20}*/}
            {/*                icon={*/}
            {/*                    <>*/}
            {/*                        <EyeOutlined*/}
            {/*                            className="text-base md:text-lg leading-7 text-white mb-[2px] md:mb-1"/>*/}
            {/*                    </>*/}
            {/*                }*/}
            {/*                content={`R$ ${formatLocaleMoney(totalBalanceSheetValue)}`}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    ) : null*/}
            {/*}*/}
            <button
                className={'bg-state-success-main flex-none aspect-square rounded-full p-[5px] h-[70%]'}
                onClick={() => onClickToWallet({'panelType': 'deposit'})}>
                <CacheImage
                    className={cx(
                        'hover:opacity-70 aspect-square object-contain',
                        'h-full w-full',
                    )}
                    alt={'add'}
                    src={`assets/${environment.uVersion}/icon_add.png`}/>
            </button>
        </div>
    )
}
