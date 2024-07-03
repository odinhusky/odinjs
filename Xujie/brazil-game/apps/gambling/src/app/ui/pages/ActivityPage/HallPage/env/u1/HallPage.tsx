import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import styled from "styled-components";
import {ActivityRecordButton} from "../../ActivityRecordButton";
import {ActivityItem} from "../../ActivityItem";
import {IHallPage} from "../../index";
import cx from 'apps/gambling/src/app/ui/utils/cx';
import {ActivityPageRouter} from "../../../index";

type IActivityList = {
  className: string;
  columnsNo: number;
}

const HallActivityList = styled.div.attrs<IActivityList>((props) => ({
  className: cx("", props.className)
}))<IActivityList>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columnsNo}, minmax(0, 1fr))`};
  gap: 1rem;
`;


export const HallPage = (props: IHallPage) => {
  const {onClickToActivity, isShowRecordButton, activityItems, fontConfig} = props;
  const {isMobile, isTablet, isDesktop} = useBreakpoint();
  const {onClickToIndex} = usePageNavigate();

  const columnsNo = isDesktop
      ? activityItems.length > 3 ? 4 : activityItems.length > 2 ? 3 : 2
      : isMobile ? 1 : 2;

  return (
      <PageContainer>
          <BackNavigation
              title={isMobile &&
                  <div className={"w-full text-center font-bold"}>Explorar Todas as Atividades</div>}
              onClick={() => {
                  onClickToIndex();
              }}
          />

          <section className={cx('flex flex-wrap items-center mt-4',
              isDesktop ? 'justify-between' : 'justify-end'
          )}>
              {isDesktop && (
                  <div className={cx('text-start items-center text-4xl font-bold text-[var(--white)]')}>
                      {"Explorar Todas as Atividades"}
                  </div>
              )}

              {isShowRecordButton &&
                  <ActivityRecordButton
                      name={"Reg de Coletas"}
                      className={cx(
                          'text-white py-2 px-4 rounded-lg font-lg',
                          'bg-gradient-to-b from-[var(--primary-main-from)] to-[var(--primary-main-to)]'
                      )}
                      onClick={() => {
                          onClickToActivity({category: ActivityPageRouter.RECORD})
                      }}
                  />
              }
          </section>

          <section className={'flex flex-col  mt-4'}>
              {activityItems && <HallActivityList
                  className={''}
                  columnsNo={columnsNo}>
                  {activityItems.map((item) => {
                      return (
                          <ActivityItem
                              isTop={item.isTop}
                              category={item.router}
                              name={`${item.type}`}
                              title={item.title}
                              className={cx(
                                  'shrink-0 col-span-1',
                                  'w-full h-[60px] text-[#FFFFFF] bg-[var(--secondary-main-from)] px-[100px] py-[100px]')}
                              onClick={() => {
                                  onClickToActivity({category: item.router})
                              }}
                              src={item.src}
                              fontConfig={fontConfig}
                          />
                      )
                  })}

              </HallActivityList>}
          </section>

          {isMobile && <section className={'mb-20'}></section>}
          {isTablet && <section className={'mb-20'}></section>}

      </PageContainer>
  )
}