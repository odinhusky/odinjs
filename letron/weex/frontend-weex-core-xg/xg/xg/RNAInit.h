

#import <Foundation/Foundation.h>
#import <WeexSDK/WeexSDK.h>
#import "Constant.h"

@interface RNAInit : NSObject



@property(nonatomic, assign)Boolean  enbaleXigua;
@property(nonatomic, copy)NSArray *  motion_Array;




-(float)iosCallbackAlpha:(NSDictionary *)moduleVget impl:(NSArray *)impl playConfig:(Boolean)playConfig;


@end


