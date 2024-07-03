import cx from "classnames";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import styled from "styled-components";

import {ActivityItem} from "../../ActivityItem";
import {IHallPage} from "../../index";
import {ActivityRecordButton} from "./ActivityRecordButton";
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

    const columnsNo = isMobile ? 1 : 2;

    return (
        <PageContainer>

            <div className={cx('bg-[var(--grayscale-20)] rounded-lg',
                {'p-8': isDesktop},
                {'p-8': isTablet},
                {'p-4': isMobile}
            )}>
                <section className={cx('flex flex-wrap items-center justify-between')}>
                    <div className={cx('text-[var(--grayscale-100)] font-extrabold',
                        {'text-[48px]': isDesktop},
                        {'text-[30px]': isTablet},
                        {'text-[20px]': isMobile}
                    )}>
                        Eventos
                    </div>
                    {isShowRecordButton &&
                        <ActivityRecordButton
                            name={"Reg de Coletas"}
                            className={cx(
                                'linear-5-button'
                            )}
                            onClick={() => {
                                onClickToActivity({category: ActivityPageRouter.RECORD})
                            }}
                        />
                    }
                </section>

                <section className={cx(
                    'flex flex-col',
                    {'mt-8 gap-8': isDesktop},
                    {'mt-8 gap-5': isTablet},
                    {'mt-3 gap-3': isMobile},
                )}>

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
            </div>


        </PageContainer>
    )
}