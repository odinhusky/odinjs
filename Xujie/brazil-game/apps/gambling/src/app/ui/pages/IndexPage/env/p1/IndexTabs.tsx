import cx from "classnames";
import { TabItem } from "../../../../components-bs/TabItem/TabItem";
import { gameSlice, indexPagecurrentSelectLabel } from "../../../../../reduxStore/gameSlice";
import { DragScrollContainer } from "../../../../components/DragScrollContainer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";


type TIndexTabs = {
  label: any;
  activeTab: any;
}

export const IndexTabs = ({
  label,
  activeTab,
}: TIndexTabs) => {
  const labelList = ["Todos", ...label, 'Favoritos']
  const index = labelList.indexOf(activeTab)

  const dispatch = useDispatch();


  const {isDesktop} = useBreakpoint();

  return (
    <DragScrollContainer
      focus={{
        index,
        direction: 'horizontal'
      }}
      className={cx("flex flex-row items-center rounded-[100px] bg-[var(--grayscale-20)]", {'flex-1': !isDesktop})}
    >
      {
        labelList.map((tab: indexPagecurrentSelectLabel, index: number) => {
          return (
            <TabItem
              key={index}
              className="flex-1 text-xs md:text-sm lg:text-base px-5"
              active={activeTab === tab}
              onClick={() => {
                dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel(tab));
              }}
              name={tab}
            />
          )
        })
      }
    </DragScrollContainer>
  )
}
