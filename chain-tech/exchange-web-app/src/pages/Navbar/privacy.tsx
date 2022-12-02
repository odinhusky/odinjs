import React,{useState} from "react";
import AnnouncementModal from "../../components/modal/AnnouncementModal";
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Announcement = () => {
  const [, setNavSelectItem] = useState(false);
  return (
    <PageContainer>
      <AnnouncementModal
        navTitle={"詳情"}
        itemTitle={"隱私政策與條款"}
        content={
          "<p>【導言及提示條款】<br /><br /><br />本平臺是一個專門供使用者進行數字資產交易和提供相關服務（以下稱“該服務”或“服務”）的平臺。為了表述之方便，本平臺在本協議中合稱 “我們”或其他第一人稱稱呼，只要登陸該平臺的自然人或其他主體均為本平臺的用戶，以下使用“您”或其他第二人稱，我們和您合稱為“雙方”，我們或您單稱為“一方”。我們充分理解與尊重您的個人資訊對您的重要性，我們將按法律法規要求，採取相應安全保護措施，保護您的個人資訊安全。鑒於此，制定本《隱私政策》（下稱“本政策 /本隱私政策”）並提醒您：本政策適用於我們提供的所有產品和服務。如我們向您提供的產品或服務單獨設立有隱私政策的，則該產品或服務適用其單獨設立的隱私政策；如我們的產品或服務未單獨設立隱私政策的，則適用於本政策。需要特別說明的是，本政策不適用於其他協力廠商向您提供的服務，協力廠商向您提供的服務適用其向您另行說明的隱私政策。在使用我們各項產品或服務前，請您務必仔細閱讀並透徹理解本政策，特別是以粗體/粗體底線標識的條款，您應重點閱讀，在確認充分理解並同意後再開始使用。如對本政策內容有任何疑問、意見或建議，您可通過我們官方提供的各種聯繫方式與我們聯繫。如您不同意本政策中的任何條款，您應立即停止訪問本平臺。<br /><br /><br />【第一部分 定義】<br /><br />個人資訊：指以電子或者其他方式記錄的能夠單獨或者與其他資訊結合識別特定自然人身份或者反映特定自然人活動情況的各種資訊。個人敏感資訊：指包括身份證件號碼、個人生物識別資訊、銀行帳號、財產資訊、行蹤軌跡、交易資訊、14歲以下（含）兒童資訊等的個人資訊（我們將在本隱私權政策中對具體個人敏感資訊以粗體進行顯著標識）。個人資訊刪除：指在實現日常業務功能所涉及的系統中去除個人資訊的行為，使其保持不可被檢索、訪問的狀態。兒童：指不滿十四周歲的未成年人。<br /><br /><br />【第二部分  隱私政策】</p><br /><br /><br />"
        }
        setNavSelectItem={setNavSelectItem}
      />
    </PageContainer>
  );
};

export default Announcement;
