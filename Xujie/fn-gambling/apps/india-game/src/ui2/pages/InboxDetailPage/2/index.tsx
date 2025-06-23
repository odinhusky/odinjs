import { cx, useGivenTimeCountDown } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
  patternBgStyle,
} from '@libs/constant/style';
import useInboxDetailPageStore, { useMode2FeedBackPageInBoxStore } from '@libs/mode2/zustand/page/feedbackPageStore';
import {
  EResourceLevel,
  formatCountdownTime,
  formatDate,
  getImgUrl,
} from '@libs/mode2/utils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import './index.scss';
import InnerHtmlWrapper from '@components/InnerHtmlWrapper';
import useInboxDetailInnerClickBase from '../useInboxDetailInnerClickBase';
import useMode2InboxDetailPageBase from '@libs/mode2/usecase/page/inboxDetailPage/useMode2InboxDetailPageBase';

// // 模板1
// const MockTemplate1String =
//   '<div class="template-1">' +
//   '<img alt="{{img}}" src="https://static.ttgroup.vip/in/v6/home_banner/banner_club.webp" />' +
//   '<div>' +
//   '<p>Get bouns now for posting and sharing</p>' +
//   '<br/>' +
//   '<p>Please keep your post on social media for at least 2 hours and make sure it is set to public. You can participate in the activity every day!</p>' +
//   '<br/>' +
//   '<p>Activity time: {{8:00 AM}} - {{22:00 PM}}</p>' +
//   '<p>Free bonus: ₹{{28 -88}}</p>' +
//   '<p>All members are welcome to join!</p>' +
//   '<br/>' +
//   '<p>Contact us below to participate now and claim your rewards!</p>' +
//   '<br/>' +
//   '<a class="inner-tg-link" >Telegram Chat</a>' +
//   '<br/>' +
//   '<br/>' +
//   '<a class="inner-service-link" >{{AAGAME}} Online service</a>' +
//   '<br/>' +
//   '<br/>' +
//   '</div>' +
//   '</div>';

// // 模板2
// const MockTemplate2String =
//   '<div class="template-2 ql-container">' +
//   '<p class="title">Please identify the official platform of <span>{{product name}}</span></p>' +
//   '<p class="content">There are many fake platforms pretending to be {{AA Game}} on the market. Please be vigilant and beware of being deceived. Do not believe any misleading words that imitate the platform.</p>' +
//   '</br>' +
//   '<p>text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text</p>' +
//   '</br>' +
//   '<p>text text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text texttext text text text text text text text text text text text text text text</p>' +
//   '</br>' +
//   '</div>';

// // 模板3
// const MockTemplate3String =
//   '<div class="template-3">' +
//   '<p>Dear VIP.</p>' +
//   '<br/>' +
//   '<p>✨Lucky Monday Arrives! Congrats on winning the {{₹17}}</p>' +
//   '<p>Lucky Return to Game Bonus!</p>' +
//   '<p>You have been selected as one of our Lucky Winners! This letter is specially prepared to express our heartfelt thanks for your participation and support!</p>' +
//   '<br/>' +
//   '<p>🎉{{₹17}} Bonus Lucky Come Back Game Draw</p>' +
//   '<p>This bonus is awarded to only {{100}} lucky users, and your good fortune has brought us great joy!</p>' +
//   '<p>Please click the "Claim {{₹1000}}" button below, and you can receive the ₹10 bonus after your first deposit!</p>' +
//   '<p>🏅This week, {{100}} lucky users will have a chance to win an additional {{₹17}} bonus each day! Continue your gaming journey, and you might be the next lucky winner!</p>' +
//   '<br/>' +
//   '<p>🍀 Lucky {{2%}} Cashback Bonus</p>' +
//   '<p>Act now and get an extra reward of {{₹1000}}+{{₹17}} = {{₹1017}}</p>' +
//   '<p>Deposit {{₹500}}, get {{₹10}} back</p>' +
//   '<p>Deposit {{₹5000}}, get {{₹100}} back</p>' +
//   '<p>Deposit {{₹50000}}, get {{₹1000}} back</p>' +
//   "<p>🎁 Today, don't miss this fantastic opportunity to boost your funds with our Lucky {{2%}} Cashback Bonus! After your deposit is complete, please remember to return to this page to claim your {{₹17}} Bonus!</p>" +
//   '<br/>' +
//   '<p>Thank you for your continued support and loyalty! We sincerely apologize for any inconvenience caused to your game deposit experience due to banking network issues in the past.</p>' +
//   '<br/>' +
//   '<p>We look forward to you continuing to enjoy the game!</p>' +
//   '<br/>' +
//   '<a class="inner-operations-team-link" >The {{Product name}} Operations Team</a>' +
//   '<br/>' +
//   '<br/>' +
//   '</div>';

