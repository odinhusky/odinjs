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
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const GiftCodeRedeemModal = () => {
  useRedeemGiftCodeBase(GiftCodeRedeemScenarios.MODAL);

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
    <BaseModal>
      <div
        className={cx(
          'w-[328px]',
          'p-4 box-border rounded-lg',
          'flex flex-col gap-3',
          'relative',
          'border border-[var(--grayscale-50)] bgi-text-[var(--grayscale-100)] bgi-[var(--linear-9-main)]'
        )}
      >
        <BasePrimaryBtn
          className={cx(
            'absolute top-2 right-2 w-6 h-6 !bg-none',
            'border border-[var(--transparent-white-70)]'
          )}
          onClick={() => {
            setShowRedeemGiftCodeModal(false);
          }}
          children={
            <Icon
              name="ic_close"
              className="w-4 h-4"
              color="var(--transparent-white-70)"
            />
          }
        />

        <img
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'my_rewards_popup_claim')}
          alt="claim"
        />

        <Form
          form={form}
          className="w-full"
          onFinish={(values) => {
            console.log('formValues', values);
            redeemClick();
          }}
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
              GiftCodeRedeemValidatorInstance.giftCode(value)
            }
          />
        </Form>

        <BasePrimaryBtn
          type="submit"
          debounceTimer={500}
          className="h-10 bg-shadow-[var(--inset-shadow)]"
          children={renderI18N({ i18nKey: 'gift_code_popup_button' }, t)}
          onClick={form.submit}
        />
      </div>
    </BaseModal>
  ) : null;
};
