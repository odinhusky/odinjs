

#import "WXAirPlay.h"
#import <AVKit/AVKit.h>


@implementation WXAirPlay

- (UIView *)loadView
{
    if (@available(iOS 11.0, *)) {
//            AVRoutePickerView *routerPickerView = [[AVRoutePickerView alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
            AVRoutePickerView *routerPickerView = [[AVRoutePickerView alloc] initWithFrame:CGRectZero];
            routerPickerView.activeTintColor = [UIColor clearColor];
            routerPickerView.backgroundColor = [UIColor clearColor];
            routerPickerView.tintColor = [UIColor clearColor];
        
//            routerPickerView.delegate = self;
//            [self.view addSubview:routerPickerView];
            
//            UIImageView *imageView = [[UIImageView alloc] initWithFrame:routerPickerView.bounds];
//            imageView.image = [UIImage imageNamed:@"logopng"];
//            [routerPickerView addSubview:imageView];
            return routerPickerView;
        } else {
            return nil;
        }
    
}

- (void)viewDidLoad
{
    if(self.view){
        ((AVRoutePickerView*)self.view).delegate = self;
    }
    
}

- (instancetype)initWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events weexInstance:(WXSDKInstance *)weexInstance {
    if(self = [super initWithRef:ref type:type styles:styles attributes:attributes events:events weexInstance:weexInstance]) {
//        if (attributes[@"icon"]) {
//            _icon = [WXConvert NSString: attributes[@"icon"]];
//        }
    }
    return self;
}

//AirPlay界面弹出时回调
- (void)routePickerViewWillBeginPresentingRoutes:(AVRoutePickerView *)routePickerView API_AVAILABLE(ios(11.0)){

    
    if(_play){
        [self fireEvent:@"play" params:@{@"show":@"1"} domChanges:nil];
    }
}
//AirPlay界面结束时回调
- (void)routePickerViewDidEndPresentingRoutes:(AVRoutePickerView *)routePickerView API_AVAILABLE(ios(11.0)){

    
    if(_play){
        [self fireEvent:@"play" params:@{@"show":@"0"} domChanges:nil];
    }
}


- (void)addEvent:(NSString *)eventName {
    if ([eventName isEqualToString:@"play"]) {
        _play = YES;
    }
}

- (void)removeEvent:(NSString *)eventName {
    if ([eventName isEqualToString:@"play"]) {
        _play = NO;
    }
}


@end
