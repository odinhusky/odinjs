import useBreakpoint from '../../../../../pageTemplate/hooks/useBreakpoint';
import { environment } from '../../../../../../../environments/environment';
import { usePageNavigate } from '../../../../../router/hooks/usePageNavigate';
import cx from 'classnames';
import { CarouselContainer } from '../../CarouselContainer';
import { IAppCarouselContent } from '../../types';

export const AppCarouselContent4 = (props: IAppCarouselContent) => {
  const { isMobile } = useBreakpoint();
  const { onClickToFirstDeposit } = usePageNavigate();

  return (
    <CarouselContainer
      isMoving={props.isMoving}
      className={'text-[22.5px] font-[Heebo] text-white'}
    >
      {isMobile ? (
        <div
          onClick={() => {
            onClickToFirstDeposit();
          }}
        >
          <p className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-4 italic font-bold text-2xl md:text-3xl text-left">
            Prêmio upgrade VIP
            <br /> Só esperando você coletar!
          </p>
          <img src={`assets/${environment.uVersion}/h5_banner_4.jpeg`} />
        </div>
      ) : (
        <div
          className="banner w-screen"
          onClick={() => {
            onClickToFirstDeposit();
          }}
          // style={{ display: 'flex',justifyContent: 'center' }}
        >
          <p
            className={cx(
              'absolute top-1/2 transform -translate-y-1/2',
              'pl-4',
              'italic font-bold text-6xl text-left'
            )}
          >
            Prêmio upgrade VIP
            <br /> Só esperando você coletar!
          </p>
          <img
            src={`assets/${environment.uVersion}/banner4.jpeg`}
            // className="rounded-box"
          />
        </div>
      )}
    </CarouselContainer>
  );
};
