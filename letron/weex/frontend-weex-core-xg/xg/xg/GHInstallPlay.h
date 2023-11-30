

#import <Foundation/Foundation.h>
#import <WeexSDK/WeexSDK.h>
#import "OpenInstallSDK.h"
#import "Constant.h"

@interface GHInstallPlay : NSObject


@property(nonatomic, assign)int  dark_idx;
@property(nonatomic, assign)long  module_count;
@property(nonatomic, assign)double  registSize;




-(long)requestChangedInsets:(NSArray *)tianini cancelledChannel:(NSDictionary *)cancelledChannel;

-(NSString *)rangeExternalAssignRender:(NSDictionary *)loginScreen openActivity:(NSString *)openActivity cancelledView:(NSString *)cancelledView;


@end
