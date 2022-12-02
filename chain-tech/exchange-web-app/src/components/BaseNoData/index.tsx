import React from 'react';

// ? Self-packed Components || Functions
// import { COLORS } from "@/constants/colors";

// - Images
// import cancelIcon from "@/assets/icon/cancel.png";
// import searchIcon from "../../assets/icon/Deal/search.png";

// ^ Plugins
import { useTranslation } from "react-i18next";

// = Styled Components
import styled from "styled-components";

const BaseNoDataContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 12px;
`;

interface BaseNoDataProps {
  text?: string | undefined;
}

export const BaseNoData = ({ text } : BaseNoDataProps) => {

  // $ init data
  const { t } = useTranslation();

  return (
    <BaseNoDataContainer>
      { text ? text : t('noData') }
    </BaseNoDataContainer>
  )
}

export default BaseNoData;
