import { CheckAccountRequest, LoginRequest, SendEmailRequest, CheckEmailRequest, RegisterRequest, ForgotPasswordRequest } from "interfaces/request.interface";
import http from "utils/http-common";

class AuthService {
    static serviceApiPrefix = "/auth"

    login(request: LoginRequest) {
        return http.post<LoginRequest, ExchangeResponse<LoginResponse>>(`${AuthService.serviceApiPrefix}/login`, request);
    }

    sendEmail(request: SendEmailRequest){
        return http.post<LoginRequest, ExchangeResponse<any>>(`${AuthService.serviceApiPrefix}/email/verify-code`, request);
    }

    checkEmail(request: CheckEmailRequest){
        return http.post<CheckEmailRequest, ExchangeResponse<any>>(`${AuthService.serviceApiPrefix}/email/check-code`, request);
    }

    register(request: RegisterRequest){
        return http.post<RegisterRequest, ExchangeResponse<any>>(`${AuthService.serviceApiPrefix}/register`, request);
    }

    forgotPassword(request: ForgotPasswordRequest){
        return http.post<ForgotPasswordRequest, ExchangeResponse<any>>(`${AuthService.serviceApiPrefix}/forgot-password`, request);
    }

    checkAccount(request: CheckAccountRequest){
        return http.post<CheckAccountRequest, ExchangeResponse<any>>(`${AuthService.serviceApiPrefix}/account/check`, request);
    }
}

export default new AuthService();