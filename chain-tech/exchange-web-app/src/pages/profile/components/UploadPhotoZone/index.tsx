import React from 'react';

// ? Self-packed Components || Functions
import { COLORS } from '@/constants/colors';

// ^ Plugins
import { CameraOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// = Styled Component
import styled from "styled-components";

const UploadPhotoZoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items; center;
  width: 100%;
  min-width: 311px;
  min-height: 186px;
  padding: 30px 8px 20px 8px;
  background-color: ${COLORS.Light_gray};
  border-radius: 8px;
  cursor: pointer;
`;

const IconContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
  color: ${COLORS.Dark_gray};
  text-align: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px
  color: ${COLORS.Dark_gray};
  text-align: center;
`;

const SubTitleContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-size: 12px;
  color: ${COLORS.Mid_gray};
  text-align: center;
`;


interface UploadPhotoZoneProps {
  title: string;
}

/**
 * @author odin
 * @level Layout/IDVerify/IDDocument/UploadPhotoZone
 * @description 身份驗證中的一個 複用型元件
*/
export const UploadPhotoZone = ({ title }: UploadPhotoZoneProps) => {

  // $ init data
  const { t } = useTranslation();

  return (
    <UploadPhotoZoneContainer>
      <IconContainer
        children={
          <CameraOutlined
            style={{ fontSize: 30, color: COLORS.Dark_gray }}
          />
        }
      />

      <TitleContainer children={title} />
      <SubTitleContainer children={t('uploadPhotoZoneSubTitle')} />
    </UploadPhotoZoneContainer>
  )
};

export default UploadPhotoZone;
