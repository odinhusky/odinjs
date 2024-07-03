import {useGetActivityLobbyQuery} from "../../external";
import {useMemo} from "react";
import {QueueModalLang} from "../../reduxStore/appSlice";


// 邀請功能互斥
export const useInviteInCompatible = () => {
    // 原 GlobalConfig.box_flag 判別
    // const {data: configData} = useGetGlobalConfigQuery(null);
    const {isShowBox, inviteTitle} = useGetActivityLobbyQuery({}, {
        selectFromResult: (result) => ({
            isShowBox: result?.data?.data.some(item => item.type === QueueModalLang.BOX_INVITE_REWARD.upper),
            inviteTitle: result?.data?.data.find(item => item.type === QueueModalLang.BOX_INVITE_REWARD.upper)?.bannerContext
        })
    });

    // 邀請寶箱互斥
    const isShowBoxInvite = useMemo(() => {
        if (isShowBox) {
            return isShowBox
            //&& configData?.data?.box_flag === 1;
            // 原 GlobalConfig.box_flag 判別
        } else {
            return undefined;
        }
    }, [isShowBox]);


    const boxInviteTitle = useMemo(() => {
        return isShowBoxInvite ? inviteTitle : undefined
    }, [inviteTitle, isShowBoxInvite])

    return {
        boxInviteTitle,
        isShowBoxInvite
    }
}