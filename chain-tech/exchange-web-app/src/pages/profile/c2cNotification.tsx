import React from "react";
import C2CHeader from "../../components/header/c2cNotificationHeader";
import styled from "styled-components";

import { Switch } from "antd";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const C2cNotification = () => {
  // const [selectItem, setSelectItem] = useState("最新公告");
  const { t } = useTranslation();
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <PageContainer>
      <C2CHeader />
      <div
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
          {t("messageNotice")}
        </div>
        <Switch defaultChecked onChange={onChange} />
      </div>
      <div
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
          {t("emailNotice")}
        </div>
        <Switch defaultChecked onChange={onChange} />
      </div>
    </PageContainer>
  );
};

export default C2cNotification;
