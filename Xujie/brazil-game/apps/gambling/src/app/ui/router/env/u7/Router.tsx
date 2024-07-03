import {Route, Routes} from 'react-router';
import {PageOrModalPathEnum} from "../../../PageOrModalPathEnum";
import {IndexPage} from "../../../pages/IndexPage";
import {ErrorPage} from "../../../pages/ErrorPage";
import {InvitePage} from "../../../pages/InvitePage";
import {WalletPage} from "../../../pages/WalletPage";
import {GameRecordPage} from "../../../pages/GameRecordPage";
import {VIPGradePage} from "../../../pages/VIPGradePage";
import {DailySignInPage} from "../../../pages/DailySignInPage";
import {DailySignInRecordPage} from "../../../pages/DailySignInRecordPage";
import {SettingPage} from "../../../pages/SettingPage";
import {CompanyProfilePage} from "../../../pages/CompanyProfilePage";
import {InitialChargePage} from "../../../pages/InitialChargePage";
import {RechargeActivityPage} from "../../../pages/RechargeActivityPage";
import {TelegramPage} from "../../../pages/TelegramPage";
import {LicensePage} from "../../../pages/LicensePage";
import {InviteSettlementRecordPage} from "../../../pages/InviteSettlementRecordPage";
import {MyPage} from "../../../pages/MyPage";
import {WalletDepositNextPage} from "../../../pages/WalletDepositNextPage";
import {GamePage} from '../../../pages/GamePage';
import {NotificationPage} from "../../../pages/NotificationPage";
import {GameSearchPage} from "../../../pages/GameSearchPage";
import {PrivacyAgreementPage} from "../../../pages/PrivacyAgreementPage";
import {PageTemplate} from "../../../pageTemplate";
import TermsOfServicePage from "../../../pages/TermsOfServicePage";
import {useUIRouter} from "../../hooks/useUIRouter";
import {ActivityPage} from "../../../pages/ActivityPage";
import {BoxPage} from "../../../pages/ActivityPage/BoxPage";
import {GameHallPage} from "../../../pages/GameHallPage";
import { environment } from 'apps/gambling/src/environments/environment';

export const AppRouter = () => {

    const {
        isSetup,
        contextHolder,
    } = useUIRouter();

    return (
        <>
            {isSetup && (
                <Routes>
                    <Route path={PageOrModalPathEnum.IndexPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: true, customerService: true, activity: true}
                            }}
                        >
                            <IndexPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.GameHallPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: true, customerService: true, activity: true}
                            }}
                        >
                            <GameHallPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.InvitePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <InvitePage
                                isFromActivity={false}/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.InviteSettlementRecordPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <InviteSettlementRecordPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.WalletPage} element={(
                        <PageTemplate
                            header={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <WalletPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.WalletDepositNextPage} element={(
                        <PageTemplate
                            header={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <WalletDepositNextPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.GameRecordPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: false,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <GameRecordPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.VIPGradePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <VIPGradePage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.DailySignInPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <DailySignInPage
                                isFromActivity={false}
                            />
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.DailySingInRecordPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <DailySignInRecordPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.SettingPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: environment.uVersion === 'u7' ? false : true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <SettingPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.PrivacyAgreementPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <PrivacyAgreementPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.TermsOfService} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <TermsOfServicePage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.CompanyProfilePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <CompanyProfilePage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.InitialChargePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <InitialChargePage
                                isFromActivity={false}
                            />
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.RechargeActivityPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <RechargeActivityPage
                                isFromActivity={false}
                            />
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.LicensePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <LicensePage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.TelegramPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={{
                                desktop: {download: true, customerService: true, manager:true}, 
                                mobile: {download: false, customerService: false, activity: false}
                            }}
                        >
                            <TelegramPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.GamePage} element={(
                        <PageTemplate
                            header={{
                                mobile: false,
                                tablet: false,
                                desktop: false,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: false,
                            }}
                            tabBar={{
                                mobile: false,
                                tablet: false,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: false,
                                desktopOverChildren: false,
                            }}
                            showToolboxConfig={false}
                        >
                            <GamePage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.GameSearchPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                        >
                            <GameSearchPage/>
                        </PageTemplate>
                    )}/>

                    {/*NOTE: Mobile*/}
                    <Route path={PageOrModalPathEnum.MyPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                            // showToolboxConfig={{mobile: {download: true, customerService: true, activity: false}}}
                        >
                            <MyPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.NotificationPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                        >
                            <NotificationPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.ActivityHallPage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                        >
                            <ActivityPage/>
                        </PageTemplate>
                    )}/>

                    <Route path={PageOrModalPathEnum.BoxInvitePage} element={(
                        <PageTemplate
                            header={{
                                mobile: true,
                                tablet: true,
                                desktop: true,
                            }}
                            footer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                            }}
                            tabBar={{
                                mobile: true,
                                tablet: true,
                                desktop: false,
                            }}
                            menuDrawer={{
                                mobile: false,
                                tablet: false,
                                desktop: true,
                                desktopOverChildren: false,
                            }}
                        >
                            <BoxPage isFromActivity={false}/>
                        </PageTemplate>
                    )}/>

                    {/*NOTE: Desktop*/}
                    <Route path="/v2/error" element={<ErrorPage/>}/>

                </Routes>
            )}

            {contextHolder}
        </>
    );
};
