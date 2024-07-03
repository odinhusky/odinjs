import { ILoadingLogo } from '../../LoadingLogo';
import React from 'react';
import cx from '../../../../utils/cx';
import { renderByUVersion } from '../../../../utils/renderByUVersion';
import { CacheImage } from '../../../../components/image/CacheImage';
import { environment } from "../../../../../../environments/environment";

const LogoClassName = () => {
  return renderByUVersion(
    {
      u7: 'lg:!w-[120px] lg:!h-[120px] !shadow-[0px_-8px_8px_0px_rgba(0,0,0,0.3)_inset]',
    },
    ''
  );
};

export const LoadingLogo = (props: ILoadingLogo) => {
  const {className, loadingIcon} = props;
  return (
    <img
      alt="logo-loading"
      className={cx('h-[46px] mobile:h-[78px]', className)}
      src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
    />
    // <>
    //   {loadingIcon?.indexOf("logo.png") === -1 ? (
    //     <img
    //       alt="logo-loading"
    //       className={cx(
    //         'w-20 h-20 rounded-lg',
    //         'lg:w-24 lg:h-24 lg:rounded-xl',
    //         'shadow-[4px_4px_4px_0px_rgba(0,0,0,0.50)_inset,-4px_-4px_4px_0px_rgba(255,255,255,0.25)_inset]',
    //         className,
    //         LogoClassName()
    //       )}
    //       src={loadingIcon}
    //     />
    //   ) : (
    //     <img
    //       alt="logo-loading"
    //       className={cx('w-[400px] h-[78px]', className)}
    //       src={loadingIcon}
    //     />
    //   )}
    // </>
  );
};
