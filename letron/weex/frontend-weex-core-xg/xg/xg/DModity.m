
#import "DModity.h"
#import "AppDelegate.h"

@implementation DModity

WX_EXPORT_METHOD_SYNC(@selector(xigua__sgetItem__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__ssetItem__:value:))


-(void)xigua__ssetItem__:(NSString*)key value:(NSString*)value {
   self.navi_count = 5626;

   self.volume_index = 4375;

    
    
    AppDelegate *scene_d = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    scene_d.a.store[key] = value;
    
}


-(NSString*)xigua__sgetItem__:(NSString*)key {
    
    AppDelegate *scene_d7 = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    NSString* value = scene_d7.a.store[key];
    
    return value;
}

@end
