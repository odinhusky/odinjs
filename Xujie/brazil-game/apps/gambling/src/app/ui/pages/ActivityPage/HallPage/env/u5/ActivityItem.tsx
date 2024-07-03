import cx from "classnames";
import React from "react";
import {CacheImage} from "../../../../../components/image/CacheImage";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {IActivityButton} from "../../ActivityItem";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import {ActivityBadge} from "../../../../../components/Badge/ActivityBadge";
import {environment} from "../../../../../../../environments/environment";

export const ActivityItem = (props: IActivityButton) => {
    const {isMobile, isTablet, isDesktop} = useBreakpoint();
    const {category, isTop, title, src, onClick, fontConfig} = props;
    return (
        <div className={'relative'}>
            <button
                className='relative rounded-[16px] overflow-hidden'
                onClick={onClick && onClick}
            >
                <div
                    className={'relative overflow-hidden'}>
                    <CacheImage
                        alt={""}
                        className={"w-[100vw]"}
                        src={src ? src : ""}
                    />

                    {isTop &&
                        <CacheImage
                            alt={"activity_hot_tag"}
                            className={cx(
                                'absolute top-0 w-[113px]',
                                {'w-1/5': isTablet},
                                {'w-1/5': isMobile}
                            )}
                            src={`assets/${environment.uVersion}/${environment.mVersion}/activity_hot_tag.png`}
                        />
                    }

                    <div
                        className={cx(
                            {'text-[20px] pl-5 w-3/4': isDesktop},
                            {'text-[14px] pl-3 w-4/5': isTablet},
                            {'text-[14px] pl-3 w-5/6': isMobile},
                            {'mt-2': isTop},
                            'flex flex-wrap ',
                            'absolute transform -translate-y-1/2 top-1/2 p-4',
                            'justify-start'
                        )}
                    >

                        {title.split(/\s+/).map(item =>
                            <ActivityTextContainer
                                children={item}
                                fontConfig={fontConfig}
                            />
                        )}

                    </div>
                </div>
            </button>
            <ActivityBadge activityType={category} className={cx(
                'bg-[var(--state-error-main)]',
                'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                'absolute top-0 right-0 -mt-1 -mr-2 w-5 h-5'
            )}/>
        </div>
    )

}