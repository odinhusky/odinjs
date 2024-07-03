import {notification} from 'antd';
import React, {useState} from 'react';

import {usePostUserUpdateMutation} from '../../../external';
import {promiseHandler} from '../../../gateway/promiseHanlder';
import {AppLocalStorage} from '../../../persistant/localstorage';
import {IOpenNotificationWithIcon} from '../../pageTemplate';
import {AppLocalStorageKey} from "../../../persistant/AppLocalStorageKey";
import {EditUserInfoModalContent as CocoEditUserInfoModalContent} from './u1'
import {EditUserInfoModalContent as PEditUserInfoModalContent} from './p1'
import {EditUserInfoModalContent as U2EditUserInfoModalContent} from './u2'
import {renderByUVersion} from "../../utils/renderByUVersion";


interface IEditUserInfoModalProps {
    nickname: string;
    close: (done?: boolean) => void;
}

export const EditUserInfoModal = ({
                                      nickname,
                                      close,
                                  }: IEditUserInfoModalProps) => {
    const userInfo = JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}')
    const [userNickname, setUserNickname] = useState(nickname);
    const [nickNameInvalidatedMessage, setNickNameInvalidatedMessage] = useState('');
    const [triggerUpdateUserInfo, {isLoading}] = usePostUserUpdateMutation({});
    const [selectedAvatar, setSelectedAvatar] = useState(Number(userInfo.avatar) || 1)


    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (props: IOpenNotificationWithIcon) => {
        const type = props.type || 'error';
        const msg = props.message || 'Message';
        api[type]({
            message: msg,
            description: props.description,
        });
    };

    const handleConfirm = () => {
        if (nickNameInvalidatedMessage === '') {
            triggerUpdateUserInfo({
                token: AppLocalStorage.getItem(AppLocalStorageKey.token) || '',
                nickname: userNickname,
                avatar: `${selectedAvatar}`,
                birthday: '',
                mail: '',
                whatsAppUserName: '',
                facebookUserName: '',
                telegramUserName: '',
                twitterUserName:  '',
            }).then((response) => {
                promiseHandler.then(
                    response,
                    () => {
                        if ((response as any).data.code === 200) {
                            AppLocalStorage.setItem(
                                AppLocalStorageKey.userInfo,
                                JSON.stringify((response as any).data.data.user_info || '{}')
                            );
                            close(true);
                        }
                    },
                    openNotificationWithIcon
                );
            });
        }
    };

    return (
        <div
            className="z-[1005] fixed left-0 top-0 right-0 bottom-0 flex h-full w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.65)]"
            onClick={() => close()}
        >
            {contextHolder}
            {
                renderByUVersion({
                        "p1": (
                            <PEditUserInfoModalContent
                                userNickname={userNickname}
                                nickNameInvalidatedMessage={nickNameInvalidatedMessage}
                                selectedAvatar={selectedAvatar}
                                setUserNickname={setUserNickname}
                                setNickNameInvalidatedMessage={setNickNameInvalidatedMessage}
                                setSelectedAvatar={setSelectedAvatar}
                                handleConfirm={handleConfirm}
                                isLoading={isLoading}
                                close={close}
                            />
                        ),
                        "u1": (
                            <CocoEditUserInfoModalContent
                                userNickname={userNickname}
                                nickNameInvalidatedMessage={nickNameInvalidatedMessage}
                                selectedAvatar={selectedAvatar}
                                setUserNickname={setUserNickname}
                                setNickNameInvalidatedMessage={setNickNameInvalidatedMessage}
                                setSelectedAvatar={setSelectedAvatar}
                                handleConfirm={handleConfirm}
                                isLoading={isLoading}
                                close={close}
                            />
                        )
                    },
                    <U2EditUserInfoModalContent
                        userNickname={userNickname}
                        nickNameInvalidatedMessage={nickNameInvalidatedMessage}
                        selectedAvatar={selectedAvatar}
                        setUserNickname={setUserNickname}
                        setNickNameInvalidatedMessage={setNickNameInvalidatedMessage}
                        setSelectedAvatar={setSelectedAvatar}
                        handleConfirm={handleConfirm}
                        isLoading={isLoading}
                        close={close}
                    />
                )
            }
        </div>
    );
};
