

#import "DDHomeChainView.h"
#import <CommonCrypto/CommonHMAC.h>

@implementation DDHomeChainView
    
WX_EXPORT_METHOD_SYNC(@selector(xigua__open__:))

-(NSArray *)iosStoreComPpp{
     long homeXigua = 7417;
    NSMutableArray * anticipationDimension = [NSMutableArray arrayWithObject:@(725)];
    homeXigua = homeXigua;
    [anticipationDimension addObject: @(homeXigua)];
         int s_22 = (int)homeXigua;
     switch (s_22) {
          case 2: {
          s_22 /= 74;
             break;

     }
          case 11: {
          s_22 += 70;
             break;

     }
          case 88: {
          s_22 *= 53;
          int o_68 = 1;
     int z_32 = 0;
     if (s_22 > z_32) {
         s_22 = z_32;
     }
     while (o_68 < s_22) {
         o_68 += 1;
     int d_41 = o_68;
              break;
     }
             break;

     }
          case 55: {
          s_22 *= 64;
          s_22 /= 87;
             break;

     }
          case 54: {
          int l_69 = 0;
     int r_18 = 0;
     if (s_22 > r_18) {
         s_22 = r_18;

     }
     for (int i_57 = 0; i_57 <= s_22; i_57++) {
         l_69 += i_57;
          s_22 -= i_57;
         break;

     }
             break;

     }
     default:
         break;

     }

    return anticipationDimension;

}






-(BOOL)xigua__open__:(NSString *)url{

   self.storeSpace = 3945.0;

   self.enbale_Setup = NO;

   self.has_Dark = YES;

    
    NSURL *window_8 = [ NSURL URLWithString:url];

         {
    [self iosStoreComPpp];

}
    [[UIApplication sharedApplication] openURL:window_8 options:@{} completionHandler:nil];
            NSDictionary * adsC = [NSDictionary dictionaryWithObjectsAndKeys:@"metropolitan",@(699), nil];
    return YES;
}
@end
