import Icon from '@components/Icon';

export const PwaInfo = () => {
  return (
    <div className="flex gap-[6px] text-[#000000] font-medium justify-center mt-8">
      <div className="flex flex-col w-20 justify-center items-center">
        <div className="flex text-sm font-semibold justify-center items-center">
          5.0
          <Icon className="w-[10px] h-[10px]" name="ic_star" />
        </div>
        <div className="text-[#777777] text-[11px] text-center">7M reviews</div>
      </div>
      <div className="h-5 w-[1px] bg-[#000000] my-auto" />
      <div className="w-20">
        <div className="w-fit text-sm font-semibold m-auto">6M+</div>
        <div className="text-[#777777] text-[11px] text-center">Downloads</div>
      </div>
      <div className="h-5 w-[1px] bg-[#000000] my-auto" />
      <div className="w-20">
        <div className="w-fit text-sm m-auto py-px px-[3px] border border-[#000000] rounded-[3px] font-semibold">
          18+
        </div>
        <div className="text-[#777777] text-[11px] text-center">
          Rated for 18+
        </div>
      </div>
    </div>
  );
};
