

#import "AppDelegate.h"
#import "GlobalData.h"

@interface AppDelegate ()

@end

@implementation AppDelegate



-(void)tianini {
    
    [GlobalData f__rd__init__].app = (UIApplication*)self;
    
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    [self tianini];
    [[GlobalData f__rd__init__] f__rd__didFinishLaunchingWithOptions__:launchOptions];
    
    return YES;
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [self tianini];
    [[GlobalData f__rd__init__] f__rd__didRegisterForRemoteNotificationsWithDeviceToken__:deviceToken];
    
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [self tianini];
    [[GlobalData f__rd__init__] f__rd__didReceiveRemoteNotification__:userInfo];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    [self tianini];
    if([GlobalData f__rd__init__].allowRotation){
        return UIInterfaceOrientationMaskLandscape;
    }else{
        return UIInterfaceOrientationMaskPortrait;
    }
    return UIInterfaceOrientationMaskPortrait;
}


- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^ _Nonnull __strong)(NSArray<id<UIUserActivityRestoring>> * _Nullable __strong))restorationHandler{
    
    [OpenInstallSDK continueUserActivity:userActivity];
    
     return YES;
}


#pragma mark - UISceneSession lifecycle


- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}


- (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
    
}


@end
