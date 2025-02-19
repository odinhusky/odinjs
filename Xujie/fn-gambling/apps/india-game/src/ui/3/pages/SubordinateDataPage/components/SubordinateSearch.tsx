import Icon from '@components/Icon';
import Input from '@libs/mode2/components/Input';
import { formatDate } from '@libs/mode2/utils';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import useSubordinateDataClickActions, {
  ORDER,
} from '@mode2/action/subordinateDataAction/useSubordinateDataClickActions';
import {
  handleSubordinateDataDisplayDatePickerClick,
  handleSubordinateDataMobileInputValueChange,
  handleSubordinateDataMobileSearchClick,
  handleSubordinateDataSortByCommissionClick,
  handleSubordinateDataSortByJoinTimeClick,
} from '@libs/mode2/action/subordinateDataAction/actionType';
import { cx } from '@libs/commonUtils';
import { DatePicker } from '@libs/components/DatePicker';
import dayjs from 'dayjs';
import { t } from 'i18next';

export const SubordinateSearch = () => {
  const { handleSubordinateDataClick } = useSubordinateDataClickActions();
  const mobile = useMode2SubordinateDataPageStore((state) => state.mobile);
  const datePicker = useMode2SubordinateDataPageStore(
    (state) => state.datePicker
  );
  const sortByJoinTime = useMode2SubordinateDataPageStore(
    (state) => state.sortByJoinTime
  );
  const sortByCommission = useMode2SubordinateDataPageStore(
    (state) => state.sortByCommission
  );

  const setDatePicker = useMode2SubordinateDataPageStore(
    (state) => state.setDatePicker
  );

  const onDateChange = (date: Date) => {
    console.log('@@@===> onDateChange', date);
    setDatePicker(dayjs(date).unix());
  };

  return (
    <div
      className={cx(
        'w-full',
        'text-lg font-medium bgi-text-[var(--grayscale-100)]',
        'flex flex-col gap-3'
      )}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              handleSubordinateDataClick({
                actionName: handleSubordinateDataSortByJoinTimeClick,
              });
            }}
          >
            <p
              className={cx(
                sortByJoinTime === ORDER.DEFAULT
                  ? 'bgi-text-[var(--base-2-variant1)]'
                  : 'bgi-text-[var(--grayscale-100)]'
              )}
            >
              {t('earn_subordinate_data_sort_time')}
            </p>
            <Icon
              className={cx('w-4 h-4 ml-1.5', {
                'w-4 h-4': sortByJoinTime !== ORDER.DEFAULT,
                'rotate-180': sortByJoinTime === ORDER.ASC,
              })}
              name={
                sortByJoinTime === ORDER.DEFAULT
                  ? 'ic_up_and_down'
                  : 'ic_arrow_down_2'
              }
            />
          </div>

          <div
            className="flex items-center pl-3 cursor-pointer"
            onClick={() => {
              handleSubordinateDataClick({
                actionName: handleSubordinateDataSortByCommissionClick,
              });
            }}
          >
            <p
              className={cx(
                sortByCommission === ORDER.DEFAULT
                  ? 'bgi-text-[var(--base-2-variant1)]'
                  : 'bgi-text-[var(--grayscale-100)]'
              )}
            >
              {t('earn_subordinate_data_sort_commission')}
            </p>
            <Icon
              className={cx('w-4 h-4 ml-1.5', {
                'w-4 h-4': sortByCommission !== ORDER.DEFAULT,
                'rotate-180': sortByCommission === ORDER.ASC,
              })}
              name={
                sortByCommission === ORDER.DEFAULT
                  ? 'ic_up_and_down'
                  : 'ic_arrow_down_2'
              }
            />
          </div>
        </div>

        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            handleSubordinateDataClick({
              actionName: handleSubordinateDataDisplayDatePickerClick,
              payload: { isShow: true },
            });
          }}
        >
          <span>{formatDate(datePicker, 'DD.MM.YYYY')}</span>
          <Icon className="w-4 h-4 ml-1.5" name="ic_arrow_down_2" />
        </div>
        <DatePicker
          className="!bgi-[var(--base-2-variant14)]"
          pickerViewClassName="flex-row"
          btnsClassName="justify-center gap-12"
          btnCommonClassName="!w-[166px] h-12 flex-none rounded-md active:transition active:duration-300 active:scale-95"
          primaryBtnClassName={cx('bgi-[var(--base-1-variant3)]')}
          primaryTextClassName="bgi-text-[var(--base-2-variant5)]"
          secondaryBtnClassName={cx('!bgi-[var(--base-2-variant5)]')}
          secondaryTextClassName=""
          onDateChange={onDateChange}
        />
      </div>

      <Input
        type="number"
        value={mobile}
        suffix={
          <Icon
            className="w-6 h-6"
            name="ic_search"
            onClick={() => {
              handleSubordinateDataClick({
                actionName: handleSubordinateDataMobileSearchClick,
              });
            }}
          />
        }
        styles={{
          containerDiv:
            '!bgi-[var(--transparent-white-10)] !py-2 !px-3 !rounded-lg',
          input: '!text-xs !p-0 mobile:!text-sm',
        }}
        onChange={(e) => {
          handleSubordinateDataClick({
            actionName: handleSubordinateDataMobileInputValueChange,
            payload: { value: e },
          });
        }}
        placeholder={{ i18nKey: 'earn_subordinate_data_search_hint' }}
      />
    </div>
  );
};
