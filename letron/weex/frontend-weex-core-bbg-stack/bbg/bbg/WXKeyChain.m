

#import "WXKeyChain.h"
#import <Foundation/Foundation.h>
#import <Security/Security.h>
#import <SAMKeychain/SAMKeychain.h>

@implementation WXKeyChain

WX_EXPORT_METHOD_SYNC(@selector(f__rd__kgetItem__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__ksetItem__:value:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__kremoveItem__:))


-(NSString*)f__rd__kgetItem__:(NSString *)key {
    
    return [SAMKeychain passwordForService:@"com.kc" account:key];
    
}
-(BOOL)f__rd__ksetItem__:(NSString *)key value:(NSString*)value {
    return [SAMKeychain setPassword:value forService:@"com.kc" account:key];
}

-(BOOL)f__rd__kremoveItem__:(NSString *)key {
    return [SAMKeychain deletePasswordForService:@"com.kc" account:key];
}




@end
