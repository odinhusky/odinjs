import { ITableColumn } from '@components/Table';
import { EResourceLevel, getImgUrl, formatMoney } from '@libs/mode2/utils';
import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import { useTranslation } from 'react-i18next';

const TextKeywordMark = ({
  i18next,
}: {
  i18next: {
    key: string;
    options?: Record<string, string>;
  };
}) => {
  const { t } = useTranslation();
  const keywords = Object.keys(i18next.options || {}).map(
    (key) => i18next.options?.[key]
  );

  return (
    <span>
      {t(i18next.key, i18next.options)
        .split(new RegExp(`(${keywords.join('|')})`, 'g'))
        .map((part, index) =>
          keywords.find((v) => v === part) ? (
            <span key={index} className="bgi-text-[var(--base-1-main)]">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
    </span>
  );
};

interface ITableData {
  level: number;
  account: number;
  bonusOdds: number;
}

const RedEnvelopeRainRule = () => {
  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );
  const { t } = useTranslation();
  const columns: ITableColumn<ITableData>[] = [
    {
      title: t('red_packets_rain_page_chart_header_1'),
      dataIndex: 'level',
      render: (record) =>
        t('red_packets_rain_page_chart_level', { level: record.level }),
    },
    {
      title: t('red_packets_rain_page_chart_header_2'),
      dataIndex: 'account',
      render: (record) => <span>{formatMoney({ value: record.account })}</span>,
    },
    {
      title: t('red_packets_rain_page_chart_header_3'),
      dataIndex: 'bonusOdds',
      render: (record) => <span>{record.bonusOdds}%</span>,
    },
  ];
  return redEnvelopeRainResult ? (
    <div className="w-full h-full bgi-[var(--bg-main)]">
      <div className="bgi-[var(--primary-10)] bgi-text-[var(--grayscale-100)] pt-4 pb-8">
        <img
          className="w-full"
          src={getImgUrl(EResourceLevel.V, 'activity_red_envelope_banner')}
          alt="banner"
        />
        <div className="mt-4 text-sm leading-6">
          <div className="flex gap-1">
            <div>1.</div>
            <TextKeywordMark
              i18next={{
                key: 'red_packets_rain_page_rules_1',
                options: {
                  account: formatMoney({
                    value: redEnvelopeRainResult.maxRewardAmount,
                  }),
                },
              }}
            />
          </div>
          <div className="flex gap-1">
            <div>2.</div>
            <div>{t('red_packets_rain_page_rules_2')}</div>
          </div>
          <div className="flex gap-1">
            <div>3.</div>
            <div>{t('red_packets_rain_page_rules_3')}</div>
          </div>
          <div className="flex gap-1">
            <div>4.</div>
            <TextKeywordMark
              i18next={{
                key: 'red_packets_rain_page_rules_4',
                options: {
                  account: formatMoney({
                    value: redEnvelopeRainResult.maxRewardAmount,
                  }),
                  account2: formatMoney({ value: 77777 }),
                  account3: formatMoney({ value: 66666 }),
                  account4: formatMoney({ value: 555 }),
                  account5: formatMoney({ value: 444 }),
                },
              }}
            />
          </div>
          <div className="flex gap-1">
            <div>5.</div>
            <TextKeywordMark
              i18next={{
                key: 'red_packets_rain_page_rules_5',
                options: {
                  account: formatMoney({
                    value: redEnvelopeRainResult.maxRewardAmount,
                  }),
                },
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <div className="text-base font-semibold text-center">
            {t('red_packets_rain_page_chart_title')}
          </div>
          <table className="rounded overflow-hidden w-full px-3 py-2 my-2 text-sm">
            <tbody className="">
              <tr className="text-center h-8 bgi-[var(--base-2-variant8)]">
                {columns.map((item, index) => (
                  <td key={index} className="bgi-text-[var(--base-2-variant2)]">
                    {item.title}
                  </td>
                ))}
              </tr>

              {redEnvelopeRainResult.displayConfig.rules.map((item, index) => (
                <tr
                  key={index}
                  className=" text-center h-7 border-b border-[var(--transparent-white-10)]"
                >
                  {columns.map((c) => (
                    <td
                      key={c.dataIndex}
                      className="bgi-text-[var(--base-2-variant1)]"
                    >
                      {c.render?.(item) || item[c.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
};
export default RedEnvelopeRainRule;
