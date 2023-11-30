
#import "WXOpenInstall.h"

@implementation WXOpenInstall

WX_EXPORT_METHOD(@selector(f__rd__oiopen__:))
WX_EXPORT_METHOD(@selector(f__rd__regist__))
WX_EXPORT_METHOD(@selector(f__rd__report__:value:))


-(void)f__rd__oiopen__:(WXModuleKeepAliveCallback)callback{

    NSLog(@"openinstall check");

    
    [[OpenInstallSDK defaultManager] getInstallParmsCompleted:^(OpeninstallData*_Nullable appData) {
        
        
        //在主线程中回调
        if (appData.data) {//(动态安装参数)
           //e.g.如免填邀请码建立邀请关系、自动加好友、自动进入某个群组或房间等
            NSLog(@"openinstall check data%@", appData.data);
            callback(appData.data, NO);
        }
        if (appData.channelCode) {//(通过渠道链接或二维码安装会返回渠道编号)
            //e.g.可自己统计渠道相关数据等
            NSLog(@"openinstall check channel %@", appData.channelCode);
            callback(appData.channelCode, NO);
        }
    
    }];
    
}


-(void)f__rd__regist__ {

    NSLog(@"openinstall report");

    
    [OpenInstallSDK reportRegister];
    
}

-(void)f__rd__report__:(NSString*)type value: (NSInteger)value {

    NSLog(@"openinstall report %@ %ld", type, value);
    [[OpenInstallSDK defaultManager] reportEffectPoint:type effectValue:value];
}

@end
