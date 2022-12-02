/* 引入styled components */
import styled from "styled-components";

/* 下面放圖片 */

import Left from "../../assets/ProfileSetting/left.png";
import arrow from "../../assets/profile/arrow2.png";


import Footer from "../../components/footer/PageFooter";

import { Link } from "react-router-dom";

import api from "../../common/api"
import LoadingOverlay from 'react-loading-overlay-ts';

import {useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// page-style compoents start:

const PageContainer = styled.div`
  height: 100vh ;
  widht: 100%;
  display: flex ;
  flex-direction: column ;
`;

const TopArea = styled.div`
  height:50px;
  line-height:50px;
  box-shadow: 0px 2px 4px rgba(143, 141, 162, 0.07);
  margin-bottom:2px;
`;

const TopAreaRight = styled.div`
  width: 100% ;
  display: flex ;
  justify-content: space-between;
`;

const AreaSpace = styled.div`
  padding: 20px;
  margin: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  background:#F4F4F6;
`;
const AreaSpace2 = styled.input`
  padding: 20px;
  border-radius: 4px;
  width:60%;
  margin-left:20px;
  background:#F4F4F6;
  color:#383743;
  border:none;
`;

const AreaSpace3 = styled.div`
  margin-bottom:20px;
  display:flex;
  justify-content: space-between;
  background: #fff ;
  opacity: 0.6;
`;

const AreaSpace4 = styled.div`
  padding: 10px;
  margin: 20px;
  background: #fff ;
  opacity: 0.6;
  border-radius: 4px;
  background:#F4F4F6;
`;

const AreaCodeAlign = styled.div`
  display:flex;
  justify-content: space-between;
`;

const Words = styled.input`
  font-size:15px;
  line-height:18px;
  color:#383743;
  border:none;
  background:none;
  width:100%;
`;

const Words2 = styled.button`
  font-size:15px;
  color: #A60008;
  border:none;
  background:transparent;
  width:150px;
`;

const Words3 = styled.button`
  font-size:15px;
  color: #383743;
  text-align:left;
  margin-top:5px;
  padding:10px;
  border:none;
  background:none;
  width:100%;
`;

const SubmitButton = styled.button`
  display: flex, 
  justify-content: center;
  border: none ;
  border-radius: 4px ;
  height: 44px ;
  width: 90% ;
  background: rgb(211,47,47,1);
  margin-left:20px;
  margin-top:90px;
`;

const SubmitButtonWord = styled.div`
  color:#FFFFFF;
  font-size:14px;
  text-align:center;
  border: none ;
`;

const ArrowContent = styled.img`
  margin-left:13px;
  width: 16px;
  height: 16px;
`;

const RightButtunArrow = styled.img`
  margin-left:13px;
  width: 7.41px;
  height: 12px;
  color:#BDBCC8;
  margin-top:7px;
`;
const LeftButton = styled.button`
  background: #fff ;
  border: none ;
  margin-top:5px;
`;

const RightButtun = styled.button`
  margin-right:10px;
  display:flex;
  background: none;
  border: none ;
  margin-top:5px;
  color: #BDBCC8;
`;

const Setting1 = styled.div`
  display: flex;
  justify-content: center;
  color: #383743 ;
  fontSize: 16px ;
  font-weight: bold;
  margin-right:40px;
`;

const Areaword = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 23px;
  color:#5F5C70;
  font-size:13px;
`;

const Inside = styled.div`
  background: #FFFFFF;
  flex: 1;
`;
//page-style end 

/* 下面的要把style都丟上去style compoents  */

const ResetPhoneNumber = () => {
  const [phone, setPhone] = useState("")
  const [count,setCount] = useState(300)
  const [startCount,setStartCount] = useState(false)
  const [code, setCode] = useState("")
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(()=>{
      setTimeout(()=>{
        if(count > 0 && startCount){
          setCount(c => c - 1)
        }
      },1000)
    
  },[count,startCount])

  return (
    <LoadingOverlay
      active={loading}
      spinner
    >
    <PageContainer>

      <TopArea>

        < TopAreaRight>

          <Link to="/safe-setting">
            <LeftButton>
              <ArrowContent src={Left} alt="左箭頭" />
            </LeftButton>
          </Link>
          <Setting1>手機號碼驗證</Setting1>
          <div> </div>
        </ TopAreaRight>


      </TopArea>


      <Inside>

        {/* <Notice>
          <NoticeP>為了你的帳戶安全，請謹慎選擇需要重置的項目，系統將根據您的操作行為決定是否禁用提現48小時。
          </NoticeP>
        </Notice> */}

        <Areaword>區碼</Areaword>
        <AreaSpace4
        >
          <AreaCodeAlign>
            <Words3>
              +{localStorage.getItem("setting-phoneCode") ? localStorage.getItem("setting-phoneCode"): 886}
            </Words3>
            <RightButtun>
              <Link to="/setting-area-zone">
                <RightButtunArrow src={arrow} alt="arrow" />
              </Link>
            </RightButtun>
          </AreaCodeAlign>
        </AreaSpace4>

        <Areaword>{t("mobile")}</Areaword>
        <AreaSpace>
          <Words placeholder="輸入手機號碼" onChange={(e)=>{setPhone(e.target.value)}} />
        </AreaSpace>
        <Areaword>簡訊驗證碼</Areaword>

        <AreaSpace3>
          <AreaSpace2 placeholder="輸入驗證碼" onChange={(e)=>{setCode(e.target.value)}} />
          { startCount && count !== 0 && <Words2>
            {
            Math.floor(count/60)}:{(count - Math.floor(count/60)*60) < 10 ? "0"+(count - Math.floor(count/60)*60) :(count - Math.floor(count/60)*60)
            }
          </Words2>}
          { !startCount &&
          <Words2 onClick={()=>{
            if(phone){
              api.postData("/user/phone/verify-code",{phone: localStorage.getItem("setting-phoneCode") ? localStorage.getItem("setting-phoneCode") + phone : "886" + phone}).then(x=>{
                setStartCount(true)
              })
            }else{
              alert("請輸入手機號碼")
            }          
          }}>           
              取得驗證碼        
          </Words2>
        }
        { count === 0  &&
          <Words2 onClick={()=>{
            api.postData("/user/phone/verify-code",{phone:localStorage.getItem("setting-phoneCode") + phone}).then(x=>{
              console.log(x)
              setStartCount(true)
              setCount(300)
            })
          }}>           
              重新發送       
          </Words2>
        }
        </AreaSpace3>
        <SubmitButton onClick={()=>{
          if(!phone){
            alert("請輸入手機號碼")
          }else if(!code){
            alert("請輸入驗證碼")
          }else{
            setLoading(true)

            api.postData("/user/phone/check-code",{phone:localStorage.getItem("setting-phoneCode") ? localStorage.getItem("setting-phoneCode") + phone : "886" + phone,code:code}).then(x=>{
              setLoading(false)

              if(x.status !== 400){
                navigation(-1)
              }else{
                alert(x.data.msg)
              }
            })
          }
        }}>
          <SubmitButtonWord>送出</SubmitButtonWord>
        </SubmitButton>


      </Inside >
      <Footer />
    </PageContainer >
    </LoadingOverlay>
  );
}

export default ResetPhoneNumber
