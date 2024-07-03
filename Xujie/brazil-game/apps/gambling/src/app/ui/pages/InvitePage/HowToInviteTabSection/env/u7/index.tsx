import { notification } from 'antd';
import { IHowToInviteTabSection } from '../..';
import { useBreakpoint } from '../../../../../pageTemplate/hooks/useBreakpoint';
import { environment } from '../../../../../../../environments/environment';
import { QuestionSection1 } from '../common/QuestionSection1';
import { QuestionSection2 } from '../common/QuestionSection2';
import { QuestionSection3 } from '../common/QuestionSection3';
import { appCopy } from '../../../../../utils/appCopy';
import { usePageNavigate } from 'apps/gambling/src/app/ui/router/hooks/usePageNavigate';
import cx from '../../../../../utils/cx';
import { BackNavigation } from '../../../../../components-bs/BackNavigation/BackNavigation';
import { PageContainer } from '../../../../../components-bs/PageContainer';
import React from 'react';
import { QuestionSection4 } from '../common/QuestionSection4';
import { useInviteConfig } from "../../../../../hooks/useInviteConfig";

export const HowToInviteTabSection = (props: IHowToInviteTabSection) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  // const [app, contextHolder] = notification.useNotification();
  const {currentConfig} = useInviteConfig();
  const isInvitationOpen = currentConfig ? currentConfig.isInvitationOpen : false
  const { onClickToIndex } = usePageNavigate();
  const onClickToCopy = () => {
    appCopy(props.inviteUrl);
    navigator.clipboard.writeText(props.inviteUrl);
    notification.success({
      message: 'Copiado!',
    });
  };

  //  複製分享連結部分
  const CopyLinkSection = () => {
    return (
      <div
        style={{ borderRadius: '999px', minHeight: isMobile ? '36px' : '40px' }}
        className={cx('border-stroke-popup-1 mt-3')}
      >
        <div
          className={cx(
            'bg-convidar flex justify-end items-center before:rounded-full'
          )}
        >
          <div className={'grow py-0 mobile:py-2 px-3 text-[10px] mob:text-xs mobile:text-sm leading-none'}>
            {props.inviteUrl}
          </div>
          <button
            disabled={props.inviteUrl === ''}
            style={{ width: 'auto', minHeight: isMobile ? '36px' : '40px' }}
            className={'grow-0 linear-1-button h-auto w-auto px-4'}
            onClick={() => {
              onClickToCopy();
            }}
          >
            <img
              className={'w-4 h-4 mr-1 brightness-200'}
              src={`assets/${environment.uVersion}/icon_copy.png`}
              alt="copy"
            />
            {'Cópia'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/*{contextHolder}*/}
      <PageContainer
        className={cx('mx-auto')}
        style={
          isMobile
            ? {
                backgroundImage: `url('assets/${environment.uVersion}/bg_invite_panel.png')`,
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }
            : {
                backgroundImage: isDesktop
                  ? ''
                  : `url('assets/${environment.uVersion}/bg_convide.png')`,
                backgroundPosition: 'center bottom', // 将垂直位置设置为底部
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }
        }
      >
        <BackNavigation
          className={cx('h-12 mobile:h-16', { hidden: isMobile })}
          // onClick={() => onClickToIndex()}
        />

        <div
          className={cx(
            'flex justify-between mobile:justify-center',
            'h-12 mobile:h-16 -mt-0 mobile:-mt-16',
            'font-bold text-sm mobile:text-base text-[var(--grayscale-80)] '
          )}
        >
          <button
            className={cx(
              'w-full mobile:w-auto px-4 mobile:px-10',
              'text-linear cursor-default',
              'border-b-2 border-[var(--grayscale-80)]'
            )}
          >
            {'Como convidar'}
          </button>

          <button
            className={cx(
              'w-full mobile:w-auto px-4 mobile:px-10',
              'hover:text-[var(--grayscale-100)]',
              'border-b-2 border-transparent'
            )}
            onClick={() => props.setPanelMode('daily')}
          >
            {'Dados diários'}
          </button>
        </div>

        <div
          style={{
            backgroundImage: isDesktop
              ? `url('assets/${environment.uVersion}/bg_convide.png')`
              : '',
            backgroundPosition: 'center bottom', // 将垂直位置设置为底部
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          className={cx(
            'w-full flex flex-col',
            'mt-0 mobile:mt-8 p-4 mobile:p-8 space-y-5 mobile:space-y-8',
            'items-center rounded-[20px]',
            'text-[var(--grayscale-100)]'
          )}
        >
          {/* title */}
          <img
            alt={'recommend-title'}
            src={`assets/${environment.uVersion}/img_recommend_title.png`}
            className={cx('h-[15px] mobile:h-7 tablet:h-8')}
          />

          {/* sub title */}
          <div className={'font-medium text-sm'}>
            {`Programa de recomendação exclusivo da plataforma ${environment.platformGroup}-${environment.platformName}, recomende aos amigos e ganhe comissões sem limite máximo! Esperamos sinceramente que mais jogadores se juntem a nós!`}
          </div>

          {/* steps */}
          {isInvitationOpen &&
            <div className={cx('w-full border-stroke-popup rounded-xl')}>
              <div
                className={cx(
                  'bg-convidar flex justify-between gap-x-5',
                  'p-4 mobile:p-5 rounded-xl',
                  isDesktop ? '' : 'flex-wrap'
                )}
              >
                {/* step.1 copy link */}

                <div className={cx('flex flex-col font-bold text-lg')}>

                  {!isDesktop &&
                    <p className={'text-linear text-center tablet:text-start'}>
                      {'Como Convidar'}
                    </p>
                  }

                  <p className={'text-linear text-start'}>
                    {'Passo 1 :'}
                  </p>
                  <p
                    className={
                      'mt-3 tablet:mt-0 font-medium mobile:font-bold text-sm mobile:text-lg'
                    }
                  >
                    {'Clique no botão para copiar o link do convite'}
                    {/*{isDesktop*/}
                    {/*  ? 'Clique no botão para copiar o link do convite'*/}
                    {/*  : 'Copie o link e envie para qualquer software de comunicação, envie para seus amigos'}*/}
                  </p>
                  <CopyLinkSection />
                </div>

                {/* line */}
                <div
                  className={cx(
                    // 'hidden tablet:block',
                    'rounded-lg m-4 tablet:m-2',
                    isDesktop
                      ? 'bg-gradient-to-b from-[var(--transparent-white-10)] from-30% via-[var(--transparent-white-90)] via-50% to-[var(--transparent-white-10)] to-70%'
                      : 'bg-gradient-to-l from-[var(--transparent-white-10)] from-30% via-[var(--transparent-white-90)] via-50% to-[var(--transparent-white-10)] to-70%'
                  )}
                  style={{
                    width: isDesktop ? '3px': '100% ',
                    height: isDesktop? 'auto' : '2px',
                    marginRight: isDesktop ? '' : '32px',
                    marginLeft: isDesktop ? '' : '32px',
                  }}
                />

                {/* step.2 share to social platforms */}
                <div
                  className={cx(
                    'flex flex-col font-bold text-lg'
                  )}
                >
                  <p className={'text-linear text-start'}>{'Passo 2 :'}</p>
                  <p className={'font-medium mobile:font-bold text-sm mobile:text-lg'}>{'Partilhar ligações através de software social'}</p>
                  <img
                    className={'h-11 w-auto mt-3 object-contain self-center tablet:self-start'}
                    alt={'social-media-logo'}
                    src={'assets/shared/pic_social_media_logo.png'}
                  />
                </div>
              </div>
            </div>
          }

          {/* explanatory img */}
          <img
            alt={'recommend-title'}
            src={`assets/${environment.uVersion}/bg_recommend_explanatory.png`}
            className={cx('px-0 mobile:px-8 tablet:px-[200px]')}
          />

          {/* question section 1 */}
          <div className="tablet:text-base text-sm font-normal text-xs mobile:text-sm tablet:text-base">
            <QuestionSection1 />
          </div>

          {/* question section 2 */}
          <div className={cx('w-full border-stroke-popup rounded-xl')}>
            <div
              className={cx(
                'bg-linear-4-main p-3 mobile:p-4 rounded-xl text-[var(--grayscale-90)] text-xs mobile:text-sm tablet:text-base'
              )}
            >
              <p>{'Por exemplo:'}</p>
              <QuestionSection2 isLineFeed={false} />
            </div>
          </div>

          {/* question section 3 */}
          <div
            className={
              ' w-full text-important text-xs mobile:text-sm tablet:text-base'
            }
          >
            <QuestionSection3 className="block" />
          </div>

          {/* question section 4 */}
          <QuestionSection4
            className={cx(
              'w-full bg-error rounded-xl p-3 mobile:p-4',
              'text-[var(--state-error-main)]',
              'text-xs mobile:text-sm tablet:text-base'
            )}
          />
        </div>
      </PageContainer>
    </>
  );
};
