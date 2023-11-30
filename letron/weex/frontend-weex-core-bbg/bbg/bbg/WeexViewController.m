

#import "WeexViewController.h"


#import <WeexSDK/WXSDKEngine.h>
#import <WeexSDK/WXUtility.h>
#import <WeexSDK/WXDebugTool.h>
#import <WeexSDK/WXSDKManager.h>
#import "Config.h"
#import "UIViewController+WXNaviBar.h"
#import "AppDelegate.h"
#import <AdSupport/AdSupport.h>
#import <AdSupport/ASIdentifierManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import "GlobalData.h"


@interface WeexViewController () <UIScrollViewDelegate, UIWebViewDelegate>

@property (nonatomic, strong) UIView *weexView;
@property (nonatomic, strong) WXSDKInstance *instance;
@property (nonatomic, strong) NSArray *refreshList;
@property (nonatomic, strong) NSArray *refreshList1;
@property (nonatomic, strong) NSArray *refresh;
@property (nonatomic) NSInteger count;

@property (nonatomic, assign) CGFloat weexHeight;
@property (nonatomic, weak) id<UIScrollViewDelegate> originalDelegate;

@end

@implementation WeexViewController


//-(BOOL)shouldAutorotate
//{
//    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
//    return app.a.allowRotation;
//}
//- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
//{
//    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
//    if (app.a.allowRotation) {
//        return UIInterfaceOrientationLandscapeLeft;
//    }else{
//        return UIInterfaceOrientationPortrait;
//    }
//
//}


- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    
    NSInteger ori = [[UIDevice currentDevice] orientation];
    NSString* orientation = [NSString stringWithFormat:@"%ld", ori];
    
    NSString* width = [NSString stringWithFormat:@"%g", size.width];
    NSString* height = [NSString stringWithFormat:@"%g", size.height];
    
    _instance.frame = CGRectMake(0, 0, size.width, size.height);
    
    [_instance fireGlobalEvent:@"landscape" params:@{
        @"orientation":orientation,
        @"width": width,
        @"height": height
    }];
    
}
-(void)f__rd__changeUrl__:(NSURL*)url {
    
    self.url = url;
    [self render];
    
}
- (UIStatusBarStyle) preferredStatusBarStyle {
    return _statusBarDarkStyle ? UIStatusBarStyleDarkContent : UIStatusBarStyleLightContent;
}

- (instancetype)init
{
    if (self = [super init]) {
    }
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self f__rd__setupNaviBar__];
    
    self.view.backgroundColor = [UIColor clearColor];
    
    _weexHeight = self.view.frame.size.height;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(notificationRefreshInstance:) name:@"RefreshInstance" object:nil];
    
#if DEBUG
  //  NSString * hotReloadURL =  [[NSBundle mainBundle] objectForInfoDictionaryKey:@"WXSocketConnectionURL"];
    NSString * hotReloadURL =  HOT_URL;
    if (hotReloadURL){
        _hotReloadSocket = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:hotReloadURL]];
        _hotReloadSocket.delegate = self;
        [_hotReloadSocket open];
    }

#endif
    
    [self render];
    
    
    
    
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    if ([self canBecomeFirstResponder])
    {
        [[UIApplication sharedApplication] setApplicationSupportsShakeToEdit:YES];
        [self becomeFirstResponder];
    }
    [self updateInstanceState:WeexInstanceAppear];
    
    
    
    if (@available(iOS 14, *)) {
          [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
              if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                  [GlobalData f__rd__init__].advertisingId = [[ASIdentifierManager sharedManager] advertisingIdentifier].UUIDString;
              }
          }];
      } else {
          // 使用原方式访问 IDFA
          [GlobalData f__rd__init__].advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
      }

    
    
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    [self updateInstanceState:WeexInstanceDisappear];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    self.navigationController.navigationBarHidden = YES;
    
}

//TODO get height
- (void)viewDidLayoutSubviews
{
    _weexHeight = self.view.frame.size.height;
    UIEdgeInsets safeArea = UIEdgeInsetsZero;
#ifdef __IPHONE_11_0
    if (@available(iOS 11.0, *)) {
        safeArea = self.view.safeAreaInsets;
    } else {
        // Fallback on earlier versions
    }
#endif
    _instance.frame = CGRectMake(safeArea.left, 0, self.view.frame.size.width, _weexHeight);

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)dealloc
{
    if (_hotReloadSocket) {
        [_hotReloadSocket close];
    }
    [_instance destroyInstance];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    _hotReloadSocket = nil;
}

- (void)render
{
    CGFloat width = self.view.frame.size.width;
    [_instance destroyInstance];
    _instance = [[WXSDKInstance alloc] init];
    _instance.viewController = self;
    _instance.frame = CGRectMake(self.view.frame.size.width-width, 0, width, _weexHeight);
    
    __weak typeof(self) weakSelf = self;
    _instance.onCreate = ^(UIView *view) {
        [weakSelf.weexView removeFromSuperview];
        weakSelf.weexView = view;
        [weakSelf.view addSubview:weakSelf.weexView];
        UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, weakSelf.weexView);
    };
    _instance.onFailed = ^(NSError *error) {
        #ifdef UITEST
        if ([[error domain] isEqualToString:@"1"]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                NSMutableString *errMsg=[NSMutableString new];
                [errMsg appendFormat:@"ErrorType:%@\n",[error domain]];
                [errMsg appendFormat:@"ErrorCode:%ld\n",(long)[error code]];
                [errMsg appendFormat:@"ErrorInfo:%@\n", [error userInfo]];
                
                UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"render failed" message:errMsg delegate:weakSelf cancelButtonTitle:nil otherButtonTitles:@"ok", nil];
                [alertView show];
                
                
            });
        }
        #endif
        
        [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"path"];
        NSLog(@"wx open failed");
    };
    
    _instance.renderFinish = ^(UIView *view) {
         WXLogDebug(@"%@", @"Render Finish...");
        [weakSelf updateInstanceState:WeexInstanceAppear];
    };
    
    _instance.updateFinish = ^(UIView *view) {
        WXLogDebug(@"%@", @"Update Finish...");
    };
    if (!self.url) {
        WXLogError(@"error: render url is nil");
        return;
    }
    NSURL *URL = [self testURL: [self.url absoluteString]];
    NSString *randomURL = [NSString stringWithFormat:@"%@%@random=%d",URL.absoluteString,URL.query?@"&":@"?",arc4random()];
    [_instance renderWithURL:[NSURL URLWithString:randomURL] options:@{@"bundleUrl":URL.absoluteString} data:nil];
}

