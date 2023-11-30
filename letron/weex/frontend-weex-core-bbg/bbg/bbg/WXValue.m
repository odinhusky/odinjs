

#import "WXValue.h"

@implementation WXValue

WX_EXPORT_METHOD_SYNC(@selector(f__rd__vgetItem__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__vsetItem__:value:))

-(NSString*)f__rd__vgetItem__:(NSString *)key {

    NSString *result = [[NSUserDefaults standardUserDefaults] objectForKey:key];

    return result;

}

    
-(void)f__rd__vsetItem__:(NSString *)key value:(NSString*)value {

    [[NSUserDefaults standardUserDefaults] setValue:value forKey:key];

}
@end
