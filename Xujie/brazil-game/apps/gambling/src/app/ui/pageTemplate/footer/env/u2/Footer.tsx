import { environment } from '../../../../../../environments/environment';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from '../../../../utils/cx';
import React, { useState, useMemo } from 'react';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FooterLogo } from '../../../../components-bs/Logos/FooterLogo';
import { renderByRWD } from '../../../../utils/renderByRWD';
import { IFooter } from '../../types/IFooter';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { gameSlice } from '../../../../../reduxStore/gameSlice';
import { IGameType } from '../../../../drawers/MenuDrawer/env/u2/MenuDrawer';
import { useScrollToPartPageTemplate } from '../../../hooks/useScrollToPartPageTemplate';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { LazyCacheImage } from '../../../../components/image/LazyCacheImage';
import moment from 'moment';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

export const Footer = (props: IFooter) => {
  const navigate = useNavigate();
  const label = useSelector((state: any) => state.gameList.label);
  const token = AppLocalStorage.getItem(AppLocalStorageKey.token);

  const current = moment();

  const dispatch = useDispatch();

  // NOTE: mobile footer expands
  const [footerExpands, setFooterExpands] = useState({
    gameTypes: false,
    helpers: false,
  });
  // NOTE: mobile
  const [footerTextExpand, setFooterTextExpand] = useState(false);

  const device = useBreakpoint();

  const { onClickToCompanyProfile, onClickToIndex } = usePageNavigate();

  const { scrollToWindowTop } = useScrollToPartPageTemplate();

  const footerLogosRows = useMemo(
    () => [
      [
        {
          id: 1,
          img: 'footer-18+.png',
        },
        {
          id: 2,
          img: 'footer-gaming-curacao.png',
        },
        {
          id: 3,
          img: 'footer-skrill.png',
          url: 'https://www.skrill.com/pt/',
        },
        {
          id: 4,
          img: 'footer-beGambleAware.png',
          url: 'https://www.begambleaware.org/',
        },
        {
          id: 5,
          img: 'footer-interac.png',
          url: 'https://www.interac.ca/en/',
        },
        {
          id: 6,
          img: 'footer-gamCare.png',
          url: 'https://www.gamcare.org.uk/',
        },
        {
          id: 7,
          img: 'footer-google.png',
          url: '',
        },
      ],
      [
        {
          id: 8,
          img: 'footer-revolver.png',
        },
        {
          id: 9,
          img: 'footer-kiron.png',
        },
        {
          id: 10,
          img: 'footer-evolution.png',
        },
        {
          id: 11,
          img: 'footer-merkur.png',
        },
        {
          id: 12,
          img: 'footer-elk.png',
        },
        {
          id: 13,
          img: 'footer-caleta.png',
        },
        {
          id: 14,
          img: 'footer-evoplay.png',
        },
      ],
    ],
    []
  );

  return (
    <div>
      {renderByRWD(
        {
          mobile: (
            <div>
              {
                <div
                  className={cx(
                    'text-[var(--grayscale-70)] px-4 pt-8 pb-[80px] text-xs bg-[var(--grayscale-15)]'
                  )}
                >
                  <div className="w-full flex gap-3">
                    <section
                      className={'flex flex-col gap-3 items-start w-1/2'}
                    >
                      <div className="pb-3 text-white text-sm font-bold border-b border-[var(--grayscale-40)] w-full">
                        Jogo
                      </div>
                      {['Salão', ...label].map(
                        (gameType: IGameType | 'Salão', index: number) => {
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                onClickToIndex();
                                dispatch(
                                  gameSlice.actions.setIndexPagecurrentSelectLabel(
                                    gameType === 'Salão' ? 'Todos' : gameType
                                  )
                                );
                                scrollToWindowTop();
                              }}
                              className="text-xs"
                            >
                              {gameType}
                            </button>
                          );
                        }
                      )}
                    </section>

                    <section
                      className={
                        'flex flex-col gap-3 items-start w-1/2 text-xs'
                      }
                    >
                      <div className="text-white font-bold pb-3 text-sm border-b border-[var(--grayscale-40)] w-full">
                        Ajuda
                      </div>
                      <button
                        onClick={() =>
                          navigate(PageOrModalPathEnum.PrivacyAgreementPage)
                        }
                      >
                        Politica de Privacidade
                      </button>
                      <button
                        onClick={() =>
                          navigate(PageOrModalPathEnum.TermsOfService)
                        }
                      >
                        Termos de Servico
                      </button>
                      <button
                        onClick={() =>
                          navigate(PageOrModalPathEnum.VIPGradePage)
                        }
                      >
                        Descrico do nivel VIP
                      </button>
                    </section>
                  </div>

                  <section className="mt-3">
                    <div className={'flex gap-3 items-center mb-2'}>
                      <FooterLogo />
                      <span className="text-sm font-bold text-white">
                        {environment.platformName}
                      </span>
                    </div>

                    <div
                      className={cx(
                        'flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left',
                        {
                          'max-h-24': !footerTextExpand,
                        }
                      )}
                    >
                      {environment.platformName} é um excelente jogo de
                      caça-níqueis online especialmente desenvolvido para os
                      amantes de cassinos. Rege-se pelos princípios da
                      concorrência leal e do controle legal local. Oferece aos
                      jogadores com mais de 18 anos uma variedade de métodos de
                      apostas diferentes e jogabilidade especial. Os jogadores
                      só precisam escolher seu tipo de jogo de caça-níqueis
                      preferido e, em seguida, fazer sua aposta, girar a máquina
                      caça-níqueis para ter chances iguais de ganhar. Entendemos
                      as preferências dos jogadores brasileiros, o que é uma das
                      razões do nosso sucesso no mercado brasileiro. Forneça os
                      tipos de jogos de caça-níqueis mais populares e métodos de
                      jogo característicos, cada tipo de jogo tem seus recursos
                      e métodos de jogo exclusivos para atender às necessidades
                      de diferentes jogadores. Portanto, também fornecemos
                      métodos de pagamento convenientes e excelente suporte ao
                      cliente e atualizamos regularmente o conteúdo do jogo para
                      garantir que os jogadores desfrutem da melhor experiência
                      de jogo nos {environment.platformName}. O{' '}
                      {environment.platformName} oferece aos jogadores a
                      experiência de usuário da mais alta qualidade. O design da
                      interface do jogo é meticuloso, permitindo que os
                      jogadores sintam a alta qualidade e sofisticação do jogo.
                      Com belos efeitos sonoros, ele pode não apenas aumentar a
                      tensão e a emoção do jogo, mas também proporcionar aos
                      jogadores uma experiência audiovisual chocante. O jogo
                      roda sem problemas, sem gaguejar ou travar. Também
                      fornecemos uma interface de usuário amigável e operações
                      fáceis de entender, tornando mais fácil para os jogadores
                      começarem. Resumindo, você vem ao cassino do jogo{' '}
                      {environment.platformName} para girar.
                    </div>

                    <div className="flex justify-center underline text-blue-500 mt-46">
                      <button
                        onClick={() => setFooterTextExpand(!footerTextExpand)}
                      >
                        {!footerTextExpand ? 'Mostrar' : 'Colocar fora'}
                      </button>
                    </div>
                    {/*<div className='mb-4 text-center'>@ 2023 {environment.platformName} All rights</div>*/}
                  </section>

                  <div className="mt-3 w-full grid grid-cols-7 gap-2">
                    <LazyCacheImage
                      alt={'footer1'}
                      src={`assets/shared/footer-18+.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-gaming-curacao.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-skrill.png`}
                      onClick={() => window.open('https://www.skrill.com/pt/')}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-beGambleAware.png`}
                      onClick={() =>
                        window.open('https://www.begambleaware.org/')
                      }
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-interac.png`}
                      onClick={() => window.open('https://www.interac.ca/en/')}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-gamCare.png`}
                      onClick={() => window.open('https://www.gamcare.org.uk/')}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-google.png`}
                    />
                  </div>

                  <div className="mt-3 w-full grid grid-cols-7 gap-2">
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-revolver.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-kiron.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-evolution.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-merkur.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-elk.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-caleta.png`}
                    />
                    <LazyCacheImage
                      alt="footer1"
                      src={`assets/shared/footer-evoplay.png`}
                    />
                  </div>

                  <div className="flex mt-3 gap-5 items-center">
                    <img
                      alt="licensedBy"
                      className="w-10"
                      src={`assets/shared/footer-licensedBy.png`}
                      onClick={onClickToCompanyProfile}
                    />
                    <div className="text-xs font-medium text-[#BEBEBE]">
                      {environment.platformName} is operated by Inbet Online Ltd
                      (Commercial register of Curaçao no. 158191, Emancipatie
                      Boulevard Dominico F. "Don" Martina 52, Curaçao) under the
                      main gaming license #5517/JAZ.
                    </div>
                  </div>

                  <div className="mt-3 text-[var(--grayscale-70)] text-xs w-full text-center pb-10">
                    <p>
                      @ {current.year()} {window.location.host} All rights
                    </p>
                    <p>v{environment.appVersion}</p>
                  </div>
                </div>
              }
            </div>
          ),
          tablet: (
            <div className="bg-[var(--grayscale-15)] text-[var(--grayscale-70)] pt-8 px-8">
              <div className={'flex gap-4 w-full'}>
                <section className={'flex flex-col gap-3 items-start w-[44px]'}>
                  <div className="pb-3 text-white text-sm font-bold border-b border-[var(--grayscale-40)] w-full">
                    Jogo
                  </div>
                  {['Salão', ...label].map(
                    (gameType: IGameType | 'Salão', index: number) => {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            onClickToIndex();
                            dispatch(
                              gameSlice.actions.setIndexPagecurrentSelectLabel(
                                gameType === 'Salão' ? 'Todos' : gameType
                              )
                            );
                            scrollToWindowTop();
                          }}
                          className="text-xs"
                        >
                          {gameType}
                        </button>
                      );
                    }
                  )}
                </section>

                <section
                  className={
                    'flex flex-col gap-3 items-start w-[164px] text-xs'
                  }
                >
                  <div className="text-white font-bold pb-3 text-sm border-b border-[var(--grayscale-40)] w-full">
                    Ajuda
                  </div>
                  <button
                    onClick={() =>
                      navigate(PageOrModalPathEnum.PrivacyAgreementPage)
                    }
                  >
                    Politica de Privacidade
                  </button>
                  <button
                    onClick={() => navigate(PageOrModalPathEnum.TermsOfService)}
                  >
                    Termos de Servico
                  </button>
                  <button
                    onClick={() => navigate(PageOrModalPathEnum.VIPGradePage)}
                  >
                    Descrico do nivel VIP
                  </button>
                </section>

                <section className={'flex-1'}>
                  <div className={'flex gap-3 items-center mb-2'}>
                    <FooterLogo />
                    <span className="text-sm font-bold text-white">
                      {environment.platformName}
                    </span>
                  </div>

                  <div
                    className={cx(
                      'flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left',
                      {
                        'max-h-24': !footerTextExpand,
                      }
                    )}
                  >
                    {environment.platformName} é um excelente jogo de
                    caça-níqueis online especialmente desenvolvido para os
                    amantes de cassinos. Rege-se pelos princípios da
                    concorrência leal e do controle legal local. Oferece aos
                    jogadores com mais de 18 anos uma variedade de métodos de
                    apostas diferentes e jogabilidade especial. Os jogadores só
                    precisam escolher seu tipo de jogo de caça-níqueis preferido
                    e, em seguida, fazer sua aposta, girar a máquina
                    caça-níqueis para ter chances iguais de ganhar. Entendemos
                    as preferências dos jogadores brasileiros, o que é uma das
                    razões do nosso sucesso no mercado brasileiro. Forneça os
                    tipos de jogos de caça-níqueis mais populares e métodos de
                    jogo característicos, cada tipo de jogo tem seus recursos e
                    métodos de jogo exclusivos para atender às necessidades de
                    diferentes jogadores. Portanto, também fornecemos métodos de
                    pagamento convenientes e excelente suporte ao cliente e
                    atualizamos regularmente o conteúdo do jogo para garantir
                    que os jogadores desfrutem da melhor experiência de jogo nos{' '}
                    {environment.platformName}. O {environment.platformName}{' '}
                    oferece aos jogadores a experiência de usuário da mais alta
                    qualidade. O design da interface do jogo é meticuloso,
                    permitindo que os jogadores sintam a alta qualidade e
                    sofisticação do jogo. Com belos efeitos sonoros, ele pode
                    não apenas aumentar a tensão e a emoção do jogo, mas também
                    proporcionar aos jogadores uma experiência audiovisual
                    chocante. O jogo roda sem problemas, sem gaguejar ou travar.
                    Também fornecemos uma interface de usuário amigável e
                    operações fáceis de entender, tornando mais fácil para os
                    jogadores começarem. Resumindo, você vem ao cassino do jogo{' '}
                    {environment.platformName} para girar.
                  </div>

                  <div className="flex justify-center underline text-blue-500 mt-46">
                    <button
                      onClick={() => setFooterTextExpand(!footerTextExpand)}
                    >
                      {!footerTextExpand ? 'Mostrar' : 'Colocar fora'}
                    </button>
                  </div>
                  {/*<div className='mb-4 text-center'>@ 2023 {environment.platformName} All rights</div>*/}
                </section>
              </div>

              <div className="mt-5 w-full grid grid-cols-7 gap-5">
                <LazyCacheImage
                  alt={'footer1'}
                  src={`assets/shared/footer-18+.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-gaming-curacao.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-skrill.png`}
                  onClick={() => window.open('https://www.skrill.com/pt/')}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-beGambleAware.png`}
                  onClick={() => window.open('https://www.begambleaware.org/')}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-interac.png`}
                  onClick={() => window.open('https://www.interac.ca/en/')}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-gamCare.png`}
                  onClick={() => window.open('https://www.gamcare.org.uk/')}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-google.png`}
                />
              </div>

              <div className="mt-5 w-full grid grid-cols-7 gap-5">
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-revolver.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-kiron.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-evolution.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-merkur.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-elk.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-caleta.png`}
                />
                <LazyCacheImage
                  alt="footer1"
                  src={`assets/shared/footer-evoplay.png`}
                />
              </div>

              <div className="flex mt-5 gap-5">
                <img
                  alt="licensedBy"
                  className="w-10"
                  src={`assets/shared/footer-licensedBy.png`}
                  onClick={onClickToCompanyProfile}
                />
                <div className="text-sm font-medium text-[#BEBEBE]">
                  {environment.platformName} is operated by Inbet Online Ltd
                  (Commercial register of Curaçao no. 158191, Emancipatie
                  Boulevard Dominico F. "Don" Martina 52, Curaçao) under the
                  main gaming license #5517/JAZ.
                </div>
              </div>

              <div className="mt-5 text-[var(--grayscale-70)] text-xs w-full text-center pb-10">
                <p>
                  @ {current.year()} {window.location.host} All rights
                </p>
                <p>v{environment.appVersion}</p>
              </div>
            </div>
          ),
          desktop: (
            <div>
              {
                <div className="bg-[var(--grayscale-15)] text-[var(--grayscale-70)] pt-10 px-12">
                  <div className={'flex gap-5 w-full'}>
                    <section
                      className={'flex flex-col gap-3 items-start w-[82px]'}
                    >
                      <div className="pb-3 text-white text-lg font-bold border-b border-[var(--grayscale-40)] w-full">
                        Jogo
                      </div>
                      {['Salão', ...label].map(
                        (gameType: IGameType | 'Salão', index: number) => {
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                onClickToIndex();
                                dispatch(
                                  gameSlice.actions.setIndexPagecurrentSelectLabel(
                                    gameType === 'Salão' ? 'Todos' : gameType
                                  )
                                );
                                scrollToWindowTop();
                              }}
                              className="text-sm"
                            >
                              {gameType}
                            </button>
                          );
                        }
                      )}
                    </section>

                    <section
                      className={
                        'flex flex-col gap-3 items-start w-[183px] text-sm'
                      }
                    >
                      <div className="text-white font-bold pb-3 text-lg border-b border-[var(--grayscale-40)] w-full">
                        Ajuda
                      </div>
                      <button
                        onClick={() =>
                          navigate(PageOrModalPathEnum.PrivacyAgreementPage)
                        }
                      >
                        Politica de Privacidade
                      </button>
                      <button
                        onClick={() =>
                          navigate(PageOrModalPathEnum.TermsOfService)
                        }
                      >
                        Termos de Servico
                      </button>
                      <button
                        onClick={() => {
                          if (token) {
                            navigate(PageOrModalPathEnum.VIPGradePage);
                          } else {
                            dispatch(
                              appSlice.actions.showLoginDrawerOrModal(true)
                            );
                          }
                        }}
                      >
                        Descrico do nivel VIP
                      </button>
                    </section>

                    <section className={'flex-1'}>
                      <div className={'flex gap-3 items-center mb-2'}>
                        <FooterLogo />
                        <span className="text-lg font-bold text-white">
                          {environment.platformName}
                        </span>
                      </div>

                      <div
                        className={cx(
                          'flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left',
                          {
                            'max-h-24': !footerTextExpand,
                          }
                        )}
                      >
                        {environment.platformName} é um excelente jogo de
                        caça-níqueis online especialmente desenvolvido para os
                        amantes de cassinos. Rege-se pelos princípios da
                        concorrência leal e do controle legal local. Oferece aos
                        jogadores com mais de 18 anos uma variedade de métodos
                        de apostas diferentes e jogabilidade especial. Os
                        jogadores só precisam escolher seu tipo de jogo de
                        caça-níqueis preferido e, em seguida, fazer sua aposta,
                        girar a máquina caça-níqueis para ter chances iguais de
                        ganhar. Entendemos as preferências dos jogadores
                        brasileiros, o que é uma das razões do nosso sucesso no
                        mercado brasileiro. Forneça os tipos de jogos de
                        caça-níqueis mais populares e métodos de jogo
                        característicos, cada tipo de jogo tem seus recursos e
                        métodos de jogo exclusivos para atender às necessidades
                        de diferentes jogadores. Portanto, também fornecemos
                        métodos de pagamento convenientes e excelente suporte ao
                        cliente e atualizamos regularmente o conteúdo do jogo
                        para garantir que os jogadores desfrutem da melhor
                        experiência de jogo nos {environment.platformName}. O{' '}
                        {environment.platformName} oferece aos jogadores a
                        experiência de usuário da mais alta qualidade. O design
                        da interface do jogo é meticuloso, permitindo que os
                        jogadores sintam a alta qualidade e sofisticação do
                        jogo. Com belos efeitos sonoros, ele pode não apenas
                        aumentar a tensão e a emoção do jogo, mas também
                        proporcionar aos jogadores uma experiência audiovisual
                        chocante. O jogo roda sem problemas, sem gaguejar ou
                        travar. Também fornecemos uma interface de usuário
                        amigável e operações fáceis de entender, tornando mais
                        fácil para os jogadores começarem. Resumindo, você vem
                        ao cassino do jogo {environment.platformName} para
                        girar.
                      </div>

                      <div className="flex justify-center underline text-blue-500 mt-46">
                        <button
                          onClick={() => setFooterTextExpand(!footerTextExpand)}
                        >
                          {!footerTextExpand ? 'Mostrar' : 'Colocar fora'}
                        </button>
                      </div>
                      {/*<div className='mb-4 text-center'>@ 2023 {environment.platformName} All rights</div>*/}
                    </section>
                  </div>

                  {footerLogosRows.map((arr) => (
                    <div className="mt-5 w-full grid grid-cols-7 gap-5">
                      {arr.map((item, index, arr) => (
                        <div
                          key={item.id}
                          className={cx('w-full', FLEX_CENTER, {
                            'justify-start': index === 0,
                            'justify-end': index === arr.length - 1,
                            'cursor-pointer': item?.url,
                          })}
                          onClick={
                            item?.url
                              ? () => {
                                  window.open(item.url);
                                }
                              : () => {}
                          }
                        >
                          <LazyCacheImage
                            className="max-w-[145px] desk2:max-w-[154px]"
                            src={`assets/shared/${item.img}`}
                            alt={`footer image ${item.id}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="flex mt-5 gap-5">
                    <img
                      alt="licensedBy"
                      className="w-10 cursor-pointer"
                      src={`assets/shared/footer-licensedBy.png`}
                      onClick={onClickToCompanyProfile}
                    />
                    <div className="text-sm font-medium text-[#BEBEBE]">
                      {environment.platformName} is operated by Inbet Online Ltd
                      (Commercial register of Curaçao no. 158191, Emancipatie
                      Boulevard Dominico F. "Don" Martina 52, Curaçao) under the
                      main gaming license #5517/JAZ.
                    </div>
                  </div>

                  <div className="mt-5 text-[var(--grayscale-70)] text-xs w-full text-center pb-10">
                    <p>
                      @ {current.year()} {window.location.host} All rights
                    </p>
                    <p>v{environment.appVersion}</p>
                  </div>
                </div>
              }
            </div>
          ),
        },
        device
      )}
    </div>
  );
};
