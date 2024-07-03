import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useLocation } from "react-router";
import { environment } from "../../../../../../environments/environment";
import { notification } from "antd";
import QRCode from "react-qr-code";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { formatLocaleMoney } from "../../../../utils/format";
import { appCopy } from "../../../../utils/appCopy";
import cx from "../../../../utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import WalletDepositLine from "./WalletDepositLine";
import BaseBtn from "../../../../components-bs/Buttons/BaseBtn";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import WalletBtn from "../../../WalletPage/env/u7/components/WalletBtn";

const COUNT_DOWN = 900;

export const WalletDepositNextPage = () => {
  useAllowLoginRouterRules();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [countdown, setCountdown] = useState(COUNT_DOWN); // 15分钟的秒数
  const [api, contextHolder] = notification.useNotification();

  const { onClickToWallet } = usePageNavigate();

  const location = useLocation();
  const data = location.state.data || {};
  const amount = location.state.amount || 0;

  const current = useMemo(() => moment().format("DD.MM.YYYY HH:mm:ss"), []);

  const onClickToCopy = () => {
    appCopy(data?.data?.channelData?.paymentLink || "");
    api.success({
      message: t["Copied"],
    });
  };

  const handleToWalletPage = () => {
    onClickToWallet({ panelType: "deposit" });
  };

  useEffect(() => {
    if (location.state.amount === 0) {
      handleToWalletPage();
    }
  }, [location.state.amount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      } else {
        handleToWalletPage();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <PageContainer
      className={cx(
        "flex flex-col tablet:gap-10 mobile:gap-8 gap-5 pt-3 pb-[96px] mobile:pb-0 tablet:pt-[36px] tablet:pb-[72px]"
      )}
    >
      {contextHolder}

      <BackNavigation
        className={cx("text-base font-medium")}
        onClick={() => onClickToWallet({ panelType: "deposit" })}
      />
      <div
        className={cx(
          "text-deposit-amount text-3xl w-full tablet:hidden block font-bold",
          FLEX_CENTER
        )}
      >
        {t["moneyWithRSign"](formatLocaleMoney(amount))}
      </div>

      <div
        className={cx(
          "bg-impotrant flex mobile:text-base text-sm text-[var(--state-warn-main)] rounded-lg py-3 px-5",
          "font-normal shadow-[0px_4px_4px_0px_#00000040] justify-center text-center"
        )}
      >
        {t["payIn15Mins"]}
      </div>

      <div>
        <div className="flex gap-3 mobile:gap-4 tablet:gap-5 flex-col md:flex-row">
          <div className="w-full flex flex-col justify-between mobile:gap-4 gap-3">
            <WalletDepositLine title={t["createDate"]} value={current} />

            <WalletDepositLine
              title={t["Time"]}
              value={moment().startOf("day").seconds(countdown).format("mm:ss")}
            />

            <WalletDepositLine
              title={t["requestedNumber"]}
              value={data?.data?.orderId || ""}
            />

            <div
              className={cx(
                "relative bg-popup1 rounded-lg text-base w-full h-full pt-3 pb-5",
                "shadow-[0px_4px_4px_0px_#00000040]"
              )}
            >
              <div className="border-popup-button before:rounded-lg absolute w-full h-full top-0 left-0 pointer-events-none" />
              <div
                className={cx(
                  "text-base text-[var(--grayscale-70)] font-medium px-5"
                )}
              >
                {t["payOrder"]}
              </div>

              <div
                className={cx("flex flex-col tablet:gap-5 mobile:gap-3 gap-5")}
              >
                <div
                  className={cx(
                    "text-base break-words text-[var(--grayscale-100)] font-medium px-5"
                  )}
                >
                  {data?.data?.channelData?.paymentLink || ""}
                </div>

                {/* 二维码 */}
                <div className="w-full tablet:hidden block">
                  <div
                    className={cx(
                      "bg-white rounded-lg w-60 h-60 p-[9px] mx-auto"
                    )}
                  >
                    <QRCode
                      size={223}
                      value={String(data?.data?.channelData?.paymentLink || "")}
                    />
                  </div>
                </div>

                <BaseBtn
                  btnClass={cx(
                    "group max-w-[240px] h-12",
                    "bg-[var(--grayscale-40)] hover:bg-[var(--grayscale-50)] active:hover:bg-[var(--grayscale-30)]",
                    "border-none rounded-full cursor-pointer mx-auto px-5 shadow-[0px_4px_4px_0px_#00000040]"
                  )}
                  children={t["copyCode_u7"]}
                  childrenClass={cx(
                    "text-lg text-[var(--grayscale-80)] group-hover:text-[var(--grayscale-100)] group-active:text-[var(--grayscale-100)] tablet:font-bold font-medium"
                  )}
                  onClick={onClickToCopy}
                />
              </div>
            </div>
          </div>

          {/* 右邊 QR Code 的部分 */}
          <div
            className={cx(
              "border-popup-button before:rounded-lg bg-popup1 flex flex-col",
              "flex-shrink-0 w-80 h-[365px] rounded-lg py-[37px] px-3 hidden tablet:block",
              "shadow-[0px_4px_4px_0px_#00000040] justify-center items-center"
            )}
          >
            <div
              className={cx(
                "text-2xl text-[var(--grayscale-100)] font-bold",
                FLEX_CENTER
              )}
            >
              {t["moneyWithRSign"](formatLocaleMoney(amount))}
            </div>
            {/* 二维码 */}
            <div
              className={cx(
                "bg-white rounded-lg w-60 h-60 p-[9px] mt-5 mx-auto"
              )}
            >
              <QRCode
                size={223}
                value={String(data?.data?.channelData?.paymentLink || "")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={cx()}>
        <WalletBtn
          btnClass={cx(
            "linear-1-button max-w-[480px] h-12 border-soild border border-[var(--grayscale-60)]",
            "rounded-full mx-auto shadow-[0px_4px_4px_0px_#00000040] hidden tablet:block"
          )}
          children={t["hadPaid"]}
          onClick={handleToWalletPage}
        />
      </div>
    </PageContainer>
  );
};
