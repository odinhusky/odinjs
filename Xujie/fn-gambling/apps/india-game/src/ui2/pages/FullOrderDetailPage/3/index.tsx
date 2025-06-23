import useMode2FullOrderDetailPageBase from '@/ui/hooks/pages/fullOrderDetailPage/useMode2FullOrderDetailPageBase';
import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import Form from '@libs/components/Form';
import Input from '@libs/components/Input';
import {
  handleFullOrderDetailPageConfirmClick,
  handleFullOrderDetailPageInputClick,
  handleFullOrderDetailPageUploadClick,
} from '@mode2/action/actionTypes/fullOrderDetailPageActionType';
import useFullOrderDetailPageActions from '@mode2/action/fullOrderDetailPageAction/useFullOrderDetailPageActions';
import AffixBottomWrapper from '@libs/mode2/components/AffixBottomWrapper';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { FullOrderDetailValidator } from '@/validator/antdValidator';
import { useTranslation } from 'react-i18next';
import { useMode2FullOrderDetailPageStore } from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import { RechargeReceiptState } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import renderI18N from '@libs/commonUtils/renderI18N';
import { memo, useEffect, useMemo } from 'react';
import LeaveModal from './modals/LeaveModal';
import Icon from '@components/Icon';
import sdkUtils from '@libs/mode2/utils/sdk';
import ImageUpload from '@components/ImageUpload';
import {
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
} from '@libs/constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import isEmpty from 'lodash/isEmpty';

