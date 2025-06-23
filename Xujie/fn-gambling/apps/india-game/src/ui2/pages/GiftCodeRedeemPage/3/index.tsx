import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import useGiftCodeRedeemPageAction from '@mode2/action/giftCodeRedeemAction/useGiftCodeRedeemPageAction';
import {
  handleGiftCodeInputClick,
  handleGiftCodeRedeemClick,
} from '@mode2/action/actionTypes';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { useEffect, useMemo } from 'react';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import {
  EResourceLevel,
  formatMoney,
  getIconName,
  getImgUrl,
} from '@libs/mode2/utils';
import Form from '@libs/components/Form';
import FormInput from '@libs/components/FormInput';
import { GiftCodeRedeemValidator } from '@/validator/antdValidator';
import { useTranslation } from 'react-i18next';
import {
  GiftCodeRedeemResultScenarios,
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import useGiftCodeRedeemPageBase from '@mode2/usecase/page/giftCodeRedeemPage/useGiftCodeRedeemPageBase';
import {
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
} from '@libs/constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import sdkUtils from '@mode2/utils/sdk';

export const GiftCodeRedeemPage = () => {
  useGiftCodeRedeemPageBase(GiftCodeRedeemResultScenarios.MODAL);
  const { handleGiftCodeRedeemPageClick } = useGiftCodeRedeemPageAction();

  // const { VITE_PLATFORM } = import.meta.env;

  const { t } = useTranslation();

  const [form] = Form.useForm();

  // Validator Instance
  const GiftCodeRedeemValidatorInstance = GiftCodeRedeemValidator(t);

  // 廣告金額
  const adGiftBonusRange = usePlatformDynamicConfigStore(
    (state) => state.adGiftBonusRange
  );

  const usageScenariosList = useCustomerServiceListStore(
    (state) => state.usageScenariosList
  );
  const serviceList = useMemo(() => {
    return (
      usageScenariosList.find(
        (item) => item.scenarios === CustomerServiceScenarios.GIFT_CODE
      )?.customerServiceList || []
    );
  }, [usageScenariosList]);

  const giftCode = useGiftCodeRedeemStore((state) => state.giftCode);
  const setGiftCode = useGiftCodeRedeemStore((state) => state.setGiftCode);

  // gift code 兌換
  const redeemClick = () => {
    handleGiftCodeRedeemPageClick({
      actionName: handleGiftCodeRedeemClick,
      payload: {
        scenarios: GiftCodeRedeemScenarios.PAGE,
        giftCode: giftCode,
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue({ giftCode: giftCode });
  }, [giftCode]);

  useEffect(() => {
    return () => {
      setGiftCode('');
    };
  }, []);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'mt-3 mb-6 bgi-text-[var(--grayscale-100)]'
      )}
    >
      <div className="w-full rounded-lg overflow-hidden">
        <img
          src={getImgUrl(EResourceLevel.ICONS, `gift_code_banner_en`)}
          alt="gift_code"
        />
      </div>

      <div
        className={cx(
          'mt-5 px-5 py-8 box-border text-base flex flex-col gap-8',
          'text-xl font-medium',
          'rounded-lg bgi-[var(--base-2-variant7)]'
        )}
      >
        <div className="">
          {renderI18N({ i18nKey: 'gift_code_welcome_text' }, t)}
        </div>
        <div>
          <Form
            form={form}
            {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
            className="w-full z-10"
            onFinish={redeemClick}
            onFinishFailed={(errorInfo) => {
              console.log(errorInfo);
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              if (message) useMessageStore.getState().info(message);
            }}
            initialValues={{ giftCode: giftCode }}
          >
            <FormInput
              name={'giftCode'}
              styles={{
                containerDiv: '!py-4 bgi-[var(--transparent-gray-30)]',
              }}
              maxLength={20}
              value={giftCode}
              placeholder={{
                i18nKey: 'gift_code_redeem_input_hint_gift_code',
              }}
              required={true}
              isShowStar={false}
              onChange={(e) => {
                handleGiftCodeRedeemPageClick({
                  actionName: handleGiftCodeInputClick,
                  payload: { value: e },
                });
              }}
              onValidator={(_, value) =>
                GiftCodeRedeemValidatorInstance.giftCode(value, {
                  emptyI18nKey: 'gift_code_redeem_input_cannot_be_empty',
                })
              }
              formItemProps={{ ...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS }}
            />
          </Form>
          <div className="mt-4">
            <span className="">
              {renderI18N({ i18nKey: 'gift_code_bonus_amount' }, t)}:
            </span>
            <span className="font-medium text-2xl inline-block ml-3 bgi-text-[var(--base-1-main)]">
              {formatMoney({ value: adGiftBonusRange.min })}~
              {formatMoney({ value: adGiftBonusRange.max })}
            </span>
          </div>
        </div>
        <BasePrimaryBtn
          type="submit"
          className="h-[46px] text-xl font-semibold z-10"
          children={renderI18N(
            { i18nKey: 'logout_reminder_confirm_button' },
            t
          )}
          onClick={form.submit}
        />
      </div>

      {/* icon_telegram_fill_2 */}
      <div className={cx('text-base font-medium my-5')}>
        <div className="mb-3 text-2xl">
          {renderI18N({ i18nKey: 'gift_code_follow_official_channel' }, t)}
        </div>
        <div className="flex gap-5">
          {serviceList.map((item, index) => (
            <BasePrimaryBtn
              key={index}
              className={cx('w-12 h-12 text-base flex-1')}
              classNameText="inline-flex items-center gap-2"
              children={
                <>
                  <img
                    className={cx('w-6 h-6 object-contain', 'flex')}
                    src={getImgUrl(
                      EResourceLevel.ICONS,
                      `${getIconName(item.icon)}_fill_2`
                    )}
                    alt={item.label}
                  />
                  <span className="text-base font-medium">{item.label}</span>
                </>
              }
              onClick={item.onActionClick}
            />
          ))}
        </div>
      </div>

      <div className={cx('text-sm')}>
        <p className="relative z-10">
          <span>
            {t('gift_code_join_official_channel', {
              productName: sdkUtils.productName(),
            })}
            :
          </span>
          <span
            className="inline-block ml-1 bgi-text-[var(--state-success-main)] bgi-border-b-[var(--base-2-main)] cursor-pointer"
            onClick={serviceList[0] && serviceList[0].onActionClick}
          >
            {/* TODO Evan for [V6]*/}
            {t('gift_code_official_channel_link')}
            {/*{serviceList[0]?.link}*/}
          </span>
        </p>
        <p>
          {t('gift_code_welcome_daily_bonus', {
            minGiftBonus: formatMoney({ value: adGiftBonusRange.min }),
            maxGiftBonus: formatMoney({ value: adGiftBonusRange.max }),
          })}
        </p>

        <div className="mt-5">
          <p>{renderI18N({ i18nKey: 'gift_code_rules_steps' }, t)}:</p>
          <ul className="">
            {Array.from({ length: 8 }, (_, index) => {
              return (
                <li className="" key={index}>
                  <span>{index + 1}. </span>
                  <span>
                    {t(`gift_code_rules_steps_${index + 1}`, {
                      productName: sdkUtils.productName(),
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GiftCodeRedeemPage;
