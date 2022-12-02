import React from "react";

// ? Self-packed Components || Functions
import C2CHeader from "@/components/header/c2cHeader";

// - Images
import arrow from "@/assets/profile/next.png";
import member from "@/assets/profile/member.png";
import help from "@/assets/profile/help.png";
import notification from "@/assets/profile/notification.png";
import outbox from "@/assets/profile/outbox.png";
import payment from "@/assets/profile/payment.png";

// ^ Plugins
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// = Styled Component
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * @author odin
 * @level Layout/C2c
 * @description C2C 管理中心
*/
const C2c = () => {

  // $ init data
  const { t } = useTranslation();

  return (
    <PageContainer>
      <C2CHeader />
      <Link
        to="/memberCenter"
        style={{
          borderBottom: "1px solid #F4F4F6",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            fontFamily: "PingFang TC",
            display: "flex",
            alignItems: "center",
            color: "#383743"
          }}
        >
          <img
            src={member}
            alt=""
            style={{ width: 28, height: 28, marginRight: 10 }}
          />
          {t("userCenter")}
        </div>
        <img src={arrow} alt="" style={{ width: 28, height: 28 }} />
      </Link>
      <Link
        to="/account-setting"
        style={{
          borderBottom: "1px solid #F4F4F6",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            fontFamily: "PingFang TC",
            display: "flex",
            alignItems: "center",
            color: "#383743"
          }}
        >
          <img
            src={payment}
            alt=""
            style={{ width: 28, height: 28, marginRight: 10 }}
          />
          {t("accountSet")}
        </div>
        <img src={arrow} alt="" style={{ width: 28, height: 28 }} />
      </Link>
      <Link
        to="/c2cApply"
        style={{
          borderBottom: "1px solid #F4F4F6",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            fontFamily: "PingFang TC",
            display: "flex",
            alignItems: "center",
            color: "#383743"
          }}
        >
          <img
            src={outbox}
            alt=""
            style={{ width: 28, height: 28, marginRight: 10 }}
          />
          {t("MchStack")}
        </div>
        <img src={arrow} alt="" style={{ width: 28, height: 28 }} />
      </Link>
      <Link
        to="/c2cNotification"
        style={{
          borderBottom: "1px solid #F4F4F6",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            fontFamily: "PingFang TC",
            display: "flex",
            alignItems: "center",
            color: "#383743"
          }}
        >
          <img
            src={notification}
            alt=""
            style={{ width: 28, height: 28, marginRight: 10 }}
          />
          {t("fiatNoticeSet")}
        </div>
        <img src={arrow} alt="" style={{ width: 28, height: 28 }} />
      </Link>
      <Link
        to="/c2cHelp"
        style={{
          borderBottom: "1px solid #F4F4F6",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            fontFamily: "PingFang TC",
            display: "flex",
            alignItems: "center",
            color: "#383743"
          }}
        >
          <img
            src={help}
            alt=""
            style={{ width: 28, height: 28, marginRight: 10 }}
          />
          {t("helpPage")}
        </div>
        <img src={arrow} alt="" style={{ width: 28, height: 28 }} />
      </Link>
    </PageContainer>
  );
};

export default C2c;
