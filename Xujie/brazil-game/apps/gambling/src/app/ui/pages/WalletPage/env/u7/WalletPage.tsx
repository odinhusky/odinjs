import { PageContainer } from '../../../../components-bs/PageContainer';
import { IWalletPage } from '../pernambucana/WalletPage';
import { BalanceSection } from './BalanceSection';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import cx from '../../../../utils/cx';
import { DepositPanel } from '../../components/deposit/DepositPanel';
import { WithdrawPanel } from '../../components/withdraw/WithdrawPanel';
import { RecordPanel } from './RecordPanel';
import WalletTabsGroup from './components/WalletTabsGroup';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { ProgressBar } from '../../../../components-bs/ProgressBar';

export const WalletPage = ({
  totalSectionValues,
  panelMode,
  setPanelMode,
  setRecordPanelMode,
  rechargeData,
  recordPanelMode,
  damaResult,
}: IWalletPage) => {
  const { onClickToIndex } = usePageNavigate();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  return (
    <PageContainer className="flex flex-col mobile:gap-8 gap-5 text-white mb-0 pt-3">
      <div className="relative mobile:block flex">
        <BackNavigation
          title={isMobile ? ' ' : 'Retornar'}
          className={cx(
            'text-base leading-6 tablet:text-xl tablet:leading-7',
            {
              "!p-0":isMobile
            }
          )}
          onClick={onClickToIndex}
          contentClassName={
            isTablet ? '!w-[20%] !ml-0' : isMobile ? '!w-auto !ml-0' : 'w-full'
          }
        />
        <div className="mobile:absolute relative top-0 left-0 tablet:hidden flex w-full justify-center items-center">
          <WalletTabsGroup panelMode={panelMode} setPanelMode={setPanelMode} />
        </div>
      </div>

      <div>
        <BalanceSection balanceSectionValue={totalSectionValues} />
        {damaResult.isShowDama && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="text-sm text-[var(--transparent-white-70)] font-medium ">
              Progresso atual de apostas
            </div>
            <ProgressBar
              className="bg-[var(--transparent-white-10)] py-2 px-3 rounded-lg"
              progressClassName=""
              progressColor="bg-linear-3-main shadow-[0px_-2px_4px_#00000040_inset,0px_2px_4px_#FFFFFF40_inset]"
              percentClassName=""
              barClassName=""
              progress={damaResult.progressValue}
            />
          </div>
        )}
      </div>

      <div className="tablet:flex hidden justify-center items-center">
        <WalletTabsGroup panelMode={panelMode} setPanelMode={setPanelMode} />
      </div>

      <div>
        <div>
          {panelMode === 'deposit' ? (
            <DepositPanel data={rechargeData?.data} />
          ) : null}

          {panelMode === 'withdraw' ? (
            <WithdrawPanel
              onClickToWithdrawRecord={() => {
                setPanelMode('record');
                setRecordPanelMode('withdraw');
              }}
            />
          ) : null}

          {panelMode === 'record' ? (
            <RecordPanel recordPanelMode={recordPanelMode} />
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
};
