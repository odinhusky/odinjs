import { GiftCodeRedeemValidator } from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import Form from '@libs/components/Form';
import FormInput from '@libs/components/FormInput';
import BaseModal from '@libs/components/Modal';
import {
  handleGiftCodeInputClick,
  handleGiftCodeRedeemClick,
} from '@mode2/action/actionTypes';
import useGiftCodeRedeemPageAction from '@libs/mode2/action/giftCodeRedeemAction/useGiftCodeRedeemPageAction';
import Icon from '@components/Icon';
import useRedeemGiftCodeBase from '@libs/mode2/usecase/page/giftCodeRedeemPage/useRedeemGiftCodeBase';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import {
  GiftCodeRedeemResultScenarios,
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
} from '@libs/constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';

export const GiftCodeRedeemModal = () => {
  useRedeemGiftCodeBase(
    GiftCodeRedeemScenarios.MODAL,
    GiftCodeRedeemResultScenarios.MODAL
  );

  const { t } = useTranslation();

  const [form] = Form.useForm();

  // Validator Instance
  const GiftCodeRedeemValidatorInstance = GiftCodeRedeemValidator(t);

  const { handleGiftCodeRedeemPageClick } = useGiftCodeRedeemPageAction();

  const giftCode = useGiftCodeRedeemStore((state) => state.giftCode);
  const showRedeemGiftCodeModal = useGiftCodeRedeemStore(
    (state) => state.showRedeemGiftCodeModal
  );
  const setShowRedeemGiftCodeModal = useGiftCodeRedeemStore(
    (state) => state.setShowRedeemGiftCodeModal
  );

  // gift code 兌換
  const redeemClick = () => {
    handleGiftCodeRedeemPageClick({
      actionName: handleGiftCodeRedeemClick,
      payload: {
        scenarios: GiftCodeRedeemScenarios.MODAL,
        giftCode: giftCode,
      },
    });
  };

  useEffect(() => {
    if (giftCode) {
      form.setFieldsValue({ giftCode: giftCode });
    }
  }, [giftCode]);

  return showRedeemGiftCodeModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div className="border bgi-border-[var(--base-1-variant1)] rounded-lg">
        <div
          className={cx(
            'w-[408px]',
            'p-4 box-border rounded-lg',
            'flex flex-col gap-8',
            'relative z-10',
            'bgi-text-[var(--grayscale-100)] bgi-[var(--base-2-variant9)]'
          )}
        >
          <BasePrimaryBtn
            className={cx('absolute top-4 right-4 w-6 h-6 !bg-none z-10')}
            onClick={() => {
              setShowRedeemGiftCodeModal(false);
            }}
            children={<Icon name="ic_close" className="w-4 h-4" />}
          />
          <img
            className="absolute -left-2 -top-[214px]"
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'my_rewards_popup_claim'
            )}
            alt="claim"
          />
          <img
            className="w-24 h-24 absolute -bottom-7 -right-8"
            src={getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'my_rewards_popup_money'
            )}
            alt="claim"
          />
          <Form
            form={form}
            className="w-full mt-24"
            onFinish={(values) => {
              console.log('formValues', values);
              redeemClick();
            }}
            onFinishFailed={(errorInfo) => {
              console.log(errorInfo);
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              if (message) useMessageStore.getState().info(message);
            }}
            initialValues={{ giftCode: giftCode }}
            {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
          >
            <FormInput
              name={'giftCode'}
              styles={{
                containerDiv:
                  '!py-4 bgi-[var(--transparent-gray-30)] bgi-border-[var(--base-2-variant2)]',
                inputBox: 'relative z-10',
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
          <div className="flex justify-center">
            <BasePrimaryBtn
              type="submit"
              debounceTimer={500}
              className="w-52 h-12 text-lg font-medium bg-shadow-[var(--box-shadow)]"
              children={renderI18N(
                { i18nKey: 'logout_reminder_confirm_button' },
                t
              )}
              onClick={form.submit}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  ) : null;
};
