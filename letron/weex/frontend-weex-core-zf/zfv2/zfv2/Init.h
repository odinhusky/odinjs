

#import <UIKit/UIKit.h>
#import "OpenInstallSDK.h"
#import "WeexViewController.h"

#import "Config.h"
#import "Constant.h"
#import <WeexSDK/WeexSDK.h>
#import <AVFoundation/AVFoundation.h>
#import "WeexSDKManager.h"
#import <iAd/iAd.h>
#import <AdServices/AdServices.h>
#import <CommonCrypto/CommonHMAC.h>

#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
#import <JPush/JPUSHService.h>
#import <JPushWeexPluginModule.h>



#import <AdSupport/AdSupport.h>
#import <AdSupport/ASIdentifierManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import "WXSDKInstance.h"



NS_ASSUME_NONNULL_BEGIN

@interface Init : NSObject <JPUSHRegisterDelegate>


@property (strong, nonatomic) UIApplication *app;

@property (strong, nonatomic) WeexViewController *wx;
@property (strong, nonatomic) WeexViewController *lastView;
@property (strong, nonatomic) NSString *adsToken;
@property (strong, nonatomic) NSString *advertisingId;
@property (strong, nonatomic) NSDictionary *openInstallData;
@property (strong, nonatomic) NSString *openInstallChannel;
@property (assign, nonatomic) BOOL allowRotation;
@property (strong, nonatomic) NSMutableDictionary *store;


//SceneDelegate
- (void)f__rd__willConnectToSession__:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions;
- (void)f__rd__continueUserActivity__:(NSUserActivity *)userActivity;

//AppDelegate
- (void)f__rd__applicationDidBecomeActive__:(UIApplication *)application ;

- (BOOL)f__rd__didFinishLaunchingWithOptions__:(NSDictionary *)launchOptions ;

- (BOOL) f__rd__continueUserActivity__:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;


- (void) f__rd__didRegisterForRemoteNotificationsWithDeviceToken__:(NSData *)deviceToken ;
- (void) f__rd__didReceiveRemoteNotification__:(NSDictionary *)userInfo;

- (UISceneConfiguration *) f__rd__configurationForConnectingSceneSession__:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options ;



- (void)f__rd__sceneWillEnterForeground__:(UIScene *)scene ;


@end

NS_ASSUME_NONNULL_END
