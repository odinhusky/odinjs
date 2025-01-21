const BannerBorder = ({ className }: { className?: string }) => (
  <div className={`${className} `}>
    <div className="relative w-full">
      <svg
        className="w-full"
        viewBox="0 0 656 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M539.565 18.9411C596.737 17.4276 659.547 6.55854 680 0V14.7567C660.75 21.1891 588.323 28.3783 525.52 26.8648C451.104 25.0714 372.484 25.9819 340 27.9999C410.021 18.5405 468.1 20.833 539.565 18.9411Z"
          fill="url(#paint0_linear_15074_63938)"
        />
        <path
          d="M525.52 26.8654C451.104 25.0721 372.484 25.9826 340 28.0006C372.484 25.9826 451.077 23.8829 525.52 23.8829C624.379 23.8829 660.75 13.0213 680 6.58887L680 14.7574C660.75 21.1898 588.323 28.379 525.52 26.8654Z"
          fill="url(#paint1_linear_15074_63938)"
        />
        <path
          d="M140.435 18.9411C83.2628 17.4276 20.4529 6.55854 0 0V14.7567C19.2498 21.1891 91.6773 28.3783 154.48 26.8648C228.896 25.0714 307.516 25.9819 340 27.9999C269.979 18.5405 211.9 20.833 140.435 18.9411Z"
          fill="url(#paint2_linear_15074_63938)"
        />
        <path
          d="M154.48 26.8654C228.896 25.0721 307.516 25.9826 340 28.0006C307.516 25.9826 228.923 23.8829 154.48 23.8829C55.6212 23.8829 19.2498 13.0213 0 6.58887L3.05176e-05 14.7574C19.2499 21.1898 91.6773 28.379 154.48 26.8654Z"
          fill="url(#paint3_linear_15074_63938)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_15074_63938"
            x1="569.13"
            y1="3.29411"
            x2="575.084"
            y2="28.3417"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FCD4A8" />
            <stop offset="0.5" stop-color="#D6A973" />
            <stop offset="1" stop-color="#FCD5A9" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_15074_63938"
            x1="679.076"
            y1="5.76534"
            x2="680.152"
            y2="19.7754"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#B77D33" />
            <stop offset="0.5" stop-color="#C99655" />
            <stop offset="1" stop-color="#9B6C2A" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_15074_63938"
            x1="110.87"
            y1="3.29411"
            x2="104.916"
            y2="28.3417"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FCD4A8" />
            <stop offset="0.5" stop-color="#D6A973" />
            <stop offset="1" stop-color="#FCD5A9" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_15074_63938"
            x1="0.923941"
            y1="5.76534"
            x2="-0.152429"
            y2="19.7754"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#B77D33" />
            <stop offset="0.5" stop-color="#C99655" />
            <stop offset="1" stop-color="#9B6C2A" />
          </linearGradient>
        </defs>
      </svg>
      <div className=" w-full h-full bottom-0 absolute flex -z-10">
        <div className="w-[10%] h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[50%] w-full absolute bottom-0" />
        </div>
        <div className="w-[4%] h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[40%] w-full absolute bottom-0" />
        </div>
        <div className="w-[35%]  h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[10%] w-full absolute bottom-0" />
        </div>
        <div className="w-[7%]  relative">
          <div className="w-full h-[1px] bgi-[var(--base-1-main)]  absolute bottom-0"></div>
        </div>

        <div className="w-[34%] h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[10%] w-full absolute bottom-0" />
        </div>
        <div className="w-[4%] h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[40%] w-full absolute bottom-0" />
        </div>
        <div className="w-[8%] h-full relative">
          <div className="bgi-[var(--base-1-main)] h-[50%] w-full absolute bottom-0" />
        </div>
      </div>
    </div>
  </div>
);
export default BannerBorder;
