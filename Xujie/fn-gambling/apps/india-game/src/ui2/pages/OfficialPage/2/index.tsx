import cx from '@commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useImgUrlByBreakPoint } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';

export const OfficialPage = () => {
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();
  const fontLink: string =
    import.meta.env['VITE_OFFICIAL_FONT_FAMILY_LINK'] ||
    'https://fonts.googleapis.com/css2?family=Bowlby+One&family=Maven+Pro:wght@400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap';
  const fontFamily: string =
    import.meta.env['VITE_OFFICIAL_FONT_FAMILY'] || 'sans-serif';
  const fontWeight: string =
    import.meta.env['VITE_OFFICIAL_FONT_WEIGHT'] || '400';
  const officialTrackToken: string = import.meta.env[
    'VITE_OFFICIAL_TRACK_TOKEN'
  ];
  const generateWeb2AppDomain = (subdomainPrefix: string) => {
    // Use the URL object to parse the URL and get the hostname
    const hostname = window.location.hostname;
    // Split the hostname by '.'
    const parts = hostname.split('.');
    // If the hostname has more than two parts, it has a subdomain
    if (parts.length > 2) {
      const rootDomain = parts.slice(parts.length - 2).join('.');
      return subdomainPrefix === ''
        ? rootDomain
        : subdomainPrefix + '.' + rootDomain;
    }
    return subdomainPrefix === '' ? hostname : subdomainPrefix + '.' + hostname;
  };
  const downAPP = () => {
    const url = generateWeb2AppDomain('download');
    console.log('@@@===> queryString', url);
    const originParams = window.location.search;
    console.log('@@@===> queryString', originParams);
    const lastURL = `https://${url}${originParams}`;
    console.log('@@@===> url', lastURL);
    if (officialTrackToken) {
      const newUrl = `${lastURL}?p0=${officialTrackToken}`;
      console.log('@@@===> newUrl', newUrl);
      window.open(newUrl, '_blank');
    } else {
      window.open(lastURL, '_blank');
    }
  };
  return (
    <>
      {/* fontFamily 設置 可以抽到 evn*/}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href={fontLink} rel="stylesheet" />

      <div
        id="app"
        className={cx(
          '!bg-no-repeat !bg-[top_center] !bg-white !bg-[length:100%_auto] flex flex-col justify-center'
        )}
        style={{
          fontFamily: fontFamily,
          fontWeight: fontWeight,
        }}
      >
        {/* block 1 */}
        <div className="w-full relative">
          <div className="absolute w-full z-10 h-full flex flex-col ">
            <header className="flex justify-between items-center py-4 px-3">
              <div>
                <img
                  src={getImgUrl(EResourceLevel.LOGO, 'game_logo_512')}
                  alt="Teen Patti Online - Play Now"
                  className="tablet:w-[5.5vw] mobile:w-[10vw] w-[12vw] mobile:!rounded-2xl !rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <a
                  href="#"
                  className={cx(
                    'flex items-center justify-center',
                    'tablet:w-[10.25vw] tablet:h-[53px] w-[18vw] h-[7.5vw]',
                    'tablet:text-[1.8vw] text-[3vw]',
                    'bgi-[var(--official-btn1)] hover:bgi-[var(--official-btn1-hover)]',
                    'rounded-full',
                    'bgi-text-[#FFFFFF] hover:bgi-text-[#FFFFFF]',
                    '!no-underline'
                  )}
                  onClick={downAPP}
                >
                  Sign Up
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center
                  tablet:w-[10.25vw] tablet:h-[53px] w-[18vw] h-[7.5vw]
                  tablet:text-[1.8vw] text-[3vw]
                  border border-[#FFFFFF]
                  rounded-full
                  bgi-text-[#FFFFFF] hover:bgi-text-[#FFFFFF]
                  !no-underline"
                  onClick={downAPP}
                >
                  Login
                </a>
              </div>
            </header>
            <div className="flex w-full tablet:justify-start justify-center mt-[314px] mobile:mt-[396px] tablet:mt-[154px] px-[36px] mobile:px-[80px] tablet:px-[100px]">
              <div
                className="flex flex-col items-left
                tablet:gap-12 mobile:gap-8 gap-4"
                // px-[3vw] tablet:mt-[5vh] mt-[51vw]
              >
                <p className="tablet:!text-left !text-center">
                  <span
                    className="tablet:text-[3.53vw] text-[7.8vw]
                    bgi-text-[#FFFFFF]
                    drop-shadow-[0px_4px_4px_#0000001A]"
                    data-var="offer"
                  >
                    WELCOME TO
                    <br />
                    <span id="package-name">{sdkUtils.productName()}</span>
                    <br />
                    GET ₹100 BONUS
                  </span>
                </p>
                <div className="flex tablet:justify-start justify-center">
                  <a
                    href="#"
                    onClick={downAPP}
                    className="shrink-0 text-[#ffffff] rounded-full
                    tablet:text-[2.2vw] text-[4.5vw]
                    tablet:px-[2.5vw] tablet:py-[1.5vh] px-[2.5vw] py-[1.5vw]
                    bgi-[var(--official-btn1)]
                    hover:bgi-[var(--official-btn1-hover)]
                    bgi-text-[#FFFFFF] hover:bgi-text-[#FFFFFF]
                    !no-underline"
                  >
                    <span className="drop-shadow-[0px_2px_2px_#00000040]">
                      DOWNLOAD NOW
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <img
            className="w-full"
            src={getImgUrlByBreakPoint(
              'officialWeb/img_1',
              EResourceLevel.V,
              true,
              true
            )}
          />
        </div>

        {/* block 2 */}
        <div className="-mt-[172px] mobile:-mt-[187px] tablet:-mt-[74px]  z-20">
          <div
            className="flex
              tablet:gap-0 gap-[100px]
              tablet:flex-row flex-col justify-between items-center"
          >
            <div className="w-full col-lg-4 col-md-12">
              <img
                className="w-[210px] h-[210px] m-auto"
                src={getImgUrl(EResourceLevel.V, 'officialWeb/number_1')}
                alt="1"
              />
              <h2
                className="tablet:text-[1.9vw] text-[3.5vw] bgi-text-[var(--official-text)] text-center mobile:my-4 my-2"
                data-var="step1header"
              >
                Quick and Easy
              </h2>
              <p
                className="tablet:text-[1.4vw] mobile:text-[2.4vw] text-[3.4vw] bgi-text-[#000000] font-medium font-[Inter] text-center"
                data-var="step1text"
              >
                Customer support
                <br />
                is available 24/7
              </p>
            </div>
            <div className="w-full col-lg-4 col-md-12">
              <img
                className="w-[210px] h-[210px] m-auto"
                // src={`/images/${vVersion}/officialWeb/2.webp`}
                src={getImgUrl(EResourceLevel.V, 'officialWeb/number_2')}
                alt="1"
              />
              <h2
                className="tablet:text-[1.9vw] text-[3.5vw] bgi-text-[var(--official-text)] text-center mobile:my-4 my-2"
                data-var="step2header"
              >
                100% secure payments
              </h2>
              <p
                className="tablet:text-[1.4vw] mobile:text-[2.4vw] text-[3.4vw] bgi-text-[#000000] font-medium font-[Inter] text-center"
                data-var="step2text"
              >
                100% secure payments & Fast withdrawals
                <br />
                We support several
                <br />
                payment providers
              </p>
            </div>
            <div className="w-full col-lg-4 col-md-12">
              <img
                className="w-[210px] h-[210px] m-auto"
                // src={`/images/${vVersion}/officialWeb/3.webp`}
                src={getImgUrl(EResourceLevel.V, 'officialWeb/number_3')}
                alt="1"
              />
              <h2
                className="tablet:text-[1.9vw] text-[3.5vw] bgi-text-[var(--official-text)] text-center mobile:my-4 my-2"
                data-var="step3header"
              >
                1000+ games
              </h2>
              <p
                className="tablet:text-[1.4vw] mobile:text-[2.4vw] text-[3.4vw] bgi-text-[#000000] font-medium font-[Inter] text-center"
                data-var="step3text"
              >
                1000+ games
                <br />
                Award winning Mobile
                <br />
                Experience Slots,
                <br />
                tables & Live Casino
              </p>
            </div>
          </div>
          <br />
        </div>

        {/* block 3 */}
        <div className="!bg-no-repeat !bg-[bottom_center] !bg-[length:100%_auto] relative">
          <div className="absolute w-full bottom-[162px]  mobile:bottom-[18px] tablet:bottom-[184px]">
            <div className="flex flex-col justify-center col-lg-12 col-md-12">
              <h3
                className="tablet:text-[5.1vw] text-[10vw]
                  bgi-text-[#FFFFFF]
                  drop-shadow-[0px_4px_4px_#0000001A] text-center"
                data-var="offer2"
              >
                Check our
                <br />
                1000+ games
              </h3>
              <div className="text-center mt-[48px]">
                <a
                  href="#"
                  onClick={downAPP}
                  className="text-[#FFFFFF]
                    tablet:px-[2.5vw] tablet:py-[1.5vh] px-[3vw] py-[1.5vw]
                    tablet:text-[2.2vw] text-[6.62vw]
                    bgi-[var(--official-btn2)]
                    hover:bgi-[var(--official-btn2-hover)]
                    rounded-full
                    bgi-text-[#FFFFFF] hover:bgi-text-[#FFFFFF]
                    !no-underline"
                >
                  <span className="drop-shadow-[0px_2px_2px_#00000040]">
                    Explore Here
                  </span>
                </a>
              </div>
            </div>
          </div>

          <img
            className="w-full"
            src={getImgUrlByBreakPoint(
              'officialWeb/img_2',
              EResourceLevel.V,
              true,
              true
            )}
          />
        </div>

        {/* block 4 */}
        <footer className="flex flex-col gap-1 justify-center items-center py-[3vh]">
          <div className="flex flex-wrap gap-1 justify-center">
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/gpay')}
              alt="Visa"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/phonepay')}
              alt="Maestro"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/amazonpay')}
              alt="Mastercard"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/upi')}
              alt="Sofort"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/bharatpe')}
              alt="Entropay"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/bheem')}
              alt="Skrill"
              className="img-fluid"
            />
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/paytm')}
              alt="EPS"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/visa')}
              alt="EPS"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/maestro')}
              alt="18+"
              className="img-fluid"
            />
            <img
              src={getImgUrl(EResourceLevel.V, 'officialWeb/footer/Rupay')}
              alt="iTech Labs"
              className="img-fluid"
            />
          </div>
        </footer>
      </div>
    </>
  );
};

export default OfficialPage;
