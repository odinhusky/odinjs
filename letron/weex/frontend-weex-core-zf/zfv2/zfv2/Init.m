
#import "Init.h"
#import "AppDelegate.h"

@implementation Init

- (instancetype)init{

    if(self = [super init]){
        self.store = [NSMutableDictionary dictionary];
    }
    return self;
}


- (void)f__rd__willConnectToSession__:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    
    for (NSUserActivity *userActivity in connectionOptions.userActivities) {
            [OpenInstallSDK continueUserActivity:userActivity];
        }
}

- (void)f__rd__continueUserActivity__:(NSUserActivity *)userActivity{
    [OpenInstallSDK continueUserActivity:userActivity];
}


- (void)f__rd__applicationDidBecomeActive__:(UIApplication *)application {
    
    
            if (@available(iOS 14, *)) {
                  [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                      if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                          
                          self.advertisingId = [[ASIdentifierManager sharedManager] advertisingIdentifier].UUIDString;
                      }
                  }];
              } else {
                  
                  self.advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
              }
    
}


- (BOOL) f__rd__didFinishLaunchingWithOptions__:(NSDictionary *)launchOptions {
    
//    self.store = [NSMutableDictionary dictionary];
    
    if(nil != launchOptions) {
        NSString* j = [Init convertToJsonData:launchOptions];
        if(j != nil) {
            self.store[@"launched"] = j;
        }
        NSDictionary* pushNotification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
        [self f__rd__didReceiveRemoteNotification__:pushNotification];
    }
    
    
    [self.store addEntriesFromDictionary:launchOptions];
    
    
    [WeexSDKManager f__rd__setup__];
    
      JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
      entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
      
      [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    
    
        if (@available(iOS 14, *)) {
              [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                  if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                      self.advertisingId = [[ASIdentifierManager sharedManager] advertisingIdentifier].UUIDString;
                  }
              }];
          } else {
              
              self.advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
          }

    
      [JPUSHService setupWithOption:launchOptions appKey:JPUSH_KEY
                            channel:JPUSH_CHANNEL
                   apsForProduction:1
              advertisingIdentifier:self.advertisingId];
    
    
    [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
        
        if(registrationID!=nil){
            NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
            [userDefault setObject:registrationID forKey:JPUSH_TOKEN];
        }
        
    }];

    
  
    
    [OpenInstallSDK initWithDelegate:(AppDelegate*)self.app];
    
    [self ads];
    
    return YES;
}

- (BOOL) f__rd__continueUserActivity__:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler{

    [OpenInstallSDK continueUserActivity:userActivity];
     return YES;
}


- (void) f__rd__didRegisterForRemoteNotificationsWithDeviceToken__:(NSData *)deviceToken {
    
    [JPUSHService registerDeviceToken:deviceToken];
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    [userDefault setObject:deviceToken forKey:JPUSH_PUSH];
    
}
- (void) f__rd__didReceiveRemoteNotification__:(NSDictionary *)userInfo {
    
    if(self.wx != nil && self.wx.instance != nil){
        [self.wx.instance fireGlobalEvent:@"notify" params:userInfo];
    }
    
//    if(nil != userInfo) {
//        NSString* jp = [Init convertToJsonData:userInfo];
//        if(jp != nil) {
//            self.store[@"notify"] = jp;
//        }
//    }
    
}


+ (NSString *)convertToJsonData:(NSDictionary *) dict {
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict
                                        options:NSJSONWritingSortedKeys
                                        error:&error];
    NSString *jsonString;
    if (!jsonData) {
        NSLog(@"%@",error);
    } else {
        jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    return jsonString;
}



-(void)ads{
    
    
    if (@available(iOS 14.3, *)) {
           NSError *error;
           NSString *token = [AAAttribution attributionTokenWithError:&error];
           if (token != nil) {
               
               self.adsToken = token;
               
               NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
               [userDefault setObject:token forKey:ASA_KEY];
               
           }
       } else {
           
           if ([[ADClient sharedClient] respondsToSelector:@selector(requestAttributionDetailsWithBlock:)]) {
               
               [[ADClient sharedClient] requestAttributionDetailsWithBlock:^(NSDictionary *attributionDetails, NSError *error) {
                   
               }];
           }
           
       }
    
   
}





- (UISceneConfiguration *) f__rd__configurationForConnectingSceneSession__:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}



- (void)f__rd__sceneWillEnterForeground__:(UIScene *)scene {
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
}


#pragma mark- JPUSHRegisterDelegate

// iOS 10 Support
// 展示推送之前触发，可以在此替换推送内容，更改展示效果：内容、声音、角标。
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
    completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner ); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}

// iOS 10 Support
// 在收到推送后触发
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  // Required
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler();  // 系统要求执行这个方法
}

@end
