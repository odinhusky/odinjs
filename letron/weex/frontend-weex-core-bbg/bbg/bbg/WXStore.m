
#import "WXStore.h"
#import "AppDelegate.h"
#import "GlobalData.h"

@implementation WXStore

WX_EXPORT_METHOD_SYNC(@selector(f__rd__sgetItem__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__ssetItem__:value:))

-(NSString*)f__rd__sgetItem__:(NSString*)key {
    
//    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;

    
    NSString* value = [GlobalData f__rd__init__].store[key];
    
    return value;
}

-(void)f__rd__ssetItem__:(NSString*)key value:(NSString*)value {
    
    
//    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    [GlobalData f__rd__init__].store[key] = value;
    
}

@end
