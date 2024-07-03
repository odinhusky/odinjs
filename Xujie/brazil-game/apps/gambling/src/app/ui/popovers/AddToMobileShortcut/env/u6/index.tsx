import {environment} from '../../../../../../environments/environment';
import {AppLocalStorageKey} from '../../../../../persistant/AppLocalStorageKey';
import {useLocalStorage} from 'usehooks-ts';
import {AppEnvironment} from '../../../../../device/appEnvironment';
import {usePageNavigate} from '../../../../router/hooks/usePageNavigate';
import {appSlice} from '../../../../../reduxStore/appSlice';
import {useDispatch} from 'react-redux';
import cx from 'classnames';
import styled from 'styled-components';
import useAnimation from '../../../../hooks/useAnimation';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import {MenuDrawerItem} from "../../../../drawers/MenuDrawer/env/u6/MenuDrawerItem";
import {MenuDrawerDonItem} from "../../../../drawers/MenuDrawer/env/u6/MenuDrawerDonItem";
import {CacheImage} from "../../../../components/image/CacheImage";

type IAddToMobileShortcut = {
    isShowTabbar: boolean;
    className?: string,
    setOpenDownloadModal?: (value: any) => void;
}

// const Container = styled.div`
//   box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
// `;

export const AddToMobileShortcut = (props: IAddToMobileShortcut) => {
    const {setOpenDownloadModal} = props;
    const dispatch = useDispatch();
    const [_, setHideAddToMobileShortcut] = useLocalStorage(AppLocalStorageKey.hideAddToMobileShortcut, false)
    const onClose = () => {
        setHideAddToMobileShortcut(true);
    }

    const {onClickToOpenDownload} = usePageNavigate();
    const {isDesktop, isTablet, isMobile} = useBreakpoint();

    const onDownload = () => {
        if (isDesktop) {
            setOpenDownloadModal && setOpenDownloadModal(true);
        } else if (AppEnvironment.isAndroid()) {
            onClickToOpenDownload();
        } else {
            dispatch(appSlice.actions.setShowiOSDownloadPopover(true));
        }
    }

    const [isCloseAnimation, setIsCloseAnimation] = useAnimation(onClose);

    return (

        <div className={cx(
            // 'bg-linear-6-main ',
            'bg-[var(--grayscale-50)]',
            'px-4 w-full rounded-lg md:rounded-xl',
            'py-1 tablet:py-3',
            'flex flex-row justify-start items-center animate__animated animate__faster animate__slideInDown',
            'gap-x-2 mobile:gap-x-4 tablet:gap-x-2',
            isCloseAnimation ? 'animate__slideOutUp' : '',
            props.className
        )}>
            <img
                className={cx(
                    'cursor-pointer',
                    'w-6 h-6',
                    'mobile:w-8 mobile:h-8',
                )}
                alt={'close'}
                src={`assets/${environment.uVersion}/ic_closed.png`}
                onClick={() => setIsCloseAnimation(true)}
            />

            <CacheImage
                className={cx(
                    'h-8 w-8',
                    'mobile:w-10 mobile:h-10'
                )}
                alt={'logo'}
                src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}/>

            <div className={cx(
                'flex flex-col grow',
                'text-[var(--grayscale-100)]',
                'font-medium text-xs mobile:text-sm'
            )}>
                <div className={'flex'}>
                    <span className={cx('text-sm mobile:text-lg')}>{`Link-${environment.platformName}`}</span>
                    <img className={'ml-1 w-5 h-5'} src={`assets/${environment.uVersion}/ic_hot.png`}/>
                </div>

                <span className={'font-medium'}>
                    {`${isDesktop
                        ? 'Baixe para iniciar sua jornada de exploração ilimitada'
                        : 'Desfrute de recursos mais interessantes'}`}
                </span>
            </div>

            <button
                className={cx(
                    'flex flex-none items-center justify-center',
                    'linear-1-button',
                    'h-7 mobile:h-9',
                    'gap-x-1 mobile:gap-x-2',
                    'text-xs mobile:text-sm',
                    'px-2 py-1 mobile:px-2 mobile:py-2 tablet:px-5 tablet:py-4',
                    'active:brightness-75 hover:brightness-125',
                    {})}
                onClick={onDownload}
            >
                <CacheImage
                    id={'DownloadSimple'}
                    alt={'DownloadSimple'}
                    src={`assets/${environment.uVersion}/icon_download.gif`}
                    className={'w-4 mobile:w-5'}
                />
                <div>
                    {isDesktop ? 'Baixe APP' : 'BAIXE'}
                </div>
            </button>

        </div>
    )
}
