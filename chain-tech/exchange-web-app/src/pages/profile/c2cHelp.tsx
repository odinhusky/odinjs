import React, { } from "react";
import C2CHeader from "../../components/header/c2cHelpHeader";
import styled from "styled-components";



const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding:12;
`;

const C2cNotification = () => {
  return (
    <PageContainer>
          <C2CHeader />
          <p style={{padding:12,color:"#383743",fontSize:15,fontWeight:400}}>1. 進入官網，點擊右上角【註冊】按鈕。</p>
          <p style={{padding:12,color:"#383743",fontSize:15,fontWeight:400}}>2. 點擊後跳轉至註冊頁面，按照要求輸入電子郵件信箱和密碼。
仔細閱讀《服務條款》後勾選並點擊【註冊】。
安全提示：
為了帳戶安全，設置密碼時，請確保至少 8 位字符。其中必須包含大寫字母和 1 位數字。
若需要填寫推薦人 ID，請與推薦人確認後填入。註冊成功後，推薦關係將無法更改。</p>
          <p style={{padding:12,color:"#383743",fontSize:15,fontWeight:400}}>3. 向右滑動完成拼圖，進行安全驗證。
</p>
          <p style={{padding:12,color:"#383743",fontSize:15,fontWeight:400}}>4. 在彈窗中按提示勾選對應的選項。</p>


          
    </PageContainer>
  );
};

export default C2cNotification;
