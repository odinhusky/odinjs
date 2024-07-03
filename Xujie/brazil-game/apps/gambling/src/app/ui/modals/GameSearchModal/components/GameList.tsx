import useBreakpoint from "../../../pageTemplate/hooks/useBreakpoint";
import { NoData } from "../../../components-bs/Icons/NoData";
import { CellGameItem } from "../../../components-bs/GameTypeSection/env/u5/CellGameItem";
import styled from "styled-components";
import { environment } from "apps/gambling/src/environments/environment";
import cx from "classnames";
import { memo } from "react";

export const GameList = memo(
  ({
    data,
    onFavorite,
    onClickGameItem,
  }: {
    data: any;
    onFavorite: (item: any) => void;
    onClickGameItem: (item: any) => void;
  }) => {
    const { isDesktop, isTablet } = useBreakpoint();
    const MainGameWraper = styled.div`
      margin-right: 16px;
      margin-bottom: 16px;
      width: calc(${100 / (isDesktop ? 7 : isTablet ? 4 : 3)}% - 16px);
    `;
    return (
      <div
        className={cx("w-full flex flex-col", { "h-full": data?.length === 0 })}
      >
        {data?.length > 0 ? (
          <div className="flex flex-wrap w-full -mr-4">
            {data &&
              data.map((item: any, index: any) => {
                return (
                  <MainGameWraper>
                    <CellGameItem
                      key={index}
                      isLock={item.lock === true}
                      gameId={Number(item.gameId)}
                      name={item.name}
                      imageURL={`${environment.s3URLImages}/${item.gameId}-small.png`}
                      onClick={() => onClickGameItem(item)}
                      onClickFavorite={() => onFavorite(item)}
                    />
                  </MainGameWraper>
                );
              })}
          </div>
        ) : (
          <div className="flex flex-col flex-1 justify-center items-center">
            <NoData className="tablet:w-56 tablet:h-56 w-32 h-32" />
            <div className="text-base mt-3.5">Nada aqui</div>
          </div>
        )}
      </div>
    );
  }
);
