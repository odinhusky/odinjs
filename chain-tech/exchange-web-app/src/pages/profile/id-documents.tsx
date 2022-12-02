import { useState } from "react";

// # API
import api from "@/common/api"

// ? Self-packed Components || Functions
import Drawer from "@/components/UI/Drawer";
import UploadPhotoZone from './components/UploadPhotoZone'
import { COLORS } from '@/constants/colors';

// - Images
import Left from "@/assets/ProfileSetting/left.png";
import Footer from "@/components/footer/PageFooter";

// ^ Plugins
import { useNavigate } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay-ts';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// = Style Component
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TopArea = styled.div`
  height: 50px;
  line-height: 50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom: 2px;
`;

const TopArealeft = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  border: none;
  border-radius: 4px;
  height: 57px;
  width: 90%;
  background: ${COLORS.Primary};
  align-items:center;
  margin: 50px 0px 90px 20px;
`;

const SubmitButtonWord = styled.p`
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  border: none;
`;

const ArrowContent = styled.img`
  margin-left: 13px;
  width: 16px;
  height: 16px;
`;

const LeftButton = styled.button`
  background: #fff;
  border: none;
  margin-top: -2px;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743;
  font-size: 16px;
  font-weight: bold;
  margin-right: 55px;
`;

const Inside = styled.div`
  background: #ffffff;
  flex: 1;
`;

const NoticeP = styled.p`
  font-size: 15px;
  color: #5f5c70;
  text-align: center;
  margin-top: 20px;
`;

const PhoneButton = styled.button`
  border: none;
  background: none;
  border-bottom: 0.03px solid #f4f4f6;
`;

const PhoneButtonP = styled.p`
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f5c70;
`;

const PhoneButtonSetting = styled.div`
  display: flex;
  flex-direction: column;
`;

const PhotoButtonContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const PhotoButtonContent = styled.label`
  background: #f4f4f6;
  width: 311px;
  border: none;
  border-radius: 8px;
`;

const PhotoPNG = styled.img`
  z-index: 2;
  width: 311px;
  height: 186px;
`;

const NoticeArea = styled.div`
  position: fixed;
  z-index: 10;
  left: 70px;
  top: 250px;
  width: 270px;
  height: 126px;
  background: #ffffff;
  border-radius: 18px;
`;

const RemoveP = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 16px;
  color: #595959;
  font-weight: 500px;
`;

const RemovePContent = styled.p`
  text-align: center;
  margin-top: 15px ;
  font-size: 14px;
  color: #595959;
`;
const SplitContainer = styled.div`
  border-top: 1px solid black;
  margin-top: 1px;
  border-color: #d9d9d9;
`;
//page-style end

