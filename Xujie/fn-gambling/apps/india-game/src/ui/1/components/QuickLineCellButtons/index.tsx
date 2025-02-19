import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import Icon from '@components/Icon';
import RedDot from '@components/RedDot';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { useMode2InviteTabStore } from '@mode2/zustand/page/invitePageStore';
import { useAppStore } from '@mode2/zustand/appStore';
import {
  handleMyPageActivityLineBtnClick,
  handleMyPageBankAccountLineBtnClick,
  handleMyPageChangePasswordLineBtnClick,
  handleMyPageDepositBtnClick,
  handleMyPageEarnMoneyLineBtnClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageReloadVersionLineBtnClick,
  handleMyPageVIPDetailBtnClick,
  handleMyPageVIPRecordBtnClick,
  handleMyPageVIPReportBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import { formatMoney } from '@mode2/utils';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { LineBtnUnit } from '@mode2/zustand/page/myPageStore';

const QuickLineCellButtons = memo(() => {
  const { t } = useTranslation();
  const { handleMyPageClick } = useMyPageActions();
  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );
  const realTimeH5Version = useAppStore((state) => state.realTimeH5Version);
  const lineBtnList: LineBtnUnit[] = useMemo(() => {
    return [
      {
        iconName: 'balance_record',
        name: {
          i18nKey:
            'account_balance_record_fund_transfer_records_header_balance_record',
        },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageVIPRecordBtnClick,
          });
        },
      },
      {
        iconName: 'balance_report',
        name: { i18nKey: 'account_balance_report_header_balance_report' },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageVIPReportBtnClick,
          });
        },
      },
      {
        iconName: 'earn_money',
        name: {
          i18nKey: 'leftnav_invite_earn',
          i18nOption: { value: formatMoney(10000) },
        },
        color: 'var(--base-1-main)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          setInviteCurTab(InvitePageTabType.EARN);
          handleMyPageClick({
            actionName: handleMyPageEarnMoneyLineBtnClick,
          });
        },
      },
      {
        iconName: 'deposit',
        name: {
          i18nKey: 'leftnav_recharge_bonus',
          i18nOption: { value: '5' },
        },
        color: 'var(--base-1-main)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageDepositBtnClick,
          });
        },
      },
      {
        iconName: 'vip',
        name: {
          i18nKey: 'leftnav_bonus_monthly',
          i18nOption: { value: formatMoney(99999) },
        },
        color: 'var(--base-1-main)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageVIPDetailBtnClick,
          });
        },
      },
      {
        iconName: 'activity',
        name: { i18nKey: 'account_menu_piggy_bank' },
        color: 'var(--base-1-main)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageActivityLineBtnClick,
          });
        },
      },
      {
        iconName: 'user',
        name: { i18nKey: 'account_menu_personal_information' },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPagePersonalInformationLineBtnClick,
          });
        },
      },
      {
        iconName: 'change_password',
        name: { i18nKey: 'account_menu_change_password' },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageChangePasswordLineBtnClick,
          });
        },
      },
      {
        iconName: 'bank_account',
        name: { i18nKey: 'account_menu_bank_account' },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: false,
        isShowArrow: true,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageBankAccountLineBtnClick,
          });
        },
      },
      {
        iconName: 'reload',
        name: { i18nKey: 'account_menu_refresh_version' },
        color: 'var(--grayscale-100)',
        isBorder: true,
        isShowRedDot: realTimeH5Version.isNewVersion,
        isShowArrow: false,
        onAction: () => {
          handleMyPageClick({
            actionName: handleMyPageReloadVersionLineBtnClick,
          });
        },
      },
    ];
  }, [realTimeH5Version]);

  return (
    <div className="btnItems">
      {lineBtnList.map((item) => {
        return (
          <button
            key={`LineBtn - ${renderI18N(item.name, t)} - ${item.iconName}`}
            className={cx(
              'item',
              {
                'item-border': item.isBorder,
              },
              'last:!border-b-0'
            )}
            onClick={() => {
              // if (`${item.actionName}` in lineBtnActionObj)
              //   lineBtnActionObj[item.actionName]();
              item.onAction && item.onAction();
            }}
          >
            <Icon
              className="w-6 h-6"
              name={`ic_${item.iconName}`}
              color={item && item.color ? item.color : 'var(--base-2-main)'}
            />

            <div className="item-txt flex justify-between items-center gap-1">
              {renderI18N(item.name, t)}
              {item.isShowRedDot ? (
                <RedDot size="8" className={'animate-none w-2 h-2'} />
              ) : null}
            </div>

            {item.isShowArrow ? (
              <Icon
                className="w-4 h-4"
                name={`ic_arrow_right_1`}
                color="var(--grayscale-100)"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
});

export default QuickLineCellButtons;
