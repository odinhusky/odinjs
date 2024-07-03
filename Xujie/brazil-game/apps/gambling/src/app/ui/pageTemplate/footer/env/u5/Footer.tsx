import React from 'react';
import { environment } from '../../../../../../environments/environment';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from 'classnames';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { useNavigate, useLocation } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useDispatch, useSelector } from 'react-redux';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from 'apps/gambling/src/app/reduxStore/gameSlice';
import { IFooter } from '../../types/IFooter';
import moment from 'moment';
import { useScrollToPartPageTemplate } from '../../../hooks/useScrollToPartPageTemplate';
import t from 'apps/gambling/src/assets/constant/lang';

interface FooterLogoUnit {
  id: string;
  order: number;
  src: string;
  link: string;
  containerClass?: string;
  imgClass?: string;
}

export const Footer = (props: IFooter) => {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const { onClickToLicense } = usePageNavigate();
  const location = useLocation();
  const current = moment();
  const dispatch = useDispatch();
  const { scrollToWindowTop } = useScrollToPartPageTemplate();

  // const isShowMobileFooter = props.showMobileFooter === undefined ? true : props.showMobileFooter;
  // const isShowDesktopFooter = props.showDesktopFooter === undefined ? true : props.showDesktopFooter;

  // NOTE: mobile footer expands
  // const [footerExpands, setFooterExpands] = useState({
  //   gameTypes: false,
  //   helpers: false
  // })
  // NOTE: mobile
  // const [footerTextExpand, setFooterTextExpand] = useState(false)

  const chunkArr = (arr: string[], sliceSize: number) => {
    const result: string[][] = [];
    for (let i = 0; i < arr.length; i += sliceSize) {
      result.push(arr.slice(i, i + sliceSize));
    }
    return result;
  };

  const label = useSelector((state: any) => state.gameList.label);
  const gameList = ['Salão', ...label];
  const chunkedGameList = chunkArr(gameList, isMobile ? 4 : 5);
  const footerLogoList: FooterLogoUnit[][] = [
    [
      {
        order: 1,
        id: 'google',
        src: 'assets/shared/footer-google.png',
        link: '',
      },
      {
        order: 2,
        id: 'interac',
        src: 'assets/shared/footer6.png',
        link: 'https://www.interac.ca/en/',
      },
      {
        order: 3,
        id: 'kiron',
        src: 'assets/shared/footer-kiron.png',
        link: '',
      },
      {
        order: 4,
        id: 'caleta',
        src: 'assets/shared/footer-caleta.png',
        link: '',
      },
      {
        order: 5,
        id: 'gc',
        src: 'assets/shared/footer-gaming-curacao.png',
        link: '',
      },
      {
        order: 6,
        id: '18+',
        src: 'assets/shared/footer-18+.png',
        link: '',
      },
      {
        order: 7,
        id: 'revolver',
        src: 'assets/shared/footer-revolver.png',
        link: '',
      },
    ],
    [
      {
        order: 8,
        id: 'gamecare',
        src: 'assets/shared/footer-gamCare.png',
        link: 'https://www.gamcare.org.uk/',
      },
      {
        order: 9,
        id: 'Merkug Gaming',
        src: 'assets/shared/footer-merkur.png',
        link: '',
      },
      {
        order: 10,
        id: 'skrill',
        src: 'assets/shared/footer-skrill.png',
        link: 'https://www.skrill.com/pt/',
      },
      {
        order: 11,
        id: 'evolution',
        src: 'assets/shared/footer-evolution.png',
        link: '',
      },
      {
        order: 12,
        id: 'elk',
        src: 'assets/shared/footer-elk.png',
        link: '',
      },
      {
        order: 13,
        id: 'evoplay',
        src: 'assets/shared/footer-evoplay.png',
        link: '',
      },
      {
        order: 14,
        id: 'begambleaware',
        src: 'assets/shared/footer-beGambleAware.png',
        link: 'https://www.begambleaware.org/',
      },
    ],
  ];

  const handleFilterClick = (gameName: string) => {
    if (location.pathname !== PageOrModalPathEnum.IndexPage) {
      navigate(PageOrModalPathEnum.IndexPage);
    }

    if (gameName !== 'Salão') {
      dispatch(
        gameSlice.actions.setIndexPagecurrentSelectLabel(
          gameName as indexPagecurrentSelectLabel
        )
      );
    } else {
      dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel('Todos'));
    }

    scrollToWindowTop();
  };

  return (
    <div>
      {/* RWD Footer */}
      <div
        className={cx(
          'flex justify-center',
          'border-t border-[var(--grayscale-30)]',
          'bg-[var(--main)]',
          'text-white',
          'px-4 py-5 md:p-8 lg:p-10',
          'footer-u5'
        )}
      >
        {/*h-[400px]*/}
        <div className={'md:flex gap-3 w-full'}>
          <section className="flex md:block w-full md:w-[170px] mb-3 md:mb-0 mr-5">
            <div className={'flex flex-col gap-3 w-full items-start'}>
              <div className="w-full md:w-auto text-white font-extrabold leading-6 text-base">
                Ajuda
              </div>
              <button
                className="w-full text-left underline md:w-auto text-sm text-[var(--grayscale-70)]"
                onClick={() =>
                  navigate(PageOrModalPathEnum.PrivacyAgreementPage)
                }
              >
                {t['privacyPolicy']}
              </button>
              <button
                className="w-full text-left underline md:w-auto text-sm text-[var(--grayscale-70)]"
                onClick={() => navigate(PageOrModalPathEnum.TermsOfService)}
              >
                {t['termsOfService']}
              </button>
              <button
                className="w-full text-left underline md:w-auto text-sm text-[var(--grayscale-70)]"
                onClick={() => navigate(PageOrModalPathEnum.VIPGradePage)}
              >
                {t['VIPLevelDescription']}
              </button>
            </div>

            <div className={'flex gap-3 w-full flex-wrap items-start md:mt-5'}>
              <div className="w-full md:w-auto text-white font-extrabold leading-6 text-base">
                Jogo
              </div>
              <div className="flex gap-3 w-full items-start">
                {chunkedGameList.map((gameList: string[], index: number) => {
                  return (
                    <div
                      key={`list-${index + 1}`}
                      className="flex flex-col gap-3 w-full items-start"
                    >
                      {gameList.map((gameName: string) => (
                        <button
                          key={gameName}
                          className="w-full text-left underline md:w-auto text-sm text-[var(--grayscale-70)]"
                          onClick={() => handleFilterClick(gameName)}
                        >
                          {gameName}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={'w-full md:w-auto flex-1'}>
            <div
              className={
                'flex justify-center md:justify-start gap-3 items-center mb-3'
              }
            >
              <img
                className={'w-5 h-5 md:w-6 md:h-6'}
                src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
              />
              <span className="text-sm md:text-base">
                {environment.platformName}
              </span>
            </div>

            <div
              className={cx(
                'flex-auto flex-nowrap',
                'text-xs text-ellipsis leading-4 text-[var(--grayscale-70)] text-center md:text-left',
                'h-16 md:h-28 overflow-auto lg:h-auto',
                'mb-3 md:mb-4 lg:mb-9'
                // {
                //   "max-h-24": !footerTextExpand
                // }
              )}
            >
              <div className="h-auto">
                {environment.platformName} é um excelente jogo de caça-níqueis
                online especialmente desenvolvido para os amantes de cassinos.
                Rege-se pelos princípios da concorrência leal e do controle
                legal local. Oferece aos jogadores com mais de 18 anos uma
                variedade de métodos de apostas diferentes e jogabilidade
                especial. Os jogadores só precisam escolher seu tipo de jogo de
                caça-níqueis preferido e, em seguida, fazer sua aposta, girar a
                máquina caça-níqueis para ter chances iguais de
                ganhar.Entendemos as preferências dos jogadores brasileiros, o
                que é uma das razões do nosso sucesso no mercado brasileiro.
                Forneça os tipos de jogos de caça-níqueis mais populares e
                métodos de jogo característicos, cada tipo de jogo tem seus
                recursos e métodos de jogo exclusivos para atender às
                necessidades de diferentes jogadores. Portanto, também
                fornecemos métodos de pagamento convenientes e excelente suporte
                ao cliente e atualizamos regularmente o conteúdo do jogo para
                garantir que os jogadores desfrutem da melhor experiência de
                jogo nos {environment.platformName} O {environment.platformName}{' '}
                oferece aos jogadores a experiência de usuário da mais alta
                qualidade. O design da interface do jogo é meticuloso,
                permitindo que os jogadores sintam a alta qualidade e
                sofisticação do jogo. Com belos efeitos sonoros, ele pode não
                apenas aumentar a tensão e a emoção do jogo, mas também
                proporcionar aos jogadores uma experiência audiovisual chocante.
                O jogo roda sem problemas, sem gaguejar ou travar. Também
                fornecemos uma interface de usuário amigável e operações fáceis
                de entender, tornando mais fácil para os jogadores começarem.
                Resumindo, você vem ao cassino do jogo{' '}
                {environment.platformName} para girar.
              </div>
            </div>

            {/* <div className='flex justify-center underline text-blue-500 mt-46'>
              <button onClick={()=>setFooterTextExpand(!footerTextExpand)}>{footerTextExpand ? 'jogue fora': 'ver tudo'}</button>
            </div> */}

            <div
              className={cx(
                'flex justify-between flex-wrap md:flex-nowrap',
                'mt-3 mb-4'
              )}
            >
              {footerLogoList.map(
                (itemArr: FooterLogoUnit[], index: number) => (
                  <div
                    key={`index=${index} ${itemArr[0].id}`}
                    className={cx('w-full md:w-1/2', 'flex justify-between', {
                      'md:mr-5': index === 1,
                    })}
                  >
                    {itemArr.map((item: FooterLogoUnit) => (
                      <div
                        key={item.id}
                        className={cx(
                          'footer-img-container',
                          'flex-wrap md:flex-wrap flex-1 flex items-center',
                          {
                            'mr-2 md:mr-5':
                              item.order !== footerLogoList.length,
                            'cursor-pointer': item.link,
                            'justify-center':
                              item.id !== 'google' &&
                              item.id !== 'begambleaware' &&
                              item.id !== 'gamecare' &&
                              item.id !== 'revolver',
                            'justify-start md:justify-center':
                              item.id === 'gamecare',
                            'justify-end md:justify-center':
                              item.id === 'revolver',
                            'justify-end md:mr-0': item.id === 'begambleaware',
                          }
                        )}
                        onClick={
                          item.link
                            ? () => {
                                window.open(item.link);
                              }
                            : () => {}
                        }
                      >
                        <img
                          className={cx('footer-img', `${item?.imgClass}`)}
                          src={item.src}
                          alt={`footer${item.order}`}
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
              {/* <img alt='footer1' className='h-7' src={`assets/shared/footer1.png`}/>
              <img alt='footer2' className='h-7' src={`assets/shared/footer2.png`}/>
              <img alt='footer3' className='h-7' src={`assets/shared/footer3.png`} onClick={()=>window.open('https://www.skrill.com/pt/')}/>
              <img alt='footer5' className='h-7' src={`assets/shared/footer5.png`} onClick={()=>window.open('https://www.begambleaware.org/')}/>
              <img alt='footer6' className='h-7' src={`assets/shared/footer6.png`} onClick={()=>window.open('https://www.interac.ca/en/')}/>
              <img alt='footer4' className='h-7' src={`assets/shared/footer4.png`} onClick={()=>window.open('https://www.gamcare.org.uk/')}/> */}
            </div>
            {/* <div className='flex justify-center mb-4'>
              <img alt='footer7' className='h-5' src={`assets/shared/footer7.png`}/>
            </div> */}

            {/* Licensed */}
            <div className="w-full mb-3 md:mb-4 md:flex">
              <div
                className="flex items-center justify-center cursor-pointer md:block mb-1.5 md:mb-0 md:mr-3 w-full md:w-8"
                onClick={() => {
                  onClickToLicense();
                }}
              >
                <img
                  src="assets/shared/footer-licensedBy.png"
                  className="w-5 md:w-8"
                  alt="Licensed Image"
                />
              </div>

              <div
                className={cx(
                  'w-full md:w-auto md:flex-1 lg:h-8',
                  'flex-auto flex-nowrap overflow-hidden lg:flex lg:items-center',
                  'text-xs text-ellipsis leading-4 text-[var(--grayscale-70)] text-center md:text-left'
                )}
              >
                {environment.platformName} is operated by Inbet Online Ltd
                (Commercial register of Curaçao no. 158191, Emancipatie
                Boulevard Dominico F. "Don" Martina 52, Curaçao) under the main
                gaming license #5517/JAZ.
              </div>
            </div>

            <div className="w-full text-center mb-4 leading-4 text-[var(--grayscale-70)]">
              <p>
                @ {current.year()} {window.location.host} All rights
              </p>
              <p>v{environment.appVersion}</p>
            </div>
          </section>
        </div>
      </div>

      {/* 撐開空間用的 */}
      <div className="tabber-space"></div>

      {/* Mobile Footer */}
      {
        // isMobile && isShowMobileFooter ? (
        //   <div className={cx(
        //     'flex justify-center text-white p-4 pb-[80px]',
        //     "bg-[var(--main)]",
        //   )}>
        //     <div className={"flex flex-col"}>
        //       <div className='mt-3 flex justify-center mb-4 flex-nowrap relative left-[-6px]'>
        //         <img alt='footer1' className='w-[6%] h-[89%] flex-1' src={`assets/shared/footer1.png`}/>
        //         <img alt='footer2' className='w-[16%] h-[60%] flex-1 mt-1' src={`assets/shared/footer2.png`} />
        //         <img alt='footer3' className='w-[16%] h-[72%] flex-1' src={`assets/shared/footer3.png`}  onClick={()=>window.open('https://www.skrill.com/pt/')}/>
        //         <img alt='footer4' className='w-[16%] h-[60%] flex-1 mt-1' src={`assets/shared/footer5.png`} onClick={()=>window.open('https://www.begambleaware.org/')}/>
        //         <img alt='footer6' className='w-[8%] h-[89%] flex-1' src={`assets/shared/footer6.png`}  onClick={()=>window.open('https://www.interac.ca/en/')}/>
        //         <img alt='footer4' className='w-[6%] h-[72%] flex-1 mt-0.5' src={`assets/shared/footer4.png`}  onClick={()=>window.open('https://www.gamcare.org.uk/')}/>
        //       </div>
        //       <div>
        //         <section className={"flex flex-col items-start"}>
        //           <button
        //             className='h-[44px] text-white w-full flex flex-row justify-between'
        //             onClick={() => {
        //             setFooterExpands({
        //               ...footerExpands,
        //               gameTypes: !footerExpands.gameTypes
        //             })
        //            }}
        //           >
        //             <span>Jogo</span>
        //             {!footerExpands.gameTypes ? <DownOutlined /> : <UpOutlined />}
        //           </button>
        //           {footerExpands.gameTypes === true && (
        //             <div className={"pl-4 flex flex-col items-start"}>
        //               {
        //                 gameList.map((gameName: string) => {
        //                   return (
        //                     <button className={"h-[44px]"} onClick={() => navigate(PageOrModalPathEnum.IndexPage)}>{gameName}</button>
        //                   )
        //                 })
        //               }
        //             </div>
        //           )}
        //         </section>
        //         <section className={"flex flex-col items-start"}>
        //           {/* 这里是你的内容 */}
        //           <button
        //             className='relative h-[20px] w-full flex flex-row justify-between'
        //             onClick={() => {
        //               setFooterExpands({
        //                 ...footerExpands,
        //                 helpers: !footerExpands.helpers
        //               })
        //             }}
        //           >
        //             <span className="relative z-10">Ajuda</span>
        //             {!footerExpands.helpers ? <DownOutlined /> : <UpOutlined />}
        //             <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ transform: 'translateY(50%)'}} />
        //           </button>
        //           {footerExpands.helpers === true && (
        //             <div className={"pl-4 flex flex-col items-start ml-6 mt-2"}>
        //               <div className={"h-[30px]"} onClick={()=>navigate(PageOrModalPathEnum.PrivacyAgreementPage)}>Politica de Privacidade</div>
        //               <div className={"h-[30px]"} onClick={()=>navigate(PageOrModalPathEnum.TermsOfService)}>Termos de Servico</div>
        //               <div className={"h-[30px]"} onClick={()=>navigate(PageOrModalPathEnum.VIPGradePage)}>Descrico do nivel VIP</div>
        //             </div>
        //           )}
        //         </section>
        //       </div>
        //       <section className={""}>
        //         <div className={cx("flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left", {
        //           "max-h-24": !footerTextExpand
        //         })}>
        //           &ensp;&ensp;{environment.platformName} é um excelente jogo de caça-níqueis online especialmente desenvolvido para os amantes de cassinos. Rege-se pelos princípios da concorrência leal e do controle legal local. Oferece aos jogadores com mais de 18 anos uma variedade de métodos de apostas diferentes e jogabilidade especial. Os jogadores só precisam escolher seu tipo de jogo de caça-níqueis preferido e, em seguida, fazer sua aposta, girar a máquina caça-níqueis para ter chances iguais de ganhar.
        //         </div>
        //         <div className={cx("flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left mt-4", {
        //           "max-h-0": !footerTextExpand
        //         })}>
        //           &ensp;&ensp;Entendemos as preferências dos jogadores brasileiros, o que é uma das razões do nosso sucesso no mercado brasileiro. Forneça os tipos de jogos de caça-níqueis mais populares e métodos de jogo característicos, cada tipo de jogo tem seus recursos e métodos de jogo exclusivos para atender às necessidades de diferentes jogadores. Portanto, também fornecemos métodos de pagamento convenientes e excelente suporte ao cliente e atualizamos regularmente o conteúdo do jogo para garantir que os jogadores desfrutem da melhor experiência de jogo nos {environment.platformName}.
        //         </div>
        //         <div className={cx("flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left mt-4", {
        //           "max-h-0": !footerTextExpand
        //         })}>
        //           &ensp;&ensp;O {environment.platformName} oferece aos jogadores a experiência de usuário da mais alta qualidade. O design da interface do jogo é meticuloso, permitindo que os jogadores sintam a alta qualidade e sofisticação do jogo. Com belos efeitos sonoros, ele pode não apenas aumentar a tensão e a emoção do jogo, mas também proporcionar aos jogadores uma experiência audiovisual chocante. O jogo roda sem problemas, sem gaguejar ou travar. Também fornecemos uma interface de usuário amigável e operações fáceis de entender, tornando mais fácil para os jogadores começarem.
        //         </div>
        //         <div className={cx("flex-auto flex-nowrap leading-6 text-ellipsis overflow-hidden text-left mt-4", {
        //           "max-h-0": !footerTextExpand
        //         })}>
        //           &ensp;&ensp;Resumindo, você vem ao cassino do jogo {environment.platformName} para girar.
        //         </div>
        //         <div className='flex justify-center underline text-blue-500 mt-46'>
        //           <button onClick={()=>setFooterTextExpand(!footerTextExpand)}>{footerTextExpand ? 'jogue fora': 'ver tudo'}</button>
        //         </div>
        //         <div className='mb-4'>@ 2023 {environment.platformName} All rights</div>
        //         <div className='flex justify-center mb-4'>
        //           <img alt='footer1' className='h-[13px]' src={`assets/${environment.uVersion}/footer7.png`}/>
        //         </div>
        //       </section>
        //     </div>
        //   </div>
        // ): null
      }
    </div>
  );
};
