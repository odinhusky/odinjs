import {IVIPGradePageProps} from "../../../index";
import CaretDown from '../images/CaretDown.png';
import CaretUP from '../images/CaretUp.png';
import {VerticalVIPButtonList} from "../components/VerticalVIPButtonList";
import {ProgressBar} from "../../../../../components-bs/ProgressBar";
import {formatLocaleMoney} from "../../../../../utils/format";
import {VIP0Text} from "../components/VIP0Text";
import {VIPInfoTab} from "../components/VIPInfoTab";
import {useScrollSelectFixCenter} from "../../../../../hooks/useScrollSelectFixCenter";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {environment} from "../../../../../../../environments/environment";
import {useVIPGradePage} from "../../../hook/useVIPGradePage";


export const DesktopVIPGradePage = ({
                                        currentLevel,
                                        allLevelInfo,
                                        allSignInConfig,
                                        userVIPInfo,
                                        signInTotalDays
                                    }: IVIPGradePageProps) => {
    const {selectedVIP, setSelectedVIP} = useVIPGradePage(currentLevel, userVIPInfo?.data.vip_score)
    const {scrollWrapperRef} = useScrollSelectFixCenter(selectedVIP, true);

    if (allLevelInfo.length === 0) return <div></div>

    return (
        <PageContainer>
            <img src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip.png`}
                 alt="statue"
                 className='mt-10 w-full'/>

            {/*VIP 進度卡*/}
            <div className='w-full h-[298px] flex rounded-2xl bg-[var(--grayscale-20)] mt-10'>

                {/*VIP選單*/}
                <div
                    className='w-[15%] border-r border-r-[var(--grayscale-40)] flex flex-col items-center group cursor-pointer'>
                    <img alt='up' src={CaretUP}
                         className='invisible text-white group-hover:visible w-[20px] h-[20px] my-1' onClick={() => {
                        if (selectedVIP !== 0) {
                            setSelectedVIP(selectedVIP - 1)
                        }
                    }}/>
                    <div
                        className='h-[242px] w-[78%] py-1 overflow-y-scroll vip-tab-items flex flex-col gap-4 items-center relative'
                        ref={scrollWrapperRef}
                    >
                        <VerticalVIPButtonList
                            selectedVIP={selectedVIP}
                            currentVIP={currentLevel}
                            onSelect={(vip) => setSelectedVIP(vip)}
                        />
                    </div>
                    <img alt='down' src={CaretDown}
                         className='invisible text-white group-hover:visible w-[20px] h-[20px] my-1' onClick={() => {
                        if (selectedVIP !== 25) {
                            setSelectedVIP(selectedVIP + 1)
                        }
                    }}/>
                </div>

                {/*VIP 進度卡右側*/}
                <div className='w-[85%] pt-10 pl-10 pr-5 pb-9 flex items-center gap-5'>
                    {/*VIP Icon*/}
                    <div className='w-[218px] flex-shrink-0 h-full flex items-center'>
                        <img src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP}.png`} alt="vipIcon"/>
                    </div>

                    {/*VIP進度條*/}
                    {
                        selectedVIP !== 0 && (
                            <div className='w-full h-full flex flex-col justify-center'>
                                <div
                                    className='w-full flex justify-between text-base font-medium text-[var(--grayscale-50)]'>
                                    <div>Valor total da recarga</div>
                                    <div>
                                        <span
                                            className='text-white'>R$ {formatLocaleMoney((userVIPInfo?.data?.vip_score || 0) / 100)}</span>
                                        /R$ {formatLocaleMoney(allLevelInfo[selectedVIP].rechargeAmountLimit / 100)}
                                    </div>
                                </div>
                                <ProgressBar
                                    className='h-14 py-[18px] px-5 mt-2 text-white text-xl'
                                    progress={
                                        ((userVIPInfo?.data?.vip_score || 0) / 100) / (allLevelInfo[selectedVIP].rechargeAmountLimit / 100 || 1)
                                    }
                                />
                                <div
                                    className='w-full flex justify-between text-base font-medium text-[var(--grayscale-50)] mt-5'>
                                    <div>Número total de apostas</div>
                                    <div>
                                        <span
                                            className='text-white'>R$ {formatLocaleMoney((userVIPInfo?.data?.flow || 0) / 100)}</span>
                                        /R$ {formatLocaleMoney(allLevelInfo[selectedVIP].flowLimit / 100)}
                                    </div>
                                </div>
                                <ProgressBar
                                    className='h-14 py-[18px] px-5 mt-2 text-white text-xl'
                                    progress={
                                        ((userVIPInfo?.data?.flow || 0) / 100) / (allLevelInfo[selectedVIP].flowLimit / 100 || 1)
                                    }
                                />
                            </div>
                        )
                    }

                    {/*VIP 0提示文字*/}
                    {
                        selectedVIP === 0 && <VIP0Text/>
                    }
                </div>
            </div>


            {/*VIP INFO TAB*/}
            <VIPInfoTab className='mt-9' signInTotalDays={signInTotalDays} allLevelInfo={allLevelInfo}
                        allSignInConfig={allSignInConfig}/>
        </PageContainer>
    )
}
