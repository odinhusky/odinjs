import React, { useState } from "react";

// - Images
import { COLORS } from "@/constants/colors";
import Cancel from "@/assets/icon/cancel.png";
import { ReactComponent as DoneIcon } from "@/assets/icon/done.svg";

// ^ Plugins
import { useTranslation } from "react-i18next";

// = Styled Components
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: ${COLORS.White};
  height: 44px;
`;

const HeaderLeft = styled.div`
  float: Left;
  display: flex;
  align-items: center;
  height: 44px;
`;
const HeaderRight = styled.div`
  float: Right;
  display: flex;
  align-items: center;
  height: 44px;
`;
const SelectIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-left: 7px;
`;

const SetButton = styled.div`
  text-align: center;
  color: #8f8da2;
  font-weight: 600;
  margin-right: 16px;
`;
const SelectContainer = styled.div`
  flex: 1;
  padding: 11px 16px;
  flex: 1;
`;
const SelectTitle = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #383743;
  margin-bottom: 18px;
`;
const SelectTable = styled.ul`
  width: 100%;
`;
const SelectItem = styled.li`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f6;
  font-weight: 400;
  font-size: 15px;
  color: #383743;
`;

interface ChangeLangModalProps {
  onClose: () => void;
  currentLang: string;
  handleCurrentLang: (lang: string) => void;
}

export const ChangeLangModal = ({
  onClose,
  currentLang,
  handleCurrentLang
} : ChangeLangModalProps) => {

  // $ init data
  const { t } = useTranslation();

  // # states
  const [language, setLanguage] = useState<string>(currentLang);

  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <SelectIcon
            src={Cancel}
            alt="cancel"
            onClick={onClose}
          />
        </HeaderLeft>
        <HeaderRight>
          <SetButton
            onClick={() => {
              handleCurrentLang(language);
              onClose();
            }}
          >
            {t("set")}
          </SetButton>
        </HeaderRight>
      </HeaderContainer>
      <SelectContainer>
        <SelectTitle>{t("selectLanguage")}</SelectTitle>
        <SelectTable>
          <SelectItem
            onClick={() => {
              setLanguage("en");
            }}
          >
            <p>{t("english")}</p>
            {language === "en" && <DoneIcon />}
          </SelectItem>
          <SelectItem
            onClick={() => {
              setLanguage("tw");
            }}
          >
            <p>{t("traditionalChinese")}</p>
            {language === "tw" && <DoneIcon />}
          </SelectItem>
          <SelectItem
            onClick={() => {
              setLanguage("cn");
            }}
          >
            <p>{t("simplifiedChinese")}</p>
            {language === "cn" && <DoneIcon />}
          </SelectItem>
        </SelectTable>
      </SelectContainer>
    </>
  );
};

export default ChangeLangModal;
