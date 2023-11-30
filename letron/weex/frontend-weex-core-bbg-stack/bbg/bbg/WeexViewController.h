
#import <UIKit/UIKit.h>
#import <SRWebSocket.h>
#import <WeexSDK/WXSDKInstance.h>

@interface WeexViewController : UIViewController<SRWebSocketDelegate>



@property (nonatomic, strong) NSString *script;
@property (nonatomic, strong) NSURL *url;

@property (nonatomic, strong) SRWebSocket *hotReloadSocket;
@property (nonatomic, strong) NSString *source;

@property (nonatomic, assign) BOOL statusBarDarkStyle;


-(void)f__rd__changeUrl__:(NSURL*)url;

@end

