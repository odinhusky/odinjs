import React, { useState, useEffect } from "react";

// - Images
import { COLORS } from "@/constants/colors";
import Cancel from "@/assets/icon/cancel.png";
import { ReactComponent as DoneIcon } from "@/assets/icon/done.svg";

// ^ Plugins
import api from "../../common/api";
import { useTranslation } from "react-i18next";

// = Styled Components
import styled from "styled-components";

function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(new Date(date).getHours() + hours));
}

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
const SelectContainer = styled.div`
  flex: 1;
  padding: 11px 16px;
  flex: 1;
`;
const SelectTitle = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #383743;
  margin-bottom: 20px;
`;
const SelectTable = styled.ul`
  width: 100%;
`;
const SelectItem = styled.li`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f6;
  font-weight: 400;
  font-size: 15px;
  color: #383743;
`;

const NoticeTitles = styled.p`
  display: block;
  font-weight: 450;
  font-size: 20px;
  color: #383743;
  margin-right: 10px;
  margin-bottom: 5px;
`;
const NoticeDescription = styled.div`
  display: inline;
  align-items: center;
  position: relative;
`;

const NoticeContent = styled.p`
  font-weight: 350;
  margin-left: 30px;
  font-size: 14px;
`;

const NoticeTime = styled.p`
  font-weight: 300;
  margin-left: 30px;
  font-size: 10px;
  margin-bottom: 10px;
  margin-top: 20px;
`;

interface ChangeNoticeModalProps {
  onClose: () => void;
  currentNotice: string;
  handleCurrentNotice: (lang: string) => void;
}

export const NoticeModal = ({
  currentNotice,
  onClose,
}: // currentNotice,
// handleCurrentNotice
ChangeNoticeModalProps) => {
  // $ init data
  const { t } = useTranslation();

  // # state
  const [curNotice, setCurNotice] = useState({});
  const [noticeList, setNoticeList] = useState<any[]>([]);

  /**
   * @author nick
   * @description 根據 API 取得的 noticeObj 製作出有哪些通知的陣列選單
   */
  useEffect(() => {
    api.getData("/user/mailBox").then((x) => {
      // console.log(x);
      setNoticeList(x.data);
      setCurNotice(x.data[0]);
    });
  }, []);

  return (
    <>
      <HeaderContainer>
        <HeaderLeft>
          <SelectIcon src={Cancel} alt="cancel" onClick={onClose} />
        </HeaderLeft>
        <HeaderRight></HeaderRight>
      </HeaderContainer>
      <SelectContainer>
        <SelectTitle>{t("noticeCenter")}</SelectTitle>
        <SelectTable>
          {noticeList.map((notice) => {
            return (
              <SelectItem
                key={notice.id}
                onClick={() => {
                  setCurNotice({...notice, isRead: true});
                  // TODO: set notice isRead API
                  currentNotice = notice.content;
                  console.log(curNotice);
                }}
              >
                <NoticeDescription>
                  <NoticeTitles>{`✉️ ${notice.title}`}</NoticeTitles>
                  <NoticeContent>{notice.content}</NoticeContent>
                  <NoticeTime>
                    {addHoursToDate(notice.createdDate, 8).toLocaleString()}
                  </NoticeTime>
                </NoticeDescription>
                {!notice.isRead && <DoneIcon />}
              </SelectItem>
            );
          })}
        </SelectTable>
      </SelectContainer>
    </>
  );
};

export default NoticeModal;
