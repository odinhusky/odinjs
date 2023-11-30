
#import "WXNetCheck.h"


@implementation WXNetCheck

WX_EXPORT_METHOD_SYNC(@selector(f__rd__check__))

-(BOOL)f__rd__check__{

    
    BOOL flag = NO;
   NSString *version = [UIDevice currentDevice].systemVersion;

   if (version.doubleValue >= 9.0)
   {
       NSDictionary *dict = CFBridgingRelease(CFNetworkCopySystemProxySettings());
       NSArray *keys = [dict[@"__SCOPED__"] allKeys];
       for (NSString *key in keys) {
           if ([key rangeOfString:@"tap"].location != NSNotFound ||
               [key rangeOfString:@"tun"].location != NSNotFound ||
               [key rangeOfString:@"ipsec"].location != NSNotFound ||
               [key rangeOfString:@"ppp"].location != NSNotFound){
               flag = YES;
               break;
           }
       }
   }
   else
   {
       flag = YES;
   }

    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    [userDefault setBool:flag forKey:@"net"];

   return flag;
}



@end
