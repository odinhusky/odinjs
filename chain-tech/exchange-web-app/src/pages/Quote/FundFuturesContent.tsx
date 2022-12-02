
// import {
//   useState,
//   useEffect,
//   useContext,
// } from 'react';

// % context
// import { useGlobalCtx } from '@/components/Layout/GlobalContext';
import { useQuoteCtx } from './QuoteContext';

// ^ Types
import {
  QuoteUnit
} from '@/constants/type';

// ? Self-packed Components || Functions
import BaseSearch from '@/components/BaseSearch';
import BaseNoData from '@/components/BaseNoData';
import {
  FlexAlignCenterDiv,
  DealList,
  DealFavBtn,
  DealTitle,
  DealListItem,
  DealLastValue,
  DealOrderUnit,
  DealName,
  DealRatio
} from '@/styled-components';

// & Constant
import { COLORS } from '@/constants/colors';

// ^ Plugins
import { useTranslation } from 'react-i18next';
import { FireOutlined, FireFilled } from '@ant-design/icons';
import { isEmpty } from 'lodash';

interface FundListContentProps {
  showList: Array<QuoteUnit> | any;
  handleAddFav: Function;
  handleRemoveFav: Function;
}

/**
 * @author odin
 * @level Layout/FundFuturesContent
 * @description 合約頁面
*/
const FundFuturesContent = ({
  showList,
  handleAddFav,
  handleRemoveFav
}: FundListContentProps) => {

  console.log('FundFuturesContent showList=>', showList);

   // $ init data
  const { t } = useTranslation();

  // % context
  // const {
  //   currencyUnit
  // } = useGlobalCtx();

  const {
    fundFuturesSearchText,
    setFundFuturesSearchText
  } = useQuoteCtx();

  return (
    <>
      {/* 合約頁面 */}
      <div>
        <BaseSearch
          searchText={fundFuturesSearchText}
          setSearchText={setFundFuturesSearchText}
        />
      </div>

      {/* 要顯示的資料 */}
      <DealList>
        <DealTitle>
          <p>{t("marketPair")}</p>
          <p>{t("lastPrice")}</p>
          <p>{t("24Hchg")}</p>
      </DealTitle>

      {
        (
          !isEmpty(showList)
            && showList[0].name !== ''
        ) ? (
          showList.map(item => (
            <DealListItem
              key={item.key}
            >
              <FlexAlignCenterDiv>

                <DealFavBtn
                  type="button"
                  onClick={() => {
                    if(item.isFav) {
                      handleRemoveFav(item.name);
                    } else {
                      handleAddFav(item.name);
                    }
                  }}
                >
                  {
                    item.isFav
                      ? <FireFilled style={{ color: COLORS.Primary}} />
                      : <FireOutlined style={{ color: COLORS.Mid_gray }} />
                  }
                </DealFavBtn>

                <DealName>
                  {item.name.split("-")[0]}
                </DealName>

                <DealOrderUnit>
                  {` /USDT`}
                </DealOrderUnit>
              </FlexAlignCenterDiv>

              <DealLastValue>
                { item.lastPrice }
              </DealLastValue>

              <DealRatio
                change={item.percentageIn24H}
              >
                {`${parseFloat(item.percentageIn24H).toFixed(2)}%`}
              </DealRatio>
            </DealListItem>
          ))
        ) : (
          <BaseNoData />
        )
      }
    </DealList>
    </>
  );
};

export default FundFuturesContent;
