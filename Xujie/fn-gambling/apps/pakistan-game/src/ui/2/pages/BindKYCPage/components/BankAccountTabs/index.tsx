import { RequiredWalletAndOtherBankUnit } from '@/external/api/endpoint/PostWalletAndOtherBankListEndpoint';
import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import Icon from '@libs/mode2/components/Icon';
import { useEffect } from 'react';

export const BankAccountTabs = () => {
  const bankAccountTabList = useBindKYCPageDiffStore(
    (state) => state.bankAccountTabList
  );

  const activeBankAccountTab = useBindKYCPageDiffStore(
    (state) => state.activeBankAccountTab
  );

  const setActiveBankAccountTab = useBindKYCPageDiffStore(
    (state) => state.setActiveBankAccountTab
  );

  const handleBankAccountTabsClick = (tab: RequiredWalletAndOtherBankUnit) => {
    handleGlobalClick({
      target: 'handleBankAccountTabsClick',
      callback: () => {
        setActiveBankAccountTab(tab);
      },
    });
  };

  // 進來的時候預設選擇列表的第一個
  useEffect(() => {
    setActiveBankAccountTab({ ...bankAccountTabList[0] });
  }, [bankAccountTabList]);

  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'bgi-[var(--grayscale-15)]',
        'bg-shadow-[var(--bar-drop-shadow)]',
        'rounded'
      )}
    >
      {bankAccountTabList.map((item) => {
        const isActive = item.code === activeBankAccountTab.code;
        return (
          <div
            key={item.code}
            className={cx(
              'relative',
              FLEX_CENTER,
              'flex-1',
              'py-[10px]',
              'cursor-pointer',
              'rounded',
              {
                'bgi-[var(--linear-1)]': isActive,
              }
            )}
            onClick={() => {
              handleBankAccountTabsClick(item);
            }}
          >
            {item.code !== 'OTHER_BANKS' ? (
              <div>
                <Icon
                  name={`ic_${item.code.toLowerCase()}`}
                  className="w-[25px] h-[25px]"
                />
              </div>
            ) : null}

            <div
              className={cx('text-sm mobile:text-base', 'font-semibold', {
                'bgi-text-[var(--base-2-main)]': isActive,
                'bgi-text-[var(--grayscale-50)]': !isActive,
              })}
            >
              {item.name}
            </div>

            {isActive ? <div className="gradient-line"></div> : null}
          </div>
        );
      })}
    </div>
  );
};

export default BankAccountTabs;
