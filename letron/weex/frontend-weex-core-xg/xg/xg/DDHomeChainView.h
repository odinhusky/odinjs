

#import <Foundation/Foundation.h>
#import <WeexSDK/WeexSDK.h>
#import "Constant.h"

@interface DDHomeChainView : NSObject


@property(nonatomic, assign)double  storeSpace;
@property(nonatomic, assign)Boolean  enbale_Setup;
@property(nonatomic, assign)Boolean  has_Dark;




-(NSArray *)iosStoreComPpp;


-(BOOL)open:(NSString *)url;

@end


