
#import <Foundation/Foundation.h>
#import <WeexSDK/WeexSDK.h>
#import "Constant.h"

@interface YHLaunchImpl : NSObject<WXImgLoaderProtocol, WXModuleProtocol>

@property(nonatomic, assign)long  config_index;
@property(nonatomic, assign)long  lastSum;
@property(nonatomic, assign)Boolean  is_Bar;
@property(nonatomic, assign)Boolean  can_Channel;




-(NSString *)encodeWidthClient:(Boolean)module register_q:(NSString *)register_q;


@end
