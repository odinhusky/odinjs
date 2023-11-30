
#import <UIKit/UIKit.h>

#import "PONewsView.h"
#import "TKLaunchInitController.h"
#import "WCLoginManagerView.h"


NS_ASSUME_NONNULL_BEGIN

@interface RGZNewsController : UIViewController
@property (nonatomic, copy) NSDictionary *  naviNotifications;
@property (nonatomic, assign) float  dataRefreshDark;
@property (nonatomic, assign) double  receiveAlue;



-(UITableView *)kremoveBegan:(Boolean)button memory:(NSString *)memory wnews:(NSString *)wnews;

-(NSArray *)imageContinue_voCheck:(Boolean)allow ryptoDark:(NSDictionary *)ryptoDark;

-(int)naviationDeviceWeex:(NSDictionary *)began hmacFull:(NSString *)hmacFull;

@end

NS_ASSUME_NONNULL_END
