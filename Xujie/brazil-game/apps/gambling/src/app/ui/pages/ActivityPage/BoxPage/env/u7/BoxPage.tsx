import { PageContainer } from '../../../../../components-bs/PageContainer';
import { IBoxPageProps } from '../../index';
import { CacheImage } from '../../../../../components/image/CacheImage';
import { ActivityTextContainer } from '../../../ActivityTextContainer';
import useBoxPage from '../../hooks/useBoxPage';
import { formatLocaleMoney } from '../../../../../utils/format';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import cx from '../../../../../utils/cx';
import { ActivityPageRouter } from '../../../index';
import { environment } from '../../../../../../../environments/environment';
import { CopyOutlined } from '@ant-design/icons';
import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { StepsContainer } from './StepsContainer';
import { RecordPage } from './RecordPage';
import { uiSlice } from 'apps/gambling/src/app/reduxStore/uiSlice';
import { useDispatch } from 'react-redux';
import { BackNavigation } from 'apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation';
import t from 'apps/gambling/src/assets/constant/lang';
import {
  FLEX_CENTER,
  XY_CENTER,
} from 'apps/gambling/src/assets/constant/style';
import { backgroundRepeat } from 'tailwindcss-classnames';

export const BoxPage = ({ internalBannerRes, fontConfig ,isFromActivity}: IBoxPageProps) => {
  const { onClickToActivity, onClickToIndex } = usePageNavigate();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  const {
    isInvitationOpen,
    bannerContent,
    inviteLink,
    inviteNum,
    recharge,
    betFlow,
    steps,
    contentHtml,
    onClickToClaim,
    onClickToCopy,
    contextHolder,
    recordOpen,
    setRecordOpen,
  } = useBoxPage();

  const dispatch = useDispatch();

  const handleRecordOpen = (isOpen: boolean) => {
    setRecordOpen(isOpen);
    dispatch(uiSlice.actions.setIsBackToBoxPage(!isOpen));
  };

  if (recordOpen)
    return (
      <RecordPage
        onClickToBack={() => {
          handleRecordOpen(false);
        }}
      />
    );

  const bgPath = `assets/${environment.uVersion}/${environment.mVersion}/internal_event_bg_treasures.png`;

  return (
    <PageContainer className="text-[var(--grayscale-100)] tablet:pb-12 pb-0 flex flex-col tablet:gap-8 gap-0">
      {contextHolder}

      {(!isFromActivity && !isMobile) &&
        <BackNavigation
          className={'text-base h-12 font-medium'}
          onClick={() => onClickToIndex()}
        />
      }

      <div
        className="relative w-full rounded-[20px] overflow-hidden tablet:pb-0 mobile:pb-[126px] pb-[118px] mobile:bg-[length:auto] bg-[length:350%]"
        style={{
          backgroundImage: `url(${bgPath})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      >
        <div
          className={cx('absolute left-0 top-0 w-full h-full z-[1]', {
            'bg-box-d': isDesktop,
            'bg-box-tOrm': isTablet || isMobile,
          })}
        />
        <div className="relative flex flex-col gap-8 py-12 mobile:px-8 px-4 z-[1]">
          <div className={cx(FLEX_CENTER)}>
            <img
              className="mobile:h-[104px] h-[86px]"
              src={`assets/${environment.uVersion}/${environment.mVersion}/internal_event_banner_treasures.png`}
              alt="title"
            />
          </div>
          <div className="tablet:text-lg mobile:text-base text-sm font-normal">
            {t['boxInternalTxt1']}
          </div>
          {/* 链接 */}
          {isInvitationOpen && (
            <div className="bg-linear-4-main border-popup-button before:rounded-lg flex flex-col mobile:gap-5 gap-3 rounded-lg mobile:p-5 p-3">
              <div className="mobile:text-lg text-base font-bold">
                {t['boxInternalCopyLinkTxt']}
              </div>
              <div className="bg-[var(--transparent-black-10)] border-popup-button rounded-full flex justify-between">
                <div className="text-xs w-full py-[10px] px-3 font-medium min-w-[10px]">
                  {inviteLink}
                </div>
                <button
                  className="linear-1-button border-amount-button flex gap-1 text-sm w-[90px] py-[9px] px-4 rounded-full font-bold"
                  onClick={onClickToCopy}
                >
                  <img
                    className="w-4 h-4"
                    src={`assets/${environment.uVersion}/icon_copy2.png`}
                    alt="copy"
                  />
                  {t['boxInternalCopyTxt']}
                </button>
              </div>
            </div>
          )}
          {/* 充值 下注信息 */}
          <div className="bg-linear-4-main border-popup-button before:rounded-lg flex flex-col gap-5 rounded-lg p-5">
            <div className="text-base font-bold">{t['boxInternalRuleTxt']}</div>
            <div className="mobile:text-lg text-sm text-[var(--transparent-white-70)] font-normal">
              {t['boxInternalWarnTxt']}
            </div>
            <div className="flex mobile:flex-row flex-col mobile:gap-5 gap-3">
              <div className="flex-1 flex flex-col gap-3 bg-[var(--grayscale-30)] rounded-lg p-3 text-center">
                <div className="mobile:text-xl text-base font-bold">
                  R$ {formatLocaleMoney(recharge)} {t['boxInternalOr']}
                </div>
                <div className="text-sm text-[var(--transparent-white-70)] font-medium">
                  {t['boxInternalRechargeTxt']}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 bg-[var(--grayscale-30)] rounded-lg p-3 text-center">
                <div className="mobile:text-xl text-base font-bold">
                  R$ {formatLocaleMoney(betFlow)} {t['boxInternalOr']}
                </div>
                <div className="text-sm text-[var(--transparent-white-70)] font-medium">
                  {t['boxInternalAnteTxt']}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-linear-4-main border-popup-button before:rounded-lg flex mobile:flex-row flex-col mobile:gap-8 gap-3 rounded-lg mobile:p-5 p-3">
            <div className="text-base font-bold w-full mobile:text-left text-center leading-9">
              {t['boxInternalInviteNumTxt'](inviteNum)}
            </div>
            <div className="flex flex-shrink-0 mobile:gap-5 gap-3 mobile:w-[260px] w-full h-9">
              <button
                className="linear-2-button border-popup-button text-sm w-full rounded-full font-bold"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                  });
                  handleRecordOpen(true);
                }}
              >
                {t['boxInternalDetail']}
              </button>
              <button
                className="linear-4-button border-popup-button text-sm w-full rounded-full font-bold"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                  });
                  onClickToActivity({ category: ActivityPageRouter.RECORD });
                }}
              >
                {t['boxInternalReg']}
              </button>
            </div>
          </div>
          {/* 宝箱 */}
          <StepsContainer steps={steps} onClickToClaim={onClickToClaim} />
          {/* 说明 */}
          <div className="border-popup-button bg-linear-4-main before:rounded-lg rounded-lg mobile:p-5 p-3">
            <p className="mobile:text-lg text-sm font-bold">
              {t['boxInternalActivityDescription']}:
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              className="mobile:text-base text-sm font-normal text-[var(--transparent-white-70)]"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
