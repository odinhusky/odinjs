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

interface FavoritesListContentProps {
  showList: Array<QuoteUnit> | any;
  handleRemoveFav: Function;
  isLogin: boolean;
}

/**
 * @author odin
 * @level Layout/FavoritesListContent
 * @description 自選名單頁面
*/
const FavoritesListContent = ({
  showList,
  handleRemoveFav,
  isLogin
}: FavoritesListContentProps) => {

  // console.log('FavoritesListContent isLogin', isLogin);

  // $ init data
  const { t } = useTranslation();

  const {
    favoritesListSearchText,
    setFavoritesListSearchText
  } = useQuoteCtx();

  return (
    <>
      {/* 自選名單頁面 */}

      <div>
        <BaseSearch
          searchText={favoritesListSearchText}
          setSearchText={setFavoritesListSearchText}
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

                <DealFavBtn type="button" onClick={() => { handleRemoveFav(item.name) }}>
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
          <BaseNoData text={ isLogin ? '' : t('checkAfterLogin') } />
        )
      }
    </DealList>
    </>
  );
};

export default FavoritesListContent;