const StateBanner = ({
  state,
  rejectMessage,
}: {
  state: RechargeReceiptState;
  rejectMessage: string;
}) => {
  const { t } = useTranslation();

  const backgroundColor = {
    [RechargeReceiptState.PROCESSING]: {
      color: 'bgi-[var(--state-warning-main)]',
      text: 'withdrawal_order_detail_status_reviewing',
      iconName: 'ic_pending_outline_1',
    },

    [RechargeReceiptState.REJECTED]: {
      color: 'bgi-[var(--state-error-main)]',
      text: 'withdrawal_order_detail_rejected',
      iconName: 'ic_fail_outline_2',
    },
  };

  return (
    <>
      {/* 未上報 */}
      {state === RechargeReceiptState.UNCOMPLETED ? (
        <div
          className={cx(
            'text-base font-medium bgi-text-[var(--base-2-variant1)]',
            'px-7 pt-3'
          )}
        >
          Uploading your UTR(Transaction ID / Ref No.) helps us verify and
          credit your deposit faster.
        </div>
      ) : null}

      {/* 處理中 和 審核失敗 */}
      {state === RechargeReceiptState.PROCESSING ||
      state === RechargeReceiptState.REJECTED ? (
        <div
          className={cx(
            'w-full flex items-center gap-2 px-5 py-1 box-border',
            backgroundColor[state].color
          )}
        >
          <Icon name={backgroundColor[state].iconName} className="w-7 h-7" />
          <div className="bgi-text-[var(--grayscale-100)]">
            <div
              className={cx(
                'text-base font-medium',
                'bgi-text-[var(--grayscale-100)]'
              )}
            >
              {t(backgroundColor[state].text)}
            </div>
            <div className="text-xs font-medium">
              {state === RechargeReceiptState.PROCESSING
                ? 'Your UTR screenshot has been uploaded successfully and is currently under review.'
                : rejectMessage || ''}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const FormTitle = ({
  title,
  subTitle,
  state = false,
  iconName = 'ic_copy_3',
  showStar = false,
}: {
  title: string;
  subTitle: string;
  state?: boolean; // 狀態 區分[完成]和[其他]即可
  iconName?: string;
  showStar?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <label className="text-left text-sm font-medium mb-1 flex items-center gap-2.5">
      {state && <Icon name={iconName} />}
      <div className="flex items-center gap-1">
        <span
          className={cx({
            'bgi-text-[var(--base-2-variant1)]': state,
            'bgi-text-[var(--grayscale-100)]': !state,
          })}
        >
          {t(title)}
        </span>
        <span className={cx('bgi-text-[var(--grayscale-50)]')}>
          ({t(subTitle)})
        </span>
        {showStar ? (
          <span className="bgi-text-[var(--state-error-main)]">*</span>
        ) : null}
      </div>
    </label>
  );
};

const Description = memo(() => {
  return (
    <div
      className={cx('my-3 text-sm font-medium', 'flex gap-1')}
      // TODO handleCommonPageClick
      onClick={() => sdkUtils.openChat(() => {})}
    >
      <Icon name="ic_information_1" className="w-5 h-5" />
      <div className="text-sm font-medium bgi-text-[var(--base-2-variant2)]">
        Please double-check that your deposit details are correct. For any
        issues or questions, our{' '}
        <span className="bgi-text-[var(--state-success-main)] underline cursor-pointer">
          Customer Service
        </span>{' '}
        is available 24/7 to assist you.
      </div>
    </div>
  );
});

// 審核完成
const CompletedView = ({
  confirmCode,
  fullOrderFile,
}: {
  confirmCode: string;
  fullOrderFile: string;
}) => {
  return (
    <>
      <div className="h-4"></div>
      <div className="mx-4 flex flex-col gap-2">
        <div
          className={cx(
            'p-4 box-border flex flex-col gap-4',
            'border border-[var(--transparent-white-20)] bgi-[var(--base-2-variant7)] rounded-md'
          )}
        >
          <div>
            <FormTitle
              title={'balance_record_deposit_record_receipt_labe'}
              subTitle={'Transaction ID / Ref No.'}
              state={true}
            />
            <div className="ml-8 flex items-center gap-1 bgi-text-[var(--grayscale-100)]">
              <span className="text-base font-medium">{confirmCode}</span>
              <Icon name={'ic_success_outline'} className="w-5 h-5" />
            </div>
          </div>
          <div>
            <FormTitle
              title={'balance_record_deposit_record_receipt_screenshot_label'}
              subTitle={
                'balance_record_deposit_record_receipt_screenshot_label_optiona'
              }
              state={true}
              iconName="ic_image"
            />
            {fullOrderFile ? (
              <ImageUpload
                showBtn={false}
                disabled={true}
                imageUrl={fullOrderFile}
                onUpload={() => {}}
                className="border-none"
              />
            ) : (
              <div className="ml-8 text-sm font-medium bgi-text-[var(--base-2-variant2)]">
                No screenshot uploaded
              </div>
            )}
          </div>
        </div>

        <Description />
      </div>
    </>
  );
};

export const FullOrderDetailPage = () => {
  useMode2FullOrderDetailPageBase();

  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Validator Instance
  const FullOrderDetailValidatorInstance = FullOrderDetailValidator(t);

  const { handleFullOrderDetailPageClick } = useFullOrderDetailPageActions();

  const defaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );
  const rechargeQueryReceiptResult = useMode2FullOrderDetailPageStore(
    (state) => state.rechargeQueryReceiptResult
  );
  const fullOrderFile = useMode2FullOrderDetailPageStore(
    (state) => state.fullOrderFile
  );
  const uploadDeatil = useMode2FullOrderDetailPageStore(
    (state) => state.uploadDeatil
  );

  const showBtn = defaultValues.state !== RechargeReceiptState.COMPLETED;
  const isCompleted = defaultValues.state === RechargeReceiptState.COMPLETED;
  const uncompleted = defaultValues.state === RechargeReceiptState.UNCOMPLETED;

  const disabled = useMemo(() => {
    // 未上報：已輸入內容
    if (uncompleted && defaultValues.confirmCode) {
      return false;
    }
    // 已上報(一定有內容)： 只要輸入內容變化
    if (defaultValues.confirmCode !== rechargeQueryReceiptResult.confirmCode) {
      return false;
    }
    // 無論是否上報 只要圖片有上傳成功
    if (!isEmpty(uploadDeatil)) {
      return false;
    }

    // 默認禁止
    return true;
  }, [rechargeQueryReceiptResult, defaultValues, uploadDeatil, uncompleted]);

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [defaultValues, form]);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -mx-4 pb-20 box-border',
        'h-screen',
        'bgi-[var(--background-light)]'
      )}
    >
      {/* state */}
      <StateBanner
        state={defaultValues.state}
        rejectMessage={defaultValues.rejectMessage}
      />

      {/* 內容 - 表單 */}
      {isCompleted ? (
        <CompletedView
          confirmCode={defaultValues.confirmCode}
          fullOrderFile={fullOrderFile}
        />
      ) : (
        <div
          className={cx(
            'm-4 p-4 box-border',
            'border border-[var(--transparent-white-20)] bgi-[var(--base-2-variant7)] rounded-md'
          )}
        >
          <Form
            form={form}
            className="w-full"
            {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
            onFinish={() => {
              handleFullOrderDetailPageClick({
                actionName: handleFullOrderDetailPageConfirmClick,
              });
            }}
            onFinishFailed={(errorInfo) => {
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              if (message) useMessageStore.getState().info(message);
            }}
            initialValues={defaultValues}
          >
            <FormTitle
              title={'balance_record_deposit_record_receipt_labe'}
              subTitle={'Transaction ID / Ref No.'}
              showStar={true}
            />

            <Form.Item
              name="confirmCode"
              rules={[
                {
                  required: true,
                  validator: (_, value) =>
                    FullOrderDetailValidatorInstance.confirmCode(value, 12),
                },
              ]}
              {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
            >
              <Input
                type="number"
                disabled={isCompleted}
                // maxLength={22}
                minLength={12}
                placeholder={{
                  i18nKey:
                    'balance_record_deposit_record_receipt_input_placeholde',
                }}
                styles={{
                  containerDiv:
                    '!py-2 bgi-border-[var(--base-2-variant2)] !bgi-[var(--base-2-variant7)]',
                  inputBox: '!bgi-text-[var(--grayscale-50)]',
                  input: cx('!placeholder-red !px-0', {
                    '!bgi-text-[var(--grayscale-50)]': isCompleted,
                  }),
                }}
                value={defaultValues.confirmCode}
                onChange={(e) => {
                  handleFullOrderDetailPageClick({
                    actionName: handleFullOrderDetailPageInputClick,
                    payload: { value: e },
                  });
                }}
              />
            </Form.Item>
          </Form>

          <div className="-mt-3">
            <FormTitle
              title={'balance_record_deposit_record_receipt_screenshot_label'}
              subTitle={
                'balance_record_deposit_record_receipt_screenshot_label_optiona'
              }
            />
            <div className="flex items-center justify-center">
              {isCompleted && !defaultValues.receiptFileBase64 ? null : (
                <ImageUpload
                  showBtn={showBtn}
                  disabled={isCompleted}
                  className={cx({
                    'border-none': isCompleted,
                    'border-solid !bg-none': !uncompleted,
                    'bgi-[var(--transparent-white-10)]': uncompleted,
                  })}
                  imageUrl={fullOrderFile}
                  onUpload={(e) => {
                    handleFullOrderDetailPageClick({
                      actionName: handleFullOrderDetailPageUploadClick,
                      payload: { value: e },
                    });
                  }}
                />
              )}
            </div>
          </div>

          <Description />
        </div>
      )}

      {isCompleted ? null : (
        <div className={cx('mt-6 mx-4')}>
          <AffixBottomWrapper
            hasBottomNav
            offset={-3}
            affixContainerClass="bgi-[var(--bg-main)] -mx-4 w-screen p-4"
          >
            <BasePrimaryBtn
              className={cx(
                'text-base font-semibold h-[46px]',
                'shadow-inner shadow-[inset_0_4px_4px_rgba(204,204,204,0.25),_inset_0_-4px_4px_rgba(51,51,51,0.25)]'
              )}
              classNameText="text-xl font-medium"
              debounceTimer={500}
              disabled={disabled}
              children={renderI18N(
                {
                  i18nKey: 'balance_record_deposit_record_receipt_send_butto',
                },
                t
              )}
              onClick={() => form.submit()}
            />
          </AffixBottomWrapper>
        </div>
      )}

      <LeaveModal />
    </div>
  );
};

export default FullOrderDetailPage;
