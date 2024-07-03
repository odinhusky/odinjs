import {useCallback} from "react";
import {formatLocaleMoney, formatLocaleMoneyWithAbbr} from "../../../../utils/format";
import {useUserMoneyStatusSection} from "../../hooks/useUserMoneyStatusSection";
import {ThreeDots} from "react-loading-icons";
import {debounce} from "lodash";
import {CacheImage} from "../../../../components/image/CacheImage";
import {environment} from "../../../../../../environments/environment";
import useBreakpoint from "../../../hooks/useBreakpoint";
import {EyeOutlined} from '@ant-design/icons';
import { IconTooltip } from "../../../../components/Tooltips/IconTooltip";
import { FLEX_CENTER, SHADOW } from "apps/gambling/src/assets/constant/style";
import cx from "../../../../utils/cx";

type IProps = {
  className?: string;
}
export const UserMoneyStatusSection = (props: IProps) => {
  const {
    onClickToWallet,
    totalBalanceSheetValue,
    update,
    isUserMoneyStatusLoading,
  } = useUserMoneyStatusSection();
  const { isMobile } = useBreakpoint();
  const debouncedOnUpdate = useCallback(
    debounce(update, 1000), // 500ms的去抖动时间
    [] // 依赖项数组，空数组意味着该函数在组件的生命周期内不会改变
  );
  
  // const totalBalanceSheetValue = 388764;
  return (
    <div className={cx(
      'w-full h-10 md:h-12',
      'bg-[var(--grayscale-30)]',
      'rounded-full',
      FLEX_CENTER,
      SHADOW
    )}>
      <CacheImage
        alt={'refresh'}
        src={`assets/${environment.uVersion}/icon_caixotes.png`}
        className={'w-6 h-6 md:w-8 md:h-8 cursor-pointer ml-2'}
        onClick={() => {
          debouncedOnUpdate();
        }}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden'
          e.currentTarget.style.width = '0px'
        }}
      />

      <div className="flex flex-row justify-end items-start w-full mx-2">
        <div className="text-sm md:text-base font-medium leading-5 md:leading-6 text-[var(--grayscale-100)]">
          {isUserMoneyStatusLoading ?
            <ThreeDots className={'w-1/2'}/> : `${
              isMobile
                ? formatLocaleMoneyWithAbbr(totalBalanceSheetValue)
                : formatLocaleMoney(totalBalanceSheetValue)}`}
        </div>
      </div>
      
      {
        isMobile ? (
          <div className="mr-2 ml-1">
            <IconTooltip
              id="check-balance"
              place="bottom"
              tooltipStyle={{
                background: 'var(--grayscale-40)',
                borderRadius: '8px',
                padding: '4px 8px',
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                wordWrap: 'break-word',
                fontSize: '16px',
              }}
              offset={20}
              icon={
                <>
                  <EyeOutlined className="text-base md:text-lg leading-7 text-white mb-[2px] md:mb-1" />
                </>
              }
              content={`R$ ${formatLocaleMoney(totalBalanceSheetValue)}`}
            />
          </div>
        ) : null
      }
      
      <CacheImage
        id={'Headerbtn'}
        alt={'add'}
        src={`assets/${environment.uVersion}/icon_plus.png`}
        className={'w-4 h-4 md:w-5 md:h-5 cursor-pointer justify-center items-center mr-2 md:mr-3'}
        onClick={() => onClickToWallet({ 'panelType': 'deposit' })}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden'
          e.currentTarget.style.width = '0px'
        }}
      />
    </div>
  )
}
