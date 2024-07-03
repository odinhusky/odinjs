import {useEffect, useState} from "react";
import {usePostActivityClaimMutation} from "../../../../external";


export type IActivityRedeemState = {
    isError: boolean;
    message: string;
}

export const useActivityRedeem = () => {
    const [activityRedeemState, setActivityRedeemState] = useState<IActivityRedeemState>();
    const [triggerActivityClaim, {data, isError, isSuccess}] = usePostActivityClaimMutation();

    useEffect(() => {
        if (isError) {
            setActivityRedeemState({
                isError: true,
                message: "Retirada sem sucesso. Por favor, tente novamente ou entre em contato com o serviço de atendimento ao cliente para assistência."
            });
            return
        }
        if (isSuccess) {
            setActivityRedeemState({
                isError: false,
                message: "O bônus foi reivindicado."
            });
            return
        }
    }, [isError, isSuccess])

    const useRedeem = (activityType: string) => {
        triggerActivityClaim({
            activityType: activityType
        })
    }

    return {
        useRedeem,
        activityRedeemState
    }
}