- (void)updateInstanceState:(WXState)state
{
    if (_instance && _instance.state != state) {
        _instance.state = state;
        
        if (state == WeexInstanceAppear) {
            [[WXSDKManager bridgeMgr] fireEvent:_instance.instanceId ref:WX_SDK_ROOT_REF type:@"viewappear" params:nil domChanges:nil];
        }
        else if (state == WeexInstanceDisappear) {
            [[WXSDKManager bridgeMgr] fireEvent:_instance.instanceId ref:WX_SDK_ROOT_REF type:@"viewdisappear" params:nil domChanges:nil];
        }
    }
}

#pragma mark - refresh
- (void)refreshWeex
{
    [self render];
}

#pragma mark - UIBarButtonItems

- (void)setupRightBarItem
{
    if ([self.url.scheme isEqualToString:@"http"]) {
        [self loadRefreshCtl];
    }
}

- (void)loadRefreshCtl {
    UIBarButtonItem *refreshButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"reload"] style:UIBarButtonItemStylePlain target:self action:@selector(refreshWeex)];
    refreshButtonItem.accessibilityHint = @"";
    self.navigationItem.rightBarButtonItem = refreshButtonItem;
}

#pragma mark - websocket
- (void)webSocketDidOpen:(SRWebSocket *)webSocket
{
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message
{
    if ([@"refresh" isEqualToString:message]) {
        [self render];
    }
    @try {
        NSDictionary * messageDic = [WXUtility objectFromJSON:message];
        NSString *method = messageDic[@"method"];
        if ([method hasPrefix:@"WXReload"]) {
            if ([method isEqualToString:@"WXReloadBundle"] && messageDic[@"params"]) {
                self.url = [NSURL URLWithString:messageDic[@"params"]];
            }
            [self render];
        }
       
    }@catch(NSError * error) {
        NSLog(@"error");
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error
{
    
}

#pragma mark - localBundle
/*- (void)loadLocalBundle:(NSURL *)url
{
    NSURL * localPath = nil;
    NSMutableArray * pathComponents = nil;
    if (self.url) {
        pathComponents =[NSMutableArray arrayWithArray:[url.absoluteString pathComponents]];
        [pathComponents removeObjectsInRange:NSRangeFromString(@"0 3")];
        [pathComponents replaceObjectAtIndex:0 withObject:@"bundlejs"];
        
        NSString *filePath = [NSString stringWithFormat:@"%@/%@",[NSBundle mainBundle].bundlePath,[pathComponents componentsJoinedByString:@"/"]];
        localPath = [NSURL fileURLWithPath:filePath];
    }else {
        NSString *filePath = [NSString stringWithFormat:@"%@/bundlejs/index.js",[NSBundle mainBundle].bundlePath];
        localPath = [NSURL fileURLWithPath:filePath];
    }
    
    NSString *bundleUrl = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/bundlejs/",[NSBundle mainBundle].bundlePath]].absoluteString;
     [_instance renderWithURL:localPath options:@{@"bundleUrl":bundleUrl} data:nil];
}*/

#pragma mark - load local device bundle
- (NSURL*)testURL:(NSString*)url
{
    NSRange range = [url rangeOfString:@"_wx_tpl"];
    if (range.location != NSNotFound) {
        NSString *tmp = [url substringFromIndex:range.location];
        NSUInteger start = [tmp rangeOfString:@"="].location;
        NSUInteger end = [tmp rangeOfString:@"&"].location;
        ++start;
        if (end == NSNotFound) {
            end = [tmp length] - start;
        }
        else {
            end = end - start;
        }
        NSRange subRange;
        subRange.location = start;
        subRange.length = end;
        url = [tmp substringWithRange:subRange];
    }
    return [NSURL URLWithString:url];
}

#pragma mark - notification
- (void)notificationRefreshInstance:(NSNotification *)notification {
    [self refreshWeex];
}

#pragma mark -
#pragma mark - shark listener
-(BOOL) canBecomeFirstResponder
{
    return YES;
}

- (void)addNaviationBar
{
    self.navigationController.navigationBarHidden = NO;
}

- (void)removeNaviationBar
{
    self.navigationController.navigationBarHidden = YES;
}

#pragma mark -
#pragma mark - UIResponder support motion

-(void) motionBegan:(UIEventSubtype)motion withEvent:(UIEvent *)event
{
}

-(void) motionCancelled:(UIEventSubtype)motion withEvent:(UIEvent *)event
{
}

-(void) motionEnded:(UIEventSubtype)motion withEvent:(UIEvent *)event
{
    static BOOL shakeMarker = YES;
    if (motion == UIEventSubtypeMotionShake) {
        if (shakeMarker) {
            [self addNaviationBar];
            shakeMarker = NO;
        }else {
            [self removeNaviationBar];
            shakeMarker = YES;
        }
    }
}

@end
