import { environment } from "../../../../../../environments/environment";
import Slider, { Settings } from "react-slick";
import { IDailySignInPageProps } from "../..";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import cx from "../../../../utils/cx";
import { RewardCard } from "./components/RewardCard";
import { VIPButtonList } from "./components/VIPButtonList";
import { useDailySignInPage } from "./hooks/useDailySignInPage";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";

const DailySignInPage = ({
  currentVIP,
  signInAllConfig,
  todayIsSignIn,
  onClickToSignIn,
  signInTotalDays,
  isFromActivity
}: IDailySignInPageProps) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { onCLickToDailySignInRecord, onClickToIndex, onClickToActivity } = usePageNavigate();
  const slidesToShow = 7;
  const {
    sliderRef,
    centerIndex,
    dayConfigs,
    setCenterIndex,
    selectedVIP,
    setSelectedVIP,
    carditemsRef,
  } = useDailySignInPage(
    currentVIP,
    signInAllConfig,
    slidesToShow,
    signInTotalDays
  );
  const settings: Settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    speed: 500,
    arrows: false,
    draggable: false,
    touchMove: false,
  };
  return (
    <PageContainer className="text-[var(--grayscale-100)]">

      { !isDesktop &&
          <BackNavigation
              className="text-base mobile:text-xl"
              onClick={() => {
                isFromActivity ? onClickToActivity() : onClickToIndex()
              }}
          />
      }

      {/* banner */}
      <div className="relative tablet:mt-7 mt-3">
        <p
          className="absolute w-2/3 mobile:w-9/12 ml-[5%] text-[5.8vw] tablet:text-[2.5vw] mobile:text-[3.8vw] top-1/2 -translate-y-1/2 font-bold tablet:font-black 
          drop-shadow-[0px_4px_4px_#00000040]"
        >
          Check-in todos os dias O dinheiro não para!
        </p>
        <img
          className="w-full"
          alt="banner"
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_checkin${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
        />
      </div>
      {/*  */}
      <div
        className="flex flex-col tablet:gap-9 mobile:gap-5 gap-4 bg-[var(--grayscale-30)] rounded-xl 
          tablet:py-10 tablet:px-12 mobile:py-8 mobile:px-9 py-4 px-5 tablet:mt-6 mobile:mt-4 mt-3"
      >
        {/* 提示 */}
        <div
          className="flex mobile:flex-row flex-col tablet:gap-3 mobile:gap-4 gap-3 mobile:text-base text-sm mobile:text-left text-center
            text-[var(--grayscale-80)] bg-[var(--grayscale-50)] rounded-xl tablet:py-6 tablet:px-10 mobile:py-4 mobile:px-6 py-3 px-4 font-normal 
            tablet:items-center mobile:items-start items-center"
        >
          <img
            className="tablet:w-9 w-6 tablet:h-9 h-6"
            src={`assets/${environment.uVersion}/icon_warning.png`}
            alt="warn"
          />
          Regras de recompensa diária VIP:Cada nível só pode receber recompensas
          por {dayConfigs.length} dias no total. As recompensas serão creditadas
          na próxima vez que você as reivindicar. Para garantir a justiça da
          plataforma, a plataforma adota uma estratégia antitrapaça, os usuários
          trapaceiros serão banidos e forneceremos atendimento ao cliente 24
          horas para resolver seus problemas.
        </div>
        {/* 列表 */}
        <div>
          <VIPButtonList
            selectedVIP={selectedVIP}
            setSelectedVIP={setSelectedVIP}
            currentVIP={currentVIP}
          />
          <div className="flex tablet:gap-4 mobile:gap-3 gap-2 overflow-x-scroll mobile:mt-3 mt-4">
            {dayConfigs.map((item, index) => (
              <div
                className="cursor-pointer"
                ref={(el: any) => {
                  carditemsRef.current[index] = el;
                }}
                key={item.days}
                onClick={() => {
                  setCenterIndex(index);
                }}
              >
                <RewardCard
                  day={item.days}
                  isLock={selectedVIP > currentVIP}
                  cashback={item.cashback}
                  todayIsSignIn={todayIsSignIn}
                  signInTotalDays={signInTotalDays}
                  onClickToSignIn={onClickToSignIn}
                  isSigned={selectedVIP < currentVIP}
                />
              </div>
            ))}
          </div>
          <button
            className="linear-3-button relative tablet:w-[400px] tablet:h-12 mobile:w-80 mobile:h-10 w-full h-10 mobile:mt-6 mt-4 left-1/2 -translate-x-1/2"
            onClick={onCLickToDailySignInRecord}
          >
            Registros
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default DailySignInPage;
