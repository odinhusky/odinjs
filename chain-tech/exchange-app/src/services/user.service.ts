import { AxiosRequestConfig } from "axios";
import { CreatePaymentRequest, checkPhoneRequest, ResetFinancePasswordRequest, SetGoogleSecretRequest, VerifyPhoneRequest, SetFinancePasswordRequest, ResetPasswordRequest, GetOtcOrderDayReportRequest, UpdateOtcUserRequest, ResetGoogleSecretRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class UserService {
    static serviceApiPrefix = "/user"

    getUserInfo() {
        return http.get<any, ExchangeResponse<User>>(`${UserService.serviceApiPrefix}`);
    }

    getPayments() {
        return http.get<any, ExchangeResponse<Payment[]>>(`${UserService.serviceApiPrefix}/payment`);
    }

    deletePayments(id: string) {
        return http.delete<any, ExchangeResponse<Payment[]>>(`${UserService.serviceApiPrefix}/payment/${id}`);
    }

    createPayment(request: CreatePaymentRequest){
        return http.post<CreatePaymentRequest, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/payment`, request);
    }

    verifyPhone(request: VerifyPhoneRequest) {
        return http.post<any, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/phone/verify-code`, request);
    }

    checkPhone(request: checkPhoneRequest) {
        return http.post<any, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/phone/check-code`, request);
    }

    getGoogleSecret() {
        return http.get<any, ExchangeResponse<string>>(`${UserService.serviceApiPrefix}/google-auth`);
    }

    setGoogleSecret(request: SetGoogleSecretRequest) {
        return http.post<any, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/google-auth`, request);
    }

    verifyGoogleSecret(request: SetGoogleSecretRequest) {
        return http.post<any, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/google-auth/verify`, request);
    }

    applyKyc(request: FormData) {
        /*
         *  axios send form-data bug, downgrade to version 0.26.1 and use below config to fix
         */
        const config: AxiosRequestConfig<any> = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: data => {
                return data
            }
        }
        return http.post<any, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/kyc`, request, config);
    }

    getSecurity() {
        return http.get<any, ExchangeResponse<UserSecurity>>(`${UserService.serviceApiPrefix}/security`);
    }

    setFinancePassword(request: SetFinancePasswordRequest) {
        return http.post<SetFinancePasswordRequest, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/finance-password`, request);
    }

    resetFinancePassword(request: ResetFinancePasswordRequest) {
        return http.patch<ResetFinancePasswordRequest, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/reset/finance-password`, request);
    }

    resetPassword(request: ResetPasswordRequest){
        return http.post<ResetPasswordRequest, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/reset/password`, request);
    }

    resetGoogleSecret(request: ResetGoogleSecretRequest){
        return http.post<ResetGoogleSecretRequest, ExchangeResponse<any>>(`${UserService.serviceApiPrefix}/reset/google-auth`, request);
    }

    static otcServiceApiPrefix = "/otc/api/user"

    getOtcUserInfo(account: string) {
        return http.get<any, OtcUser>(`${UserService.otcServiceApiPrefix}/${account}/`);
    }

    updateOtcUserInfo(account: string, request: UpdateOtcUserRequest) {
        return http.put<UpdateOtcUserRequest, OtcUser>(`${UserService.otcServiceApiPrefix}/${account}`, request);
    }

    getAdvertisementCondition(account: string) {
        return http.get<any, AdvertisementCondition>(`${UserService.otcServiceApiPrefix}/${account}/advertiserLevel/condition`);
    }

    setAdvertisementLevel(account: string, level: number){
        return http.put<any, OtcUser>(`${UserService.otcServiceApiPrefix}/${account}/advertiserLevel/${level}`);
    }

    getOtcOrderReport(account: string, request: GetOtcOrderDayReportRequest){
        let queryParams = ""
        if (request.all!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}all=${request.all}`
        if (request.status!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}status=${request.status}`
        if (request.type!==undefined) queryParams = `${queryParams}${queryParams ? "&" : "?"}type=${request.type}`
        return http.get<any, UserOtcOrderReport>(`${UserService.otcServiceApiPrefix}/${account}/otcOrders/statistics${queryParams}`);
    }

}

export default new UserService();