
#import "KTLaunch.h"
#import <CommonCrypto/CommonDigest.h>

@implementation KTLaunch


- (NSString * _Nullable)lloadCustomContain:(NSString *)fullPath {
    NSFileManager *b_manager = [NSFileManager defaultManager];
    
    if( [b_manager fileExistsAtPath:fullPath isDirectory:nil]) {
        NSData *data = [NSData dataWithContentsOfFile:fullPath];
            NSArray * endedn = [NSArray arrayWithObjects:@(419), @(418), nil];
        unsigned char digest[CC_MD5_DIGEST_LENGTH];
            Boolean hmacs = NO;
        CC_MD5(data.bytes, (CC_LONG)data.length, digest);
 
        NSMutableString *l_center = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
            int landscapef = 1391;
             while (@(landscapef).longValue >= 64) { break; }
        for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
            [l_center appendFormat:@"%02x", digest[i]];
        }
        return l_center;
    }
    return nil;
}


- (NSString * _Nullable)kdidFinishLaunchingWithOptions:(NSString *)fullPath {
   self.fullOffset = 1983.0;

   self.category_0p = NO;

   self.script_offset = 3727.0;

   self.enbaleWarning = YES;

    NSFileManager *b_managerq = [NSFileManager defaultManager];
    
    if( [b_managerq fileExistsAtPath:fullPath isDirectory:nil] ) {
        NSData *data = [NSData dataWithContentsOfFile:fullPath];
            double vibrateV = 6446.0;
             for(int vibrateV_idx = 0; vibrateV_idx < @(vibrateV).intValue; vibrateV_idx++) { break; } 
        unsigned char digest[CC_SHA256_DIGEST_LENGTH];
            NSInteger systemi = 6095;
             while (@(systemi).longValue > 36) { break; }
        CC_SHA256(data.bytes, (CC_LONG)data.length, digest);
 
        NSMutableString *l_centerP = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
 
        for (int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++) {
            [l_centerP appendFormat:@"%02x", digest[i]];
        }
        return l_centerP;
    }
    return nil;
}

@end
