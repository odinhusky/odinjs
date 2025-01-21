import useMode2FullOrderDetailPageBase from '@/ui/hooks/pages/fullOrderDetailPage/useMode2FullOrderDetailPageBase';
import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import ImageUpload from '@libs/components/ImageUpload';
import Form from '@libs/components/Form';
import Input from '@libs/components/Input';
import {
  handleFullOrderDetailPageInputClick,
  handleFullOrderDetailPageConfirmClick,
  handleFullOrderDetailPageUploadClick,
} from '@mode2/action/fullOrderDetailPageAction/actionType';
import useFullOrderDetailPageActions from '@mode2/action/fullOrderDetailPageAction/useFullOrderDetailPageActions';
import AffixBottomWrapper from '@libs/mode2/components/AffixBottomWrapper';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { FullOrderDetailValidator } from '@/validator/antdValidator';
import { useTranslation } from 'react-i18next';
import LeaveModal from '@libs/components/LeaveModal';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useMode2FullOrderDetailPageStore } from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import { RechargeReceiptState } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useEffect } from 'react';

const FullOrderDetailPage = () => {
  useMode2FullOrderDetailPageBase();

  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { handleFullOrderDetailPageClick } = useFullOrderDetailPageActions();

  const defaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );
  const fullOrderFile = useMode2FullOrderDetailPageStore(
    (state) => state.fullOrderFile
  );

  const showBtn = defaultValues.state !== RechargeReceiptState.COMPLETED;
  const isCompleted = defaultValues.state === RechargeReceiptState.COMPLETED;

  const backgroundColor = {
    [RechargeReceiptState.PROCESSING]: {
      color: 'bgi-[var(--state-warn-main)]',
      text: 'balance_record_deposit_record_receipt_state_processing',
    },
    [RechargeReceiptState.COMPLETED]: {
      color: 'bgi-[var(--state-success-main)]',
      text: 'balance_record_deposit_record_receipt_state_complete',
    },
    [RechargeReceiptState.REJECTED]: {
      color: 'bgi-[var(--state-error-main)]',
      text: 'balance_record_deposit_record_receipt_state_rejected',
    },
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [defaultValues]);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'pb-20',
        'bgi-text-[var(--grayscale-100)]'
      )}
    >
      <div className="my-3 text-center relative">
        <div className="pb-1">
          {renderI18N(
            {
              i18nKey: 'balance_record_deposit_record_receipt_information_titl',
            },
            t
          )}
        </div>
        <div className="gradient-line z-10"></div>
      </div>

      {/* state */}
      {defaultValues.state !== RechargeReceiptState.UNCOMPLETED ? (
        <div className="mb-3">
          <div className="flex justify-between">
            <div>
              {renderI18N(
                { i18nKey: 'balance_record_deposit_record_receipt_stat' },
                t
              )}
            </div>
            <div
              className={cx(
                'py-1 px-3 text-xs font-semibold',
                'rounded-full',
                backgroundColor[defaultValues.state].color
              )}
            >
              {renderI18N(
                { i18nKey: backgroundColor[defaultValues.state].text },
                t
              )}
            </div>
          </div>

          {defaultValues.state === RechargeReceiptState.REJECTED ? (
            <div className="text-sm font-medium bgi-text-[var(--state-error-main)]">
              {defaultValues.rejectMessage ||
                renderI18N(
                  {
                    i18nKey:
                      'balance_record_deposit_record_receipt_rejected_reason_default',
                  },
                  t
                )}
            </div>
          ) : null}
        </div>
      ) : null}

      <Form
        form={form}
        className="w-full"
        onFinish={() => {
          handleFullOrderDetailPageClick({
            actionName: handleFullOrderDetailPageConfirmClick,
          });
        }}
        onFinishFailed={(error) => {
          console.log(error);
        }}
        initialValues={defaultValues}
      >
        <div className="text-left text-base mb-1">
          <span
            className={cx({
              'bgi-text-[var(--grayscale-100)]': !isCompleted,
              'bgi-text-[var(--grayscale-50)]': isCompleted,
            })}
          >
            {renderI18N(
              { i18nKey: 'balance_record_deposit_record_receipt_labe' },
              t
            )}
          </span>
          <span className="ml-1 bgi-text-[var(--grayscale-50)]">
            (
            {renderI18N(
              { i18nKey: 'balance_record_deposit_record_receipt_label_full' },
              t
            )}
            )
          </span>
          {isCompleted ? null : (
            <span className="bgi-text-[var(--state-error-main)]">*</span>
          )}
        </div>
        <Form.Item
          name="confirmCode"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                FullOrderDetailValidator.confirmCode(value, t, 12),
            },
          ]}
        >
          <Input
            type="number"
            disabled={isCompleted}
            maxLength={22}
            minLength={12}
            placeholder={{
              i18nKey: 'balance_record_deposit_record_receipt_input_placeholde',
            }}
            styles={{
              containerDiv: '!py-2',
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
        <div className="text-left text-base mb-1">
          <span className="bgi-text-[var(--grayscale-100)]">
            {renderI18N(
              {
                i18nKey:
                  'balance_record_deposit_record_receipt_screenshot_label',
              },
              t
            )}
          </span>

          <span className="bgi-text-[var(--grayscale-50)]">
            (
            {renderI18N(
              {
                i18nKey:
                  'balance_record_deposit_record_receipt_screenshot_label_optiona',
              },
              t
            )}
            )
          </span>
        </div>
        <div className="flex items-center justify-center">
          {isCompleted && !defaultValues.receiptFileBase64 ? null : (
            <ImageUpload
              showBtn={showBtn}
              disabled={isCompleted}
              className={cx({ 'border-none': isCompleted })}
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

        {isCompleted ? null : (
          <div className="my-3 text-sm font-medium bgi-text-[var(--state-warn-main)]">
            {renderI18N(
              { i18nKey: 'balance_record_deposit_record_receipt_reminder' },
              t
            )}
          </div>
        )}
      </div>

      {isCompleted ? null : (
        <div className={cx('mt-6')}>
          <AffixBottomWrapper
            hasBottomNav
            offset={-3}
            affixContainerClass="bgi-[var(--bg-main)] -mx-4 w-screen p-4"
          >
            <div>
              <BasePrimaryBtn
                className={cx(
                  'text-base font-semibold',
                  'shadow-inner shadow-[inset_0_4px_4px_rgba(204,204,204,0.25),_inset_0_-4px_4px_rgba(51,51,51,0.25)]'
                )}
                debounceTimer={500}
                children={renderI18N(
                  {
                    i18nKey: 'balance_record_deposit_record_receipt_send_butto',
                  },
                  t
                )}
                onClick={() => form.submit()}
              />
            </div>
          </AffixBottomWrapper>
        </div>
      )}

      <LeaveModal
        content={renderI18N(
          {
            i18nKey:
              'balance_record_deposit_record_receipt_notice_popup_content',
          },
          t
        )}
        exitText={renderI18N(
          {
            i18nKey:
              'balance_record_deposit_record_receipt_notice_popup_leave_butto',
          },
          t
        )}
        page={BasePagePathObj.FullOrderDetailPage}
      />
    </div>
  );
};

export default FullOrderDetailPage;
