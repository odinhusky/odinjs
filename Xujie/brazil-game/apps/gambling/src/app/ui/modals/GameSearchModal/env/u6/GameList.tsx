import { memo } from "react";
import { NoData } from "../../../../components-bs/Icons/NoData";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import styled from "styled-components";
import cx from "../../../../utils/cx";
import { CellGameItem } from "../../../../components-bs/GameTypeSection/env/u6/CellGameItem";

export const GameList = memo(
  ({
    data,
    isSearch,
    onClickGameItem,
    onClickFavoriteGameItem,
  }: {
    data: any;
    isSearch: boolean;
    onClickGameItem: (item: any) => void;
    onClickFavoriteGameItem: (item: any) => void;
  }) => {
    const { isMobile, isTablet, isDesktop } = useBreakpoint();

    const MainGameWraper = styled.div`
      margin-right: ${isDesktop ? 20 : isTablet ? 16 : 12}px;
      margin-bottom: ${isDesktop ? 0 : 12}px;
      width: calc(
        ${100 / (isDesktop ? 7 : isTablet ? 4 : 3)}% -
          ${isDesktop ? 20 : isTablet ? 16 : 12}px
      );
      min-width: ${isDesktop ? 186 : isTablet ? 128 : 88}px;
      height: max-content;

      &:nth-child(3n) {
        margin-right: ${isMobile ? "0px" : ""};
      }
    `;
    if (data?.length > 0) {
      return (
        <div
          className={cx(
            "flex",
            isDesktop || (isTablet && isSearch) ? "flex-nowrap" : "flex-wrap",
            { "w-full": !isDesktop }
          )}
        >
          {data &&
            data.map((item: any, index: number) => {
              return (
                <MainGameWraper>
                  <CellGameItem
                    className={cx("shrink-0")}
                    key={index}
                    isLock={item.lock === true}
                    gameId={Number(item.gameId)}
                    name={item.name}
                    onClick={() => {
                      onClickGameItem(item);
                    }}
                    onClickFavorite={() => {
                      onClickFavoriteGameItem(item);
                    }}
                  />
                </MainGameWraper>
              );
            })}
        </div>
      );
    } else {
      return (
        <div className="h-[60vh] md:h-[40vh] flex flex-col flex-1 justify-center items-center">
          <NoData className="w-[120px] h-[120px] mobile:w-40 mobile:h-40 tablet:w-[200px] tablet:h-[200px]" />
          <div className="text-xs mobile:text-base tablet:text-2xl text-[var(--grayscale-60)]">
            Nada aqui
          </div>
        </div>
      );
    }
  }
);
