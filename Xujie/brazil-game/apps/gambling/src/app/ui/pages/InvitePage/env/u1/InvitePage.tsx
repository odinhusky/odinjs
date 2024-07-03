import { useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { TabItem, Tabs } from '../../../../components-bs/TabItem/TabItem';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { IInvitePage } from '../..';
import { twMerge } from 'tailwind-merge';

export const InvitePage = (props: IInvitePage) => {
  const { onClickToIndex, onClickToActivity } = usePageNavigate();
  const {
    children,
    panelMode,
    setPanelMode,
    isFromActivity,
    level1RechargeData,
  } = props;
  const { isMobile } = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // TODO 預設關閉寶箱功能，避免後端設定預設開啟，待重新定義寶箱活動 [FRONTEND-98]
  // const box_flag = useSelector((rootState: RootState) => rootState.app.config.box_flag)

  return (
    <PageContainer>
      {/*{*/}
      {/*    !isMobile && (*/}
      {/*        <BackNavigation*/}
      {/*            className={'md:pb-2'}*/}
      {/*            onClick={isFromActivity ? onClickToActivity : onClickToIndex}*/}
      {/*        />*/}
      {/*    )*/}
      {/*}*/}

      <BackNavigation
        className={'pb-4'}
        onClick={isFromActivity ? onClickToActivity : onClickToIndex}
      />
      {
        <>
          <section
            className={
              'tab-item w-full flex flex-row justify-center item-center mb-4'
            }
          >
            <div>
              <Tabs className={'game-type-tab-list'}>
                <TabItem
                  mode={'howto'}
                  // pureColor={true}
                  background={'var(--primary-variant)'}
                  // activeBackground={"bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]"}
                  activeBackground={
                    'linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 100%);'
                  }
                  className={twMerge(
                    'px-6 text-white rounded-md mr-2 whitespace-nowrap text-sm sm:text-2xl',
                    panelMode !== 'howto' &&
                      'border border-solid border-[rgba(255,255,255,0.3)]'
                  )}
                  name={'Como convidar'}
                  active={panelMode === 'howto'}
                  size={'big'}
                  onClick={() => {
                    setPanelMode('howto');
                  }}
                />
                <TabItem
                  mode={'data'}
                  // pureColor={true}
                  background={'var(--primary-variant)'}
                  // activeBackground={"bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]"}
                  activeBackground={
                    'linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 100%);'
                  }
                  className={twMerge(
                    'px-6 text-white rounded-md whitespace-nowrap text-sm sm:text-2xl',
                    panelMode !== 'daily' &&
                      'border border-solid border-[rgba(255,255,255,0.3)]'
                  )}
                  name={'Dados diários'}
                  active={panelMode === 'daily'}
                  size={'big'}
                  onClick={() => {
                    setPanelMode('daily');
                  }}
                />
              </Tabs>
            </div>
          </section>
          {children}
        </>

        // TODO 預設關閉寶箱功能，避免後端設定預設開啟，待重新定義寶箱活動 [FRONTEND-98]
        // box_flag = 0 沒開寶箱所以顯示邀請
        // !box_flag ? (
        //         <>
        //             <section className={"tab-item w-full flex flex-row justify-center item-center mb-4"}>
        //                 <div>
        //                     <Tabs className={"game-type-tab-list"}>
        //                         <TabItem
        //                             mode={"howto"}
        //                             // pureColor={true}
        //                             background={"var(--primary-variant)"}
        //                             // activeBackground={"bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]"}
        //                             activeBackground={"linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 100%);"}
        //                             className={twMerge("px-6 text-white rounded-md mr-2 whitespace-nowrap text-sm sm:text-2xl",
        //                                 panelMode !== "howto" && 'border border-solid border-[rgba(255,255,255,0.3)]'
        //                             )}
        //                             name={"Como convidar"}
        //                             active={panelMode === "howto"}
        //                             size={"big"}
        //                             onClick={() => {
        //                                 setPanelMode("howto")
        //                             }}
        //                         />
        //                         <TabItem
        //                             mode={"data"}
        //                             // pureColor={true}
        //                             background={"var(--primary-variant)"}
        //                             // activeBackground={"bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]"}
        //                             activeBackground={"linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 100%);"}
        //                             className={twMerge("px-6 text-white rounded-md whitespace-nowrap text-sm sm:text-2xl",
        //                                 panelMode !== "daily" && 'border border-solid border-[rgba(255,255,255,0.3)]')}
        //                             name={"Dados diários"}
        //                             active={panelMode === "daily"}
        //                             size={"big"}
        //                             onClick={() => {
        //                                 setPanelMode("daily")
        //                             }}
        //                         />
        //                     </Tabs>
        //                 </div>
        //             </section>
        //             {children}
        //         </>
        //     ) :
        //     (
        //         <>
        //             <Modal isOpen={isModalOpen} onClose={closeModal}>
        //                 <p>This is a modal!</p>
        //             </Modal>
        //             <BoxSection openModal={openModal}/>
        //         </>
        //     )
      }
    </PageContainer>
  );
};
