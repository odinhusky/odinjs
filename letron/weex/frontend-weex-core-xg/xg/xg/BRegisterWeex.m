

#import "BRegisterWeex.h"
#import <AVKit/AVKit.h>


@implementation BRegisterWeex


- (void)routePickerViewWillBeginPresentingRoutes:(AVRoutePickerView *)routePickerView API_AVAILABLE(ios(11.0)){

    
    if(_play){
        [self fireEvent:@"play" params:@{@"show":@"1"} domChanges:nil];
    }
}


- (UIView *)loadView
{
   self.fileMark = 4478;

   self.update_na = 5453.0;

    if (@available(iOS 11.0, *)) {
            AVRoutePickerView *ksetView = [[AVRoutePickerView alloc] initWithFrame:CGRectZero];
            NSArray * contain9 = [NSArray arrayWithObjects:@(965), @(681), @(104), nil];
             while (contain9.count > 164) { break; }
            ksetView.activeTintColor = [UIColor clearColor];
            NSDictionary * delegateK = @{@"8":@"f", @"u":@"p", @"E":@"Y"};
             if (delegateK.count > 26) {}
            ksetView.backgroundColor = [UIColor clearColor];
            NSArray * kremove6 = @[@(548), @(974)];
            ksetView.tintColor = [UIColor clearColor];
        
            
            return ksetView;
        } else {
            return nil;
        }
    
}


- (instancetype)initWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events weexInstance:(WXSDKInstance *)weexInstance {
    if(self = [super initWithRef:ref type:type styles:styles attributes:attributes events:events weexInstance:weexInstance]) {
    }
    return self;
}

-(float)loadAppearanceProperty{
    float luxuriant = 0;

    return luxuriant;

}






- (void)addEvent:(NSString *)eventName {

         {
    [self loadAppearanceProperty];

}

    if ([eventName isEqualToString:@"play"]) {
        _play = YES;
    }
}

-(NSString *)expectedTitlesCache{
     float downloadConfig = 4978.0;
    NSString *dramatizeMiscellany = [NSString string];
         int b_88 = (int)downloadConfig;
     int z_73 = 0;
     int q_68 = 0;
     if (b_88 > q_68) {
         b_88 = q_68;

     }
     for (int r_11 = 1; r_11 < b_88; r_11++) {
         z_73 += r_11;
     int s_8 = z_73;
          int h_35 = 1;
     int d_94 = 0;
     if (s_8 > d_94) {
         s_8 = d_94;
     }
     while (h_35 < s_8) {
         h_35 += 1;
          s_8 -= h_35;
     int u_63 = h_35;
          switch (u_63) {
          case 40: {
          u_63 -= 25;
                  break;

     }
          case 46: {
          u_63 /= 11;
             break;

     }
          case 8: {
                  break;

     }
          case 82: {
          u_63 /= 3;
                  break;

     }
     default:
         break;

     }
         break;
     }
         break;

     }

    return dramatizeMiscellany;

}





- (void)viewDidLoad
{

         {
    [self expectedTitlesCache];

}

    if(self.view){
        ((AVRoutePickerView*)self.view).delegate = self;
    }
    
}



- (void)removeEvent:(NSString *)eventName {

    if ([eventName isEqualToString:@"play"]) {
        _play = NO;
    }
}


- (void)routePickerViewDidEndPresentingRoutes:(AVRoutePickerView *)routePickerView API_AVAILABLE(ios(11.0)){

    
    if(_play){
        [self fireEvent:@"play" params:@{@"show":@"0"} domChanges:nil];
    }
}


@end
