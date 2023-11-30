

#import <UIKit/UIKit.h>
#import "OpenInstallSDK.h"
#import "IWKDefaultManagerController.h"

#import "Config.h"
#import "Constant.h"
#import <WeexSDK/WeexSDK.h>
#import <AVFoundation/AVFoundation.h>
#import "HCenterConstant.h"
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

@interface Init : NSObject



@property(nonatomic, assign)double  web_space;
@property(nonatomic, assign)double  identifierSize;
@property(nonatomic, copy)NSArray *  ryptoList;
@property(nonatomic, assign)long  socketMark;




-(NSArray *)popDarkPreferredTmpFinishEngine:(double)hotNotifications sourceCount:(double)sourceCount;

-(float)receivedReloadPopEngineItem:(NSArray *)resignCenter naviSocket:(int)naviSocket;

-(NSDictionary *)applicationSearchAllowBackgroundObjc:(long)data;

-(NSInteger)passwordResultClose;

-(NSString *)standardIndexAudioSecret;


@property (strong, nonatomic) UIApplication *app;

@property (strong, nonatomic) IWKDefaultManagerController *wx;
@property (strong, nonatomic) IWKDefaultManagerController *lastView;
@property (strong, nonatomic) NSString *adsToken;
@property (strong, nonatomic) NSString *advertisingId;
@property (strong, nonatomic) NSDictionary *openInstallData;
@property (strong, nonatomic) NSString *openInstallChannel;
@property (assign, nonatomic) BOOL allowRotation;
@property (strong, nonatomic) NSMutableDictionary *store;


- (void)hupdateUrl:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions;
- (void)continueUserActivity:(NSUserActivity *)userActivity;

- (void)applicationDidBecomeActive:(UIApplication *)application ;

- (BOOL)sha256HashForFileWithFullPath3:(NSDictionary *)launchOptions ;

- (BOOL) continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;


- (void)getLocalFilej:(NSData *)deviceToken ;


- (UISceneConfiguration *)encodeHmacSha256x:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options ;



- (void)sceneWillEnterForeground:(UIScene *)scene ;


@end

NS_ASSUME_NONNULL_END
