

#import "WXNav.h"
#import <CommonCrypto/CommonHMAC.h>

@implementation WXNav
    
WX_EXPORT_METHOD_SYNC(@selector(f__rd__open__:))

-(BOOL)f__rd__open__:(NSString *)url{
    
    NSURL *u = [ NSURL URLWithString:url];
    [[UIApplication sharedApplication] openURL:u options:@{} completionHandler:nil];
    return YES;
}
@end
