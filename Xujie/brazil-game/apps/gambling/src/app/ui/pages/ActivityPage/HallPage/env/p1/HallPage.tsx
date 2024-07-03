import cx from "classnames";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import styled from "styled-components";

import {ActivityItem} from "../../ActivityItem";
import {IActivityItem, IHallPage} from "../../index";
import {ActivityRecordButton} from "./ActivityRecordButton";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
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

    const columnsNo = isMobile ? 1 : 2;

    return (
        <PageContainer>
            <section className={cx('flex flex-wrap items-center mt-4 justify-between')}>
                {isMobile &&
                    <BackNavigation
                        title={isMobile &&
                            <div className={"ml-2 w-full text-center font-bold"}>EXPLORAR TODAS AS ATIVIDADES</div>}
                        onClick={() => {
                            onClickToIndex();
                        }}
                    />}

                {isDesktop && (
                    <div className={cx('text-start items-center text-4xl font-bold text-[var(--white)]')}>
                        {"EXPLORAR TODAS AS ATIVIDADES"}
                    </div>
                )}


                {isShowRecordButton &&
                    <ActivityRecordButton
                        name={"REG DE COLETAS"}
                        className={cx(
                            'text-[var(--primary-main-to)] text-[16px] py-2 px-4 rounded-full font-bold',
                            'bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)]',
                            {'w-full': isMobile}
                        )}
                        onClick={() => {
                            onClickToActivity({category: ActivityPageRouter.RECORD})
                        }}
                    />
                }
            </section>

            <section className={'flex flex-col mt-4 gap-5'}>
                {activityItems && <HallActivityList
                    className={''}
                    columnsNo={columnsNo}>
                    {activityItems.map((item) => {
                        return (
                            <ActivityItem
                                isTop={item.isTop}
                                category={item.router}
                                name={`${item}`}
                                title={item.title}
                                className={cx(
                                    'shrink-0 col-span-1 w-full')}
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