const IDdocuments = () => {

  // $ init data
  const navigate = useNavigate();
  const { t } = useTranslation();

  // # states
  const [Arrow2, setArrow2] = useState(false);
  const [openPhoto, setOpenphoto] = useState(false);

  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const [src, setSrc] = useState("");
  const [src2, setSrc2] = useState("");
  const [src3, setSrc3] = useState("");
  const [loading, setLoading] = useState(false);

  // - methods
  const handleDrawer = () => {
    setArrow2((prev) => !prev);
  };

  const handlerOpenPhoto = () => {
    setOpenphoto((prev) => !prev);
    setArrow2(false);
  };

  const readFile = (e: any) => {
    setFile(e.target.files[0])
    var reader = new FileReader();
    reader.onload = function (event: any) {
      // The file's text will be printed here
      setSrc(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const readFile2 = (e: any) => {
    setFile2(e.target.files[0])
    var reader = new FileReader();
    reader.onload = function (event: any) {
      // The file's text will be printed here
      setSrc2(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const readFile3 = (e: any) => {
    setFile3(e.target.files[0])
    var reader = new FileReader();
    reader.onload = function (event: any) {
      // The file's text will be printed here
      setSrc3(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file){
      alert(t("idCardFrontMsg"))
    } else if(!file2){
      alert(t("idCardBackMsg"))
    } else if(!file3){
      alert(t("idCardSelfieMsg"))
    } else {
      setLoading(true)

      const formData:any = new FormData();
      const verify = JSON.parse(localStorage.getItem("verify")!)

      const data = {
        idCardFront: file,
        idCardBack: file2,
        selfie: file3,
        name:verify.name,
        address:verify.address,
        birthday:verify.birthday
      };

      for (const [key, value] of Object.entries(data)) {
          formData.append(key, value)
      }

      api.postFormData("/user/kyc", formData).then(x=>{
        setLoading(false)
        console.log(x)
        if(x.status !== 400){
          navigate("/safe-setting")
        }else{
          alert(x.data.msg)
        }
      })
    }
  }

  return (
    <LoadingOverlay
      active={loading}
      spinner
    >
      <PageContainer>
        <TopArea>
          <TopArealeft>
            <Link to="/id-verify">
              <LeftButton>
                <ArrowContent src={Left} alt="左箭頭" />
              </LeftButton>
            </Link>

            <Setting1>{t("idAuth")}</Setting1>
            <div> </div>
          </TopArealeft>
        </TopArea>

        <Inside>
          <NoticeP>請上傳身分證正反面之照片，照片應清晰且完整 。 </NoticeP>

          <PhotoButtonContainer>
            <PhotoButtonContent onChange={e => readFile(e)} htmlFor="formId">
              <input name="" type="file" id="formId" hidden />

              {
                src ? (
                  <PhotoPNG src={src} alt="照片" />
                ) : (
                  <UploadPhotoZone title={t('uploadPhotoZoneTitleFront')} />
                )
              }
            </PhotoButtonContent>
          </PhotoButtonContainer>

          <PhotoButtonContainer>
            <PhotoButtonContent onChange={e => readFile2(e)} htmlFor="formId2">
              <input name="" type="file" id="formId2" hidden />

              {
                src2 ? (
                  <PhotoPNG src={src2} alt="照片" />
                ) : (
                  <UploadPhotoZone title={t('uploadPhotoZoneTitleBack')} />
                )
              }
            </PhotoButtonContent>
          </PhotoButtonContainer>

          <PhotoButtonContainer>
            <PhotoButtonContent onChange={e => readFile3(e)} htmlFor="formId3">
              <input name="" type="file" id="formId3" hidden />

              {
                src3 ? (
                  <PhotoPNG src={src3} alt="照片" />
                ) : (
                  <UploadPhotoZone title={t('uploadPhotoZoneTitleSelfie')} />
                )
              }
            </PhotoButtonContent>
          </PhotoButtonContainer>

          <SubmitButton onClick={handleSubmit}>
            <SubmitButtonWord>送出</SubmitButtonWord>
          </SubmitButton>
        </Inside>

        <Drawer isVisible={Arrow2} selectVisible={handleDrawer} height={230}>
          <PhoneButtonSetting>
            <PhoneButton>
              <PhoneButtonP
                onClick={() => {
                  handlerOpenPhoto();
                }}
              >
                拍攝照片上傳
              </PhoneButtonP>
            </PhoneButton>

            <PhoneButton>
              <PhoneButtonP
                onClick={() => {
                  handlerOpenPhoto();
                }}
              >
                選擇圖片上傳
              </PhoneButtonP>
            </PhoneButton>
          </PhoneButtonSetting>

          <button
            style={{
              border: "none",
              lineHeight: "50px",
              background: "#F4F4F6",
              borderRadius: "4px",
            }}
            onClick={handleDrawer}
          >
            <p style={{ fontSize: "14px", color: "#5F5C70" }}>{t("cancel")}</p>
          </button>
        </Drawer>

        {openPhoto && (
          <>
            <div
              style={{
                height: "100vh",
                width: "100vw",
                background: "#aaa",
                position: "fixed",
                opacity: 0.24,
                zIndex: 1,
              }}
            ></div>
            <NoticeArea>
              <div style={{ padding: "12px" }}>
                <div>
                  <RemoveP>OO 想要取用你的相簿</RemoveP>
                  <RemovePContent>授權從APP取用您的相簿內容</RemovePContent>
                </div>
              </div>
              <SplitContainer />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  height: "40px",
                }}
              >
                <button
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "16px",
                    color: "#296DF1",
                    width: "50%",
                  }}
                  onClick={() => {
                    setOpenphoto((p) => !p);
                  }}
                >
                  <p>不允許</p>
                </button>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "16px",
                    color: "#296DF1",
                    width: "50%",
                  }}
                >
                  <p>允許</p>
                </button>
              </div>
              {/* 這幾段無法 style component */}
            </NoticeArea>
          </>
        )}
        <Footer />
      </PageContainer>
    </LoadingOverlay>
  );
};

export default IDdocuments;
