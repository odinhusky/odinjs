import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import useGiftCodeRedeemPageAction from '@mode2/action/giftCodeRedeemAction/useGiftCodeRedeemPageAction';
import {
  handleGiftCodeClearInputClick,
  handleGiftCodeInputClick,
  handleGiftCodeRedeemClick,
} from '@mode2/action/giftCodeRedeemAction/actionType';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { useEffect, useMemo } from 'react';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import Form from '@libs/components/Form';
import FormInput from '@libs/components/FormInput';
import { GiftCodeRedeemValidator } from '@/validator/antdValidator';
import { useTranslation } from 'react-i18next';
import {
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import Icon from '@components/Icon';
import {
  CustomerServiceScenarios,
  useCustomerServiceListStore,
} from '@libs/mode2/zustand/components/customerServiceListStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import MaxLimitModal from './components/MaxLimitModal';
import useGiftCodeRedeemPageBase from '@mode2/usecase/page/giftCodeRedeemPage/useGiftCodeRedeemPageBase';

export const GiftCodeRedeemPage = () => {
  useGiftCodeRedeemPageBase();
  const { handleGiftCodeRedeemPageClick } = useGiftCodeRedeemPageAction();

  const { VITE_PLATFORM } = import.meta.env;

  const { t, i18n } = useTranslation();

  const [form] = Form.useForm();

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

  const borderClass =
    'p-3 box-border border rounded-lg bgi-text-[var(--grayscale-100)] bgi-[var(--linear-1)] bgi-border-[var(--base-2-light)]';

  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'mt-3 mb-6')}>
      <div className="w-full rounded-lg overflow-hidden">
        <img
          src={getImgUrl(EResourceLevel.V, `gift_code_banner_${i18n.language}`)}
          alt="gift_code"
        />
      </div>

      <div className={cx('mt-3 text-base flex flex-col gap-3', borderClass)}>
        <div className="font-medium">
          {renderI18N({ i18nKey: 'gift_code_welcome_text' }, t)}
        </div>

        <Form
          form={form}
          className="w-full z-10"
          onFinish={redeemClick}
          onFinishFailed={(error) => {
            console.log(error);
          }}
          initialValues={{ giftCode: giftCode }}
        >
          <FormInput
            name={'giftCode'}
            title={{
              i18nKey: 'gift_code_popup_input_label',
            }}
            styles={{
              containerDiv: '!py-2 bgi-[var(--transparent-white-20)]',
            }}
            maxLength={20}
            value={giftCode}
            placeholder={{
              i18nKey: 'gift_code_popup_input_placeholder',
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
              GiftCodeRedeemValidator.giftCode(value, t)
            }
            suffix={
              <Icon
                name="ic_close"
                className="w-6 h-6"
                color="var(--transparent-white-70)"
                onClick={() => {
                  handleGiftCodeRedeemPageClick({
                    actionName: handleGiftCodeClearInputClick,
                  });
                }}
              />
            }
          />
        </Form>

        <div className="">
          <span className="font-semibold">
            {renderI18N({ i18nKey: 'gift_code_bonus_amount' }, t)}:
          </span>
          <span className="font-medium inline-block ml-3 bgi-text-[var(--base-2-main)]">
            {formatMoney(adGiftBonusRange.min)}~
            {formatMoney(adGiftBonusRange.max)}
          </span>
        </div>

        <BasePrimaryBtn
          className="h-10 text-base font-semibold bg-shadow-[var(--inset-shadow)] z-10"
          children={renderI18N({ i18nKey: 'gift_code_popup_button' }, t)}
          onClick={form.submit}
        />
      </div>

      <div className={cx('text-base font-medium my-2', borderClass)}>
        <div className="mb-3">
          {renderI18N({ i18nKey: 'gift_code_follow_official_channel' }, t)}
        </div>
        <div className="flex gap-2">
          {serviceList.map((item) => (
            <div
              className={cx(
                'h-8',
                'flex items-center flex-1 gap-1 justify-center',
                'bgi-text-[var(--grayscale-100)] bgi-[var(--base-1-main)] rounded-full',
                'bg-shadow-[var(--inset-shadow)] z-10 cursor-pointer',
                'hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)] disabled:bgi-[var(--grayscale-25)] '
              )}
              key={item.label}
              onClick={item.onActionClick}
            >
              <BasePrimaryBtn
                className={cx('w-5 h-5 !bg-none')}
                children={
                  <img
                    className={cx('w-full h-full object-contain', 'flex')}
                    src={getImgUrl(EResourceLevel.SHARED, item.icon)}
                    alt={item.label}
                  />
                }
              />

              <span className="bgi-text-[var(--grayscale-100)] text-xs mobile:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={cx('text-sm', borderClass)}>
        <p className="relative z-10">
          <span>
            {t('gift_code_join_official_channel', {
              productName: VITE_PLATFORM,
            })}
            :
          </span>
          <span
            className="inline-block ml-1 bgi-text-[var(--game-2-main)] bgi-border-b-[var(--base-2-main)] cursor-pointer"
            onClick={serviceList[0] && serviceList[0].onActionClick}
          >
            {serviceList[0]?.link}
          </span>
        </p>
        <p>
          {t('gift_code_welcome_daily_bonus', {
            minGiftBonus: formatMoney(adGiftBonusRange.min),
            maxGiftBonus: formatMoney(adGiftBonusRange.max),
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
                      productName: VITE_PLATFORM,
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <MaxLimitModal />
    </div>
  );
};

export default GiftCodeRedeemPage;
