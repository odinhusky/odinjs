import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useWalletPageRechargeCardStore } from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const WalletRechargeCardSelect = () => {
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const rechargeCardList = useWalletPageRechargeCardStore(
    (state) => state.rechargeCardList
  );

  return (
    <div className="flex justify-center tablet:justify-start">
      {rechargeCardList.map((item) => {
        return (
          <div
            key={item.card}
            onClick={item.onAction}
            className="w-[172px] h-[104px] mobile:w-[232px] mobile:h-[140px] relative flex justify-center items-center cursor-pointer"
          >
            <img
              src={item.url}
              alt="card"
              className="w-36 h-20 mobile:w-[200px] mobile:h-[108px]"
            />
            {currentRechargeCard === item.card ? (
              <img
                src={getImgUrl(EResourceLevel.V, 'payment_light_edit')}
                className="w-[172px] h-[104px] mobile:w-[232px] mobile:h-[140px] absolute top-0 left-0"
                alt="chosen"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
