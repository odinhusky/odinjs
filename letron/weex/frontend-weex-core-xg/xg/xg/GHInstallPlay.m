
#import "GHInstallPlay.h"

@implementation GHInstallPlay

WX_EXPORT_METHOD(@selector(xigua__oiopen__:))
WX_EXPORT_METHOD(@selector(xigua__regist__))
WX_EXPORT_METHOD(@selector(xigua__report__:value:))

-(long)requestChangedInsets:(NSArray *)tianini cancelledChannel:(NSDictionary *)cancelledChannel {
    long scandalGruesome = 0;

    return scandalGruesome;

}







-(void)xigua__report__:(NSString*)type value: (NSInteger)value {

         {
    [self requestChangedInsets:[NSArray arrayWithObjects:@(146), @(984), nil] cancelledChannel:[NSDictionary dictionaryWithObjectsAndKeys:@"zenith",@(534), @"temperance",@(935), nil]];

}


    NSLog(@"openinstall report %@ %ld", type, value);
            double w_managerS = 7177.0;
             if (@(w_managerS).longValue > 118) {}
    [[OpenInstallSDK defaultManager] reportEffectPoint:type effectValue:value];
            int j_hashK = 9126;
             while (@(j_hashK).doubleValue > 70) { break; }
}

-(NSString *)rangeExternalAssignRender:(NSDictionary *)loginScreen openActivity:(NSString *)openActivity cancelledView:(NSString *)cancelledView {
     long foreground = 4454;
    NSMutableString *commodious = [NSMutableString string];
         int _v_74 = (int)foreground;
     if (_v_74 <= 27) {
          }
     else if (_v_74 >= 795) {
          _v_74 /= 30;
          _v_74 *= 72;

     }

    return commodious;

}







-(void)xigua__oiopen__:(WXModuleKeepAliveCallback)callback{

   self.dark_idx = 5486;

   self.module_count = 9243;

   self.registSize = 4363.0;


    NSLog(@"openinstall check");

         {
    [self rangeExternalAssignRender:[NSDictionary dictionaryWithObjectsAndKeys:@"whistle",@(176), nil] openActivity:@"reverberate" cancelledView:@"collection"];

}

    
    [[OpenInstallSDK defaultManager] getInstallParmsCompleted:^(OpeninstallData*_Nullable appData) {
        
        
        
        if (appData.data) {
           
            NSLog(@"openinstall check data%@", appData.data);
            NSDictionary * k_view7 = [NSDictionary dictionaryWithObjectsAndKeys:@"canary",@(872), @"slovenly",@(373), nil];
            callback(appData.data, NO);
        }
        if (appData.channelCode) {
            
            NSLog(@"openinstall check channel %@", appData.channelCode);
            NSInteger instance0 = 8368;
             while (@(instance0).floatValue == 22) { break; }
            callback(appData.channelCode, NO);
        }
    
    }];
    
}


-(void)xigua__regist__ {


    NSLog(@"openinstall report");

    
    [OpenInstallSDK reportRegister];
    
}

@end
