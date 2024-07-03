import React, { useState } from 'react';
import { environment } from '../../../../../../environments/environment';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { useLocation, useNavigate } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useDispatch, useSelector } from 'react-redux';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from 'apps/gambling/src/app/reduxStore/gameSlice';
import { IFooter } from '../../types/IFooter';
import moment from 'moment';
import { useScrollToPartPageTemplate } from '../../../hooks/useScrollToPartPageTemplate';
import cx from '../../../../utils/cx';
import { CacheImage } from '../../../../components/image/CacheImage';

interface FooterLogoUnit {
  id: string;
  order: number;
  src: string;
  link: string;
  containerClass?: string;
  imgClass?: string;
}

export const Footer = (props: IFooter) => {
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const { onClickToGameHall } = usePageNavigate();
  const location = useLocation();
  const current = moment();
  const dispatch = useDispatch();
  const { scrollToCarousel } = useScrollToPartPageTemplate();
  const [exhibit, setExhibit] = useState<boolean>(false);
  const chunkArr = (arr: string[], sliceSize: number) => {
    const result: string[][] = [];
    for (let i = 0; i < arr.length; i += sliceSize) {
      result.push(arr.slice(i, i + sliceSize));
    }
    return result;
  };

  const label = useSelector((state: any) => state.gameList.label);
  const gameList = ['Salão', ...label, 'Favoritos', 'Registro'];
  const chunkedGameList = chunkArr(gameList, 6);

  const footerLogoList: FooterLogoUnit[] = [
    {
      order: 1,
      id: 'google',
      src: 'assets/shared/footer-google.png',
      link: '',
    },
    {
      order: 2,
      id: 'revolver',
      src: 'assets/shared/footer-revolver.png',
      link: '',
    },
    {
      order: 3,
      id: 'evolution',
      src: 'assets/shared/footer-evolution.png',
      link: '',
    },
    {
      order: 4,
      id: 'kiron',
      src: 'assets/shared/footer-kiron.png',
      link: '',
    },
    {
      order: 5,
      id: 'Merkug Gaming',
      src: 'assets/shared/footer-merkur.png',
      link: '',
    },
    {
      order: 6,
      id: 'elk',
      src: 'assets/shared/footer-elk.png',
      link: '',
    },
    {
      order: 7,
      id: 'caleta',
      src: 'assets/shared/footer-caleta.png',
      link: '',
    },
    {
      order: 8,
      id: 'evoplay',
      src: 'assets/shared/footer-evoplay.png',
      link: '',
    },
  ];
  const footerLogoList2: FooterLogoUnit[] = [
    {
      order: 1,
      id: '18+',
      src: 'assets/shared/footer-18+.png',
      link: '',
    },
    {
      order: 2,
      id: 'gc',
      src: 'assets/shared/footer-gaming-curacao.png',
      link: '',
    },
    {
      order: 3,
      id: 'skrill',
      src: 'assets/shared/footer-skrill.png',
      link: 'https://www.skrill.com/pt/',
    },
    {
      order: 4,
      id: 'begambleaware',
      src: 'assets/shared/footer-beGambleAware.png',
      link: 'https://www.begambleaware.org/',
    },
    {
      order: 5,
      id: 'interac',
      src: 'assets/shared/footer6.png',
      link: 'https://www.interac.ca/en/',
    },
    {
      order: 6,
      id: 'gamecare',
      src: 'assets/shared/footer-gamCare.png',
      link: 'https://www.gamcare.org.uk/',
    },
  ];

  const platformIntroduction: string = !exhibit
    ? `${environment.platformName} é um excelente jogo de caça-níqueis online especialmente 
        desenvolvido para os amantes de cassinos. Rege-se pelos princípios da concorrência 
        leal e do controle legal local. Oferece aos jogadores com mais de 18 anos uma variedade 
        de métodos de apostas diferentes e jogabilidade especial. Os jogadores só precisam 
        escolher seu tipo de jogo de caça-níqueis preferido e, em seguida, fazer sua aposta, 
        girar a máquina caça-níqueis para ter chances iguais de ganhar.... `
    : `${environment.platformName} é um excelente jogo de caça-níqueis online especialmente 
        desenvolvido para os amantes de cassinos. Rege-se pelos princípios da concorrência 
        leal e do controle legal local. Oferece aos jogadores com mais de 18 anos uma variedade 
        de métodos de apostas diferentes e jogabilidade especial. Os jogadores só precisam 
        escolher seu tipo de jogo de caça-níqueis preferido e, em seguida, fazer sua aposta, 
        girar a máquina caça-níqueis para ter chances iguais de ganhar. Entendemos as preferências 
        dos jogadores brasileiros, o que é uma das razões do nosso sucesso no mercado brasileiro. 
        Forneça os tipos de jogos de caça-níqueis mais populares e métodos de jogo característicos, 
        cada tipo de jogo tem seus recursos e métodos de jogo exclusivos para atender às necessidades 
        de diferentes jogadores. Portanto, também fornecemos métodos de pagamento convenientes e 
        excelente suporte ao cliente e atualizamos regularmente o conteúdo do jogo para garantir 
        que os jogadores desfrutem da melhor experiência de jogo nos ${environment.platformName} O 
        ${environment.platformName} oferece aos jogadores a experiência de usuário da mais alta 
        qualidade. O design da interface do jogo é meticuloso, permitindo que os jogadores sintam 
        a alta qualidade e sofisticação do jogo. Com belos efeitos sonoros, ele pode não apenas aumentar 
        a tensão e a emoção do jogo, mas também proporcionar aos jogadores uma experiência audiovisual chocante. 
        O jogo roda sem problemas, sem gaguejar ou travar. Também fornecemos uma interface de usuário amigável 
        e operações fáceis de entender, tornando mais fácil para os jogadores começarem. Resumindo, você vem ao 
        cassino do jogo ${environment.platformName} para girar.`;

  // {environment.platformName} é um excelente jogo de caça-níqueis online especialmente desenvolvido para os amantes de cassinos. Rege-se pelos princípios da concorrência leal e do controle legal local. Oferece aos jogadores com mais de 18 anos uma variedade de métodos de apostas diferentes e jogabilidade especial. Os jogadores só precisam escolher seu tipo de jogo de caça-níqueis preferido e, em seguida, fazer sua aposta, girar a máquina caça-níqueis para ter chances iguais de ganhar.Entendemos as preferências dos jogadores brasileiros, o que é uma das razões do nosso sucesso no mercado brasileiro. Forneça os tipos de jogos de caça-níqueis mais populares e métodos de jogo característicos, cada tipo de jogo tem seus recursos e métodos de jogo exclusivos para atender às necessidades de diferentes jogadores. Portanto, também fornecemos métodos de pagamento convenientes e excelente suporte ao cliente e atualizamos regularmente o conteúdo do jogo para garantir que os jogadores desfrutem da melhor experiência de jogo nos {environment.platformName} O {environment.platformName} oferece aos jogadores a experiência de usuário da mais alta qualidade. O design da interface do jogo é meticuloso, permitindo que os jogadores sintam a alta qualidade e sofisticação do jogo. Com belos efeitos sonoros, ele pode não apenas aumentar a tensão e a emoção do jogo, mas também proporcionar aos jogadores uma experiência audiovisual chocante. O jogo roda sem problemas, sem gaguejar ou travar. Também fornecemos uma interface de usuário amigável e operações fáceis de entender, tornando mais fácil para os jogadores começarem. Resumindo, você vem ao cassino do jogo {environment.platformName} para girar.

  const handleFilterClick = (gameName: string) => {
    if (location.pathname !== PageOrModalPathEnum.GameHallPage) {
      navigate(PageOrModalPathEnum.GameHallPage);
    }
    let payload = gameName === 'Salão' ? 'Todos' : gameName;
    dispatch(
      gameSlice.actions.setIndexPagecurrentSelectLabel(
        payload as indexPagecurrentSelectLabel
      )
    );
    scrollToCarousel();

    
  };

  return (
    <div
      className="bg-footer flex text-[var(--grayscale-80)] border border-solid border-[var(--grayscale-30)] 
        px-[2.5%] tablet:pt-10 tablet:pb-[25px] mobile:pt-8 pt-5 pb-16
        justify-center items-centerfont-medium"
    >
      <div
        className={cx(
          'flex justify-center items-start tablet:gap-3 gap-5 max-w-[1200px]',
          'pb-6 mobile:pb-10 tablet:pb-0',
          'tablet:flex-row flex-col'
        )}
      >
        {/* logoList */}
        <div className="w-full flex gap-[15px] tablet:hidden justify-between items-center">
          {footerLogoList2.map((item: FooterLogoUnit, index: number) => {
            return (
              <div
                key={index}
                className={cx('w-full', {
                  'cursor-pointer active:brightness-75 hover:brightness-125':
                    item.link,
                })}
                onClick={() => {
                  item.link && window.open(item.link);
                }}
              >
                <CacheImage
                  className={'max-h-6'}
                  alt={item.id}
                  src={item.src}
                />
              </div>
            );
          })}
        </div>
        {/* select */}
        <div
          className={cx(
            'flex flex-none grid grid-cols-2 gap-3 tablet:w-[42%] w-full',
            isMobile ? 'w-full' : ''
          )}
        >
          {/*Jogo*/}
          <div className={cx('flex flex-col gap-3 items-start')}>
            <div className="w-full text-[var(--grayscale-60)] bg-footer-title">
              Jogo
            </div>
            <div className="flex gap-3 w-full items-start justify-between">
              {chunkedGameList.map((gameList: string[], index: number) => {
                return (
                  <div
                    key={`list-${index + 1}`}
                    className="flex flex-col gap-3 items-start w-full"
                  >
                    {gameList.map((gameName: string) => (
                      <button
                        key={gameName}
                        className="w-full text-left active:brightness-75 hover:brightness-125"
                        // onClick={() => handleFilterClick(gameName)}
                        onClick={() => {
                          dispatch(
                            gameSlice.actions.setIndexPagecurrentSelectLabel(
                              gameName as indexPagecurrentSelectLabel
                            )
                          )
                          // if(location.pathname === PageOrModalPathEnum.IndexPage) {
                          //   // 從首頁跳到游戲大廳
                          //   onClickToGameHall()
                          // }
                          onClickToGameHall();
                          window.scrollTo({
                            top: 0,
                            left: 0,
                          });
                        }}
                      >
                        {gameName}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/*Ajuda*/}
          <div className={cx('flex flex-col gap-3 items-start ')}>
            <div className="w-full text-[var(--grayscale-60)] bg-footer-title">
              Ajuda
            </div>
            <button
              className="w-full text-left md:w-auto active:brightness-75 hover:brightness-125"
              onClick={() => navigate(PageOrModalPathEnum.PrivacyAgreementPage)}
            >
              Politica de Privacidade
            </button>
            <button
              className="w-full text-left md:w-auto active:brightness-75 hover:brightness-125"
              onClick={() => navigate(PageOrModalPathEnum.TermsOfService)}
            >
              Termos de Servico
            </button>
            <button
              className="w-full text-left md:w-auto  active:brightness-75 hover:brightness-125"
              onClick={() => navigate(PageOrModalPathEnum.VIPGradePage)}
            >
              Descrico do nivel VIP
            </button>
          </div>
        </div>

        <div
          className={cx(
            'flex flex-auto flex-col gap-3 justify-start items-center'
          )}
        >
          {/* title */}
          <div className="flex gap-[10px] w-full items-center">
            <img
              alt={'logo'}
              className="w-[50px] h-[50px] hidden tablet:block"
              src={`assets/${environment.uVersion}/${environment.mvVersion}/icon_logo.png`}
            />
            <span className="text-[var(--grayscale-100)] tablet:text-xl text-base font-bold">
              {environment.platformName}
            </span>
          </div>
          {/* content */}
          <div className={cx('flex flex-row justify-start gap-3 items-start')}>
            <div
              className={cx('h-auto flex flex-col gap-y-2', {
                'items-center': exhibit,
              })}
            >
              {platformIntroduction}
              <button
                className="flex gap-2 justify-center items-center text-sm text-[var(--grayscale-100)] font-medium"
                onClick={() => setExhibit((prevState) => !prevState)}
              >
                {exhibit ? 'Colocar fora' : 'Mostrar'}
                <img
                  className={cx('w-3 h-[6px] hidden', {
                    block: !exhibit,
                  })}
                  alt={'arrow'}
                  src={`assets/${environment.uVersion}/icon_arrow2_down.png`}
                />
                <img
                  className={cx('w-3 h-[6px] rotate-180 hidden', {
                    block: exhibit,
                  })}
                  alt={'arrow'}
                  src={`assets/${environment.uVersion}/icon_arrow2_down.png`}
                />
              </button>
            </div>
          </div>

          {exhibit && (
            <hr className="w-full border-b border-solid border-[var(--transparent-white-30)] tablet:hidden block" />
          )}

          <div className="flex gap-3 tablet:flex-col flex-col-reverse items-center">
            {/* logoList */}
            <div className="w-[65%] gap-5 hidden tablet:flex justify-between items-center">
              {footerLogoList2.map((item: FooterLogoUnit, index: number) => {
                return (
                  <div
                    key={index}
                    className={cx('w-full', {
                      'cursor-pointer active:brightness-75 hover:brightness-125':
                        item.link,
                    })}
                    onClick={() => {
                      item.link && window.open(item.link);
                    }}
                  >
                    <CacheImage
                      className={'max-h-6'}
                      alt={item.id}
                      src={item.src}
                    />
                  </div>
                );
              })}
            </div>
            <div
              className={cx(
                'w-full flex justify-between items-center',
                isDesktop ? 'gap-5' : 'gap-3 grid grid-cols-8'
              )}
            >
              {footerLogoList.map((item: FooterLogoUnit, index: number) => {
                return (
                  <div
                    key={index}
                    className={cx('w-full', {
                      'cursor-pointer active:brightness-75 hover:brightness-125':
                        item.link,
                    })}
                    onClick={() => {
                      item.link && window.open(item.link);
                    }}
                  >
                    <CacheImage
                      className={'max-h-8'}
                      alt={item.id}
                      src={item.src}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col text-xs gap-2 justify-center items-center">
              <div className="font-normal">
                {environment.platformName} is operated by Inbet Online Ltd
                (Commercial register of Curaçao no. 158191, Emancipatie
                Boulevard Dominico F. "Don" Martina 52, Curaçao) under the main
                gaming license #5517/JAZ.
              </div>
              <div className="text-[var(--grayscale-100)] text-center">
                <p className="font-medium">
                  @ {current.year()} {window.location.host} All rights
                </p>
                <p className="font-normal">v{environment.appVersion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
