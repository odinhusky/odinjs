import cx from "classnames";
import React from "react";
import {CacheImage} from "../../../../../components/image/CacheImage";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {IActivityButton} from "../../ActivityItem";
import {ActivityTextContainer} from "../../../ActivityTextContainer";
import {environment} from "../../../../../../../environments/environment";
import {ActivityBadge} from "../../../../../components/Badge/ActivityBadge";

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
                            alt={""}
                            className={cx(
                                'absolute top-0',
                                {'w-1/4': isTablet},
                                {'w-1/4': isMobile}
                            )}
                            src={`assets/${environment.uVersion}/${environment.mVersion}/activity_hot_tag.png`}
                        />
                    }
                    <div
                        className={cx(
                            {'text-[1.5vw] pl-8 w-4/5': isDesktop},
                            {'text-[2vw] pl-8 w-2/3': isTablet},
                            {'text-[5vw] pl-8 w-4/5': isMobile},
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

            <ActivityBadge activityType={category} className={'absolute top-0 right-0 mt-1.5 -mr-0.5 w-6 h-6'}/>
        </div>
    )

}