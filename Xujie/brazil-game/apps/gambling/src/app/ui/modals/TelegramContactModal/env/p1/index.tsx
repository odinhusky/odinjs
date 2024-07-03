import styled from "styled-components";
import {environment} from "../../../../../../environments/environment";
import {tcx} from "../../../../utils/tcx";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {CloseICON} from "../../../../components-bs/Icons/CloseICON";


const Container = styled.div`
  //width: 100%;
  //height: 100%;
  background-image: url(assets/${environment.uVersion}/${environment.mvVersion}/modal_telegram_bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 20px;
`;

const ModalTitle = styled.div`
  text-align: center;
  line-height: 26px;
  //text-shadow: 0px 3px 0px #0461D6;
`

const ModalButton = styled.button`
  border-radius: 25px;
  background: linear-gradient(180deg, var(--btn-gradient2-from) 0%, var(--btn-gradient2-to) 100%);
  //position: absolute;
  //bottom: 34px;
  //left: 50%;
  //margin-left: -100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
`

export type ITelegramContactModal = {
  close: () => void;
  toTelegramGroup: () => void;
}

export const TelegramContactModal = (props: ITelegramContactModal) => {

  const {isMobile} = useBreakpoint();

  return (
    <div
      className={"z-[1005] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"}
      onClick={(event) => {
        // props.close();
      }}>

      <Container
        className={tcx(
          "w-[410px] w-min-[80vh] w-max-[400px] h-auto bg-[black] rounded-2xl flex flex-col items-center relative px-5 py-6",
          ['w-[330px] px-[14px] py-5', isMobile]
        )}
        onClick={(event) => {
          event.stopPropagation();
        }}>

        <div className={tcx(
          "flex flex-row justify-end mb-2 absolute right-[20px]",
          ['top-[20px]', !isMobile],
          ['right-[50%] translate-x-[50%] bottom-0 translate-y-[50px]', isMobile]
        )}>
          <div
            onClick={() => {
              props.close();
            }}
          >
            <CloseICON outLined={isMobile}/>
          </div>
        </div>
        {/*<img alt='icon' className={tcx('w-[180px] mt-6 mb-3', ['w-[105px] mt-0 mb-2', isMobile])} src={`assets/${environment.uVersion}/ic_telegram.png`} />*/}
        <div className={"flex flex-col"}>
          <div className={"mb-4 text-white"}>
            <ModalTitle
              style={{
                color: 'var(--white)',
                fontWeight:'700',
                textShadow: '1px 2px 6px var(--text-telegram)'
              }}
              className={tcx('text-[32px]', ['text-xl', isMobile])}
            >Junte-se a nós</ModalTitle>
            <div
              style={{
                textShadow: '1px 2px 6px var(--text-telegram)'
              }}
              className={tcx("text-[var(--white)] text-center text-lg font-medium mt-4", ['text-xs mt-1', isMobile])}>
              Prezados clientes VIP, juntem-se ao nosso canal oficial do Telegram. Realizaremos vários eventos de
              loteria de tempos em tempos. Dezenas de milhares de reais estão esperando por você para reivindicar.
            </div>
          </div>

          <div className={"flex flex-col justify-center items-center"}>
            <ModalButton
              className={tcx('text-lg w-[168px] h-[52px]', ['text-sm w-[99px] h-[31px]', isMobile])}
              onClick={() => props.toTelegramGroup()}
            >
              <span className={"font-bold"}>JUNTE-SE</span>
            </ModalButton>
          </div>
        </div>


      </Container>
    </div>
  )
}

