import {IVIPGradePageProps} from "../../../index";
import {formatLocaleMoney} from "../../../../../utils/format";
import {ProgressBar} from "../../../../../components-bs/ProgressBar";
import {VIPInfoTab} from "../components/VIPInfoTab";
import {VIPButtonList} from "../components/VIPButtonList";
import {VIP0Text} from "../components/VIP0Text";
import {useScrollSelectFixCenter} from "../../../../../hooks/useScrollSelectFixCenter";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {environment} from "../../../../../../../environments/environment";
import {useVIPGradePage} from "../../../hook/useVIPGradePage";


export const MobileVIPGradePage = ({
                                       currentLevel,
                                       allLevelInfo,
                                       allSignInConfig,
                                       userVIPInfo,
                                       signInTotalDays
                                   }: IVIPGradePageProps) => {
    const {selectedVIP, setSelectedVIP} = useVIPGradePage(currentLevel, userVIPInfo?.data.vip_score);
    const {scrollWrapperRef} = useScrollSelectFixCenter(selectedVIP, false);

    if (allLevelInfo.length === 0) return <div></div>

    return (
        <PageContainer>
            <img src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip_m.png`}
                 alt="statue" className='mt-4 w-full'/>
            <div
                className='w-full mt-4 overflow-x-scroll vip-tab-items flex gap-2 items-center relative'
                ref={scrollWrapperRef}
            >
                <VIPButtonList
                    selectedVIP={selectedVIP}
                    currentVIP={currentLevel}
                    onSelect={(vip) => setSelectedVIP(vip)}
                />
            </div>

            {/*VIP 進度卡*/}
            <div className='w-full h-fit flex rounded-lg bg-[var(--grayscale-20)] mt-3 p-2'>
                {/*VIP進度條*/}
                {
                    selectedVIP !== 0 && (
                        <div className='w-full h-full flex flex-col justify-center'>
                            <div
                                className='w-full flex justify-between gap-2 items-end text-sm font-medium text-[var(--grayscale-50)]'>
                                <div className='flex-1'>Valor total da recarga</div>
                                <div>
                                    <span
                                        className='text-white'>R$ {formatLocaleMoney((userVIPInfo?.data?.vip_score || 0) / 100)}</span>
                                    /R$ {formatLocaleMoney(allLevelInfo[selectedVIP].rechargeAmountLimit / 100)}
                                </div>
                            </div>
                            <ProgressBar
                                progressClassName='h-2'
                                className='h-7 py-1 px-2 mt-1 text-white text-sm'
                                progress={
                                    ((userVIPInfo?.data?.vip_score || 0) / 100) / (allLevelInfo[selectedVIP].rechargeAmountLimit / 100 || 1)
                                }
                            />
                            <div
                                className='w-full flex justify-between gap-2 items-end text-sm font-medium text-[var(--grayscale-50)] mt-2'>
                                <div className='flex-1'>Número total de apostas</div>
                                <div>
                                    <span
                                        className='text-white'>R$ {formatLocaleMoney((userVIPInfo?.data?.flow || 0) / 100)}</span>
                                    /R$ {formatLocaleMoney(allLevelInfo[selectedVIP].flowLimit / 100)}
                                </div>
                            </div>
                            <ProgressBar
                                progressClassName='h-2'
                                className='h-7 py-1 px-2 mt-1 text-white text-sm'
                                progress={
                                    ((userVIPInfo?.data?.flow || 0) / 100) / (allLevelInfo[selectedVIP].flowLimit / 100 || 1)
                                }
                            />
                        </div>
                    )
                }

                {/*VIP 0提示文字*/}
                {
                    selectedVIP === 0 && <VIP0Text className='text-sm'/>
                }

            </div>

            {/*VIP INFO TAB*/}
            <VIPInfoTab className='mt-3' signInTotalDays={signInTotalDays} allLevelInfo={allLevelInfo}
                        allSignInConfig={allSignInConfig}/>

        </PageContainer>
    )
}
