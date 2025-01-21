import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

export const PwaBanners = () => {
    return (
        <div className='overflow-x-auto mt-[22px]'>
            <div className="flex gap-3">
                {new Array(5).fill(0).map((d, index) => {
                    return (
                        <img
                            className="w-[140px] rounded-lg"
                            key={index}
                            src={getImgUrl(EResourceLevel.V, `pwa_intro_${index + 1}`)}
                            alt="banner"
                        />
                    );
                })}
            </div>
        </div>
    );
};
