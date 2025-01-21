import { ITableColumn } from '@components/Table';
import Icon from '@libs/mode2/components/Icon';
import { EResourceLevel, getImgUrl, formatMoney } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

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
            <span key={index} className="text-[#FFD000]">
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
      title: t('red_packets_rain_page_chart_title'),
      dataIndex: 'account',
      render: (record) => <span>{formatMoney(record.account)}</span>,
    },
    {
      title: t('red_packets_rain_page_chart_header_3'),
      dataIndex: 'bonusOdds',
      render: (record) => (
        <span className="text-[#FFA441]">{record.bonusOdds}%</span>
      ),
    },
  ];
  return redEnvelopeRainResult ? (
    <div className="w-full h-full bgi-[var(--bg-main)]">
      <div className="px-4 bgi-[var(--primary-10)] bgi-text-[var(--grayscale-100)] pt-3 pb-8">
        {/*<div className="fixed w-full left-1/2 -translate-x-1/2 top-0 max-w-96 mx-auto">*/}
        {/*  <div className="bgi-[var(--primary-20)] w-full h-11 flex justify-center items-center relative">*/}
        {/*    <Icon*/}
        {/*      className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"*/}
        {/*      name="ic_arrow_left_1"*/}
        {/*      onClick={() => {*/}
        {/*        sdkUtils.playSound();*/}
        {/*        navigate(-1);*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <span className="text-base font-semibold text-[var(--grayscale-100)]">*/}
        {/*      {t('red_packets_rain_state_default')}*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <img
          className="w-full"
          src={getImgUrl(EResourceLevel.V, 'activity_red_envelope_banner')}
          alt="banner"
        />
        <div className="mt-4 text-xs leading-6">
          <div className="flex gap-1">
            <div>1.</div>
            <TextKeywordMark
              i18next={{
                key: 'red_packets_rain_page_rules_1',
                options: {
                  account: formatMoney(redEnvelopeRainResult.maxRewardAmount),
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
                  account: formatMoney(redEnvelopeRainResult.maxRewardAmount),
                  account2: formatMoney(77777),
                  account3: formatMoney(66666),
                  account4: formatMoney(555),
                  account5: formatMoney(444),
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
                  account: formatMoney(redEnvelopeRainResult.maxRewardAmount),
                },
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <div className="text-base font-semibold text-center">
            {t('red_packets_rain_page_chart_title')}
          </div>
          <table className="bg-[#333333] rounded overflow-hidden w-full px-3 py-2 my-3 text-xs">
            <tbody className="">
              <tr className="text-center text-[#808080] h-10">
                {columns.map((item, index) => (
                  <td key={index}>{item.title}</td>
                ))}
              </tr>

              {redEnvelopeRainResult.displayConfig.rules.map((item, index) => (
                <tr key={index} className="even:bg-[#404040] text-center h-8">
                  {columns.map((c) => (
                    <td key={c.dataIndex}>
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
