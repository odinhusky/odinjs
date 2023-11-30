
#import "WeexSDKManager.h"
#import "Config.h"
#import <WeexSDK/WeexSDK.h>
#import "WeexViewController.h"
#import "WXImgLoaderDefaultImpl.h"
#import "WXWebSocketDefaultImpl.h"
#import "WXDownloaderModule.h"
#import "AppDelegate.h"
#import "WXNetCheck.h"
#import "WXCryptoModule.h"
#import "WXValue.h"
#import "WXNav.h"
#import "WXAirPlay.h"
#import "WXKeyChain.h"
#import "WXDevice.h"
#import "WXStore.h"
#import "WXOpenInstall.h"
#import <WeexImageCropPicker/ImageCropPicker.h>
#import "GlobalData.h"

@implementation WeexSDKManager




+ (void)f__rd__setup__;
{
    
    
    NSURL *url = nil;
    
    #ifdef DEBUG
        url = DEBUG_URL;
    #endif
    
    if(url == nil){
        
        NSString* localFile = [self getLocalFile];
        if(localFile != nil){
            //url = [NSURL URLWithString: localFile];
            
            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
            NSString *docDir = [paths objectAtIndex:0];
            NSString *jspath = [NSString stringWithFormat:@"file://%@/js/index.js",docDir];
            
            
            url = [NSURL URLWithString:jspath];
            
        }
        
        
    }
    
    if(url == nil){
        url = DATA_INDEX;
    }
    
    #ifdef UITEST
        url = [NSURL URLWithString:UITEST_HOME_URL];
    #endif
        
//    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    UIViewController *wx = [[WeexViewController alloc] init];
    [GlobalData f__rd__init__].wx = (WeexViewController *)wx;
    [GlobalData f__rd__init__].wx.url = url;
    
    [self tianiniws];
//    [self loadCustomContainWithScannerWithUrl:url];
}

+ (void)tianiniws
{
    [WXAppConfiguration setAppGroup:APP_NAME];
    [WXAppConfiguration setAppName:APP_NAME];
    [WXAppConfiguration setAppVersion:APP_VER];
    [WXAppConfiguration setExternalUserAgent:APP_NAME];
    
    [WXSDKEngine initSDKEnvironment];
    
    [WXSDKEngine registerHandler:[WXImgLoaderDefaultImpl new] withProtocol:@protocol(WXImgLoaderProtocol)];
    [WXSDKEngine registerHandler:[WXWebSocketDefaultImpl new] withProtocol:@protocol(WXWebSocketHandler)];
    
    [WXSDKEngine registerModule:f__rd__DOWNLOAD__ withClass:[WXDownloaderModule class]];
    [WXSDKEngine registerModule:f__rd__CRYPTO__ withClass:[WXCryptoModule class]];
    [WXSDKEngine registerModule:f__rd__NET__ withClass:[WXNetCheck class]];
    [WXSDKEngine registerModule:f__rd__VALUE__ withClass:[WXValue class]];
    [WXSDKEngine registerModule:f__rd__NAV__ withClass:[WXNav class]];
    [WXSDKEngine registerModule:f__rd__KEY__ withClass:[WXKeyChain class]];
    [WXSDKEngine registerModule:f__rd__DEVICE__ withClass:[WXDevice class]];
    [WXSDKEngine registerModule:f__rd__STORE__ withClass:[WXStore class]];
    
    [WXSDKEngine registerComponent:f__rd__AIRPLAY__ withClass:[WXAirPlay class]];
    
    [WXSDKEngine registerModule:f__rd__IMAGE__ withClass:[ImageCropPicker class]];
    [WXSDKEngine registerModule:f__rd__OPENINSTALL__ withClass:[WXOpenInstall class]];
    
#ifdef DEBUG
    [WXLog setLogLevel:WXLogLevelLog];
#endif
}

+ (void)f__rd__loadCustomContain__ {
    
    
    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    app.window = [UIApplication sharedApplication].windows[0];
    app.window.rootViewController = [[WXRootViewController alloc] initWithRootViewController:[GlobalData f__rd__init__].wx];
    
    
}

+ (void)f__rd__loadCustomContainWithScannerWithUrl__:(NSURL *)url
{
    
    
    
    UIViewController *wxView = [[WeexViewController alloc] init];
    ((WeexViewController *)wxView).url = url;
    [[UIApplication sharedApplication] delegate].window.rootViewController = [[WXRootViewController alloc] initWithRootViewController:wxView];
    
    
}


+(NSString*)getLocalFile{
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    
    return [userDefault objectForKey:@"path"];
    
}
@end
