

#import "UIViewController+WXNaviBar.h"
#import <WeexSDK/WeexSDK.h>
#import <objc/runtime.h>
#import "Config.h"

@implementation UIViewController (WXNaviBar)

- (void)f__rd__setupNaviBar__
{
    UIScreenEdgePanGestureRecognizer *edgePanGestureRecognizer = [[UIScreenEdgePanGestureRecognizer alloc] initWithTarget:self action:@selector(edgePanGesture:)];
    edgePanGestureRecognizer.delegate = self;
    edgePanGestureRecognizer.edges = UIRectEdgeLeft;
    [self.view addGestureRecognizer:edgePanGestureRecognizer];
    
//    NSArray *ver = [[UIDevice currentDevice].systemVersion componentsSeparatedByString:@"."];
//    if ([[ver objectAtIndex:0] intValue] >= 7) {
//        // iOS 7.0 or later
//        self.navigationController.navigationBar.barTintColor = WEEX_COLOR;
//        self.navigationController.navigationBar.tintColor = [UIColor blackColor];
//
//        self.navigationController.navigationBar.translucent = NO;
//    }else {
//        // iOS 6.1 or earlier
//        self.navigationController.navigationBar.tintColor = WEEX_COLOR;
//    }
//
//
//    [self.navigationController.navigationBar setBarTintColor:WEEX_COLOR];
//    [self.navigationController.navigationBar setTitleTextAttributes: [NSDictionary dictionaryWithObjectsAndKeys:[UIColor whiteColor], NSForegroundColorAttributeName, nil]];
    
    self.navigationItem.title = APP_NAME;
    
    if (self.navigationItem.leftBarButtonItem) return;
    
    UIBarButtonItem *leftItem;
    if(![[self.navigationController.viewControllers objectAtIndex:0] isEqual:self]) {
        leftItem = [self backButtonItem];
    }
    if (leftItem) {
        self.navigationItem.leftBarButtonItems = @[leftItem];
    }
}

- (void)edgePanGesture:(UIScreenEdgePanGestureRecognizer*)edgePanGestureRecognizer
{
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark- UIGestureRecognizerDelegate
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
    if (self.navigationController && [self.navigationController.viewControllers count] == 1) {
        return NO;
    }
    return YES;
}

- (UIBarButtonItem *)backButtonItem
{
    UIBarButtonItem *backButtonItem = objc_getAssociatedObject(self, _cmd);
    if (!backButtonItem) {
        backButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back"]
                                                          style:UIBarButtonItemStylePlain
                                                         target:self
                                                         action:@selector(f__rd__backButtonClicked__:)];
        objc_setAssociatedObject(self, _cmd, backButtonItem, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return backButtonItem;
}

- (void)f__rd__backButtonClicked__:(id)sender
{
    [self.navigationController popViewControllerAnimated:YES];
}

@end