export const InboxDetailPage = () => {
  useInboxDetailInnerClickBase();
  useMode2InboxDetailPageBase();
  const { t } = useTranslation();

  const inboxDetail = useInboxDetailPageStore(
    (state) => state.inboxDetail
  );

  const buttonList = useMode2FeedBackPageInBoxStore(
    (state) => state.buttonList
  );

  const { isCountEnd, remainSec } = useGivenTimeCountDown({
    targetDate: new Date(inboxDetail.expireTime * 1000),
    onEnd: () => console.log('Happy New Year!'),
  });

  return (
    <div className={cx('w-full h-full bgi-[var(--background-light)]')}>
      <div className={cx('pt-4 box-border')}>
        {/* 標題 */}
        <div className={cx('')}>
          {inboxDetail.reward > 0 ? (
            <img
              src={getImgUrl(EResourceLevel.ICONS, 'ic_mail_benefits')}
              alt="ic_mail_benefits"
              className="w-6 h-6 mr-1 inline-block align-top"
            />
          ) : null}
          <span
            className={cx(
              'text-xl font-medium break-all',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {inboxDetail.title}
          </span>
        </div>

        {/* 時間 */}
        <div
          className={cx(
            'pb-2 box-border text-base font-medium',
            'bgi-text-[var(--base-2-variant2)]',
            'border-b border-[var(--base-2-variant6)]'
          )}
        >
          {formatDate(inboxDetail.createdAt, 'YYYY-MM-DD HH:mm:ss')}
        </div>

        {/* 分隔線 */}
        <div className={cx('bgi-[var(--title-line)] w-full h-[2px]')}></div>

        {/* 內容 */}
        <InnerHtmlWrapper
          className={cx(
            'mb-auto !p-0',
            'bgi-text-[var(--grayscale-90)] text-sm font-medium',
            'break-words whitespace-pre-wrap' // whitespace-pre-wrap 保留原始空格和換行 API回應的格式有兩種，純文字複製的格式需要whitespace-pre-wrap
          )}
          __html={inboxDetail.content}
        />

        {/* 獎勵領取 */}
        {inboxDetail.isShowAttachments ? (
          <div
            className={cx(
              'pt-3 pb-[14px] my-5',
              'text-xs text-center',
              FLEX_CENTER,
              FLEX_COL
            )}
            style={patternBgStyle}
          >
            <div
              className={cx(
                'w-28 h-28',
                FLEX_CENTER,
                FLEX_COL,
                'bgi-[var(--base-2-variant11)] rounded-md relative'
              )}
            >
              {/* 锁定提示 */}
              {inboxDetail.isLock === 1 ? (
                <>
                  <Icon
                    name="ic_mail_bonus_locked"
                    className={cx('w-28 h-28', 'absolute top-0 left-0')}
                    imgClassName={cx('w-28 h-28 max-w-full max-h-full')}
                  />
                  <Icon
                    name="ic_lock_1"
                    className={cx('w-9 h-9', 'absolute')}
                  />
                </>
              ) : null}

              <Icon
                name={
                  inboxDetail.isClaim === 1
                    ? 'ic_my_bonus_rewards_2'
                    : 'ic_my_bonus_rewards_1'
                }
                className="w-14 h-14"
              />
              <p className="mt-1.5 text-lg font-medium bgi-text-[var(--base-1-main)]">
                ₹{inboxDetail.reward}
              </p>
              <p className="pb-1 bgi-text-[var(--base-2-variant2)]">
                {t('deposit_history_deposit_amount')}
              </p>
            </div>
            <div className="mt-2.5 bgi-text-[var(--base-2-variant2)]">
              {inboxDetail.isExpired || isCountEnd ? null : (
                <p>
                  {t('inbox_receiving_reminder')}{' '}
                  {formatCountdownTime(remainSec!)}
                </p>
              )}
              <p>{t('inbox_receiving_reminder_2')}</p>
            </div>
          </div>
        ) : null}

        {/* 如果有底部按鈕，做一個佔位 */}
        {buttonList.length > 0 ? <div className="h-20"></div> : null}
      </div>

      {/* 底部按鈕 */}
      {buttonList.length > 0 ? (
        <div
          className={cx(
            MOBILE_BREAK_POINT_MAX_WIDTH,
            FLEX_CENTER,
            'w-screen -ml-4',
            'fixed bottom-0 z-10',
            'gap-4 py-4 box-border bgi-[var(--base-2-variant5)]'
          )}
        >
          {buttonList.map((item, index) => {
            return (
              <div key={'item' + item.text + index}>
                {item.text && index === 0 ? (
                  <BaseSecondaryBtn
                    children={item.text}
                    className={cx('w-44 h-12 !bg-shadow-[var(--box-shadow-6)]')}
                    classNameText="text-lg"
                    onClick={item.onClick}
                  />
                ) : null}
                {item.text && index === 1 ? (
                  <BasePrimaryBtn
                    children={item.text}
                    className={cx(
                      'w-44 h-12 !bg-shadow-[var(--button-shadow-50)]'
                    )}
                    classNameText="text-lg"
                    onClick={item.onClick}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default InboxDetailPage;
