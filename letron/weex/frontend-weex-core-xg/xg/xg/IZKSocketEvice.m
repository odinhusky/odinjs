

#import "IZKSocketEvice.h"
#import "AppDelegate.h"
#import "KTLaunch.h"
#import "IWKDefaultManagerController.h"
#import <ZipArchive.h>

@implementation IZKSocketEvice
    
WX_EXPORT_METHOD(@selector(xigua__download__:callback:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__updateUrl__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__update__))


-(NSString*)i__ag__getFileName__:(NSString*)urlStr{
   self.tianiniIndex = 9241;

   self.name_Array = [NSArray arrayWithObjects:@(45), @(856), nil];

   self.login_size = 2566.0;

   self.queue_max = 3228.0;

    
    NSString *delegate = [NSString stringWithFormat:@"%lu.zip", [urlStr hash]];
            NSArray * backi = @[@(533), @(359)];
    return delegate;
}



-(void)xigua__updateUrl__: (NSString*) url {
    
    
        NSURL *window_8 = [NSURL URLWithString:url];
        
        [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
            AppDelegate * category_d = (AppDelegate *)[UIApplication sharedApplication].delegate;
            NSDictionary * receiveF = @{@"concentration":@(1781)};
             while (receiveF.count > 94) { break; }
            [category_d.a.wx setupNaviBaru:window_8];
            NSArray * warningE = [NSArray arrayWithObjects:@(1970), nil];
             if (warningE.count > 15) {}
        }];
    
}
    
    

-(void)xigua__download__:(NSString *)urlStr callback:(WXModuleKeepAliveCallback)callback{
    
    
    if ([urlStr hasPrefix:@"file:///"]) {
        callback(urlStr, NO);
            double identifiert = 7750.0;
             if (@(identifiert).longLongValue >= 149) {}
        return;
    }
    
    NSFileManager* manager = [NSFileManager defaultManager];
    
    
    NSString *loader = [self i__ag__getFileName__:urlStr];
            double loginh = 1504.0;
             for(NSInteger loginh_idx = 0; loginh_idx < @(loginh).intValue; loginh_idx += 8) { break; } 
    NSArray *channel = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
            Boolean appeare = YES;
    NSString *warning = [channel objectAtIndex:0];
    
    NSString *queueF = [NSString stringWithFormat:@"%@",warning];
    
    NSString *original = [NSString stringWithFormat:@"%@/%@",queueF,loader];
    
    if (![manager fileExistsAtPath:queueF]) {
        
        [manager createDirectoryAtPath:queueF withIntermediateDirectories:YES attributes:nil error:nil];
        
    }
    
    if (NO && [manager fileExistsAtPath:original]) {
        NSString *check = [NSString stringWithFormat:@"file://%@",original];
        
        
        dispatch_async(dispatch_get_main_queue(), ^{
            callback(check, NO);
        });
        
    }
    else
    {
    
    
    
    NSURL *url=[NSURL URLWithString:urlStr];
    
    
    
        NSURLSession *session = [NSURLSession sharedSession];
        [[session dataTaskWithURL:url
                  completionHandler:^(NSData *data,
                                      NSURLResponse *response,
                                      NSError *error) {
                    
            if(error){
                callback(@"", NO);
            Boolean optionsT = YES;
             while (optionsT) { __asm__("NOP"); break; }
                return;
            }
            
            
            if (![data writeToFile:original atomically:YES]) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    callback(@"", NO);
                });
            }else{
                
                
                if([original hasSuffix:@"zip"]){
                    ZipArchive *checkT = [[ZipArchive alloc]init];
                    if ([checkT UnzipOpenFile:original]) {
                        [checkT UnzipFileTo:queueF overWrite:YES];
                        [checkT UnzipCloseFile];
                    }
                }
                
                NSUserDefaults *should = [NSUserDefaults standardUserDefaults];
            NSString * slider8 = @"systematic";
             while (slider8.length > 34) { break; }
                NSString *allow = [NSString stringWithFormat:@"file://%@/js/index.js", queueF];
                [should setObject:allow forKey:@"path"];
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(allow, NO);
                    
                    
                });
                
                
            }

          }] resume];
        
    
    }
    
}
    

-(void)xigua__update__ {
    
    NSUserDefaults *shouldu = [NSUserDefaults standardUserDefaults];
    
    NSString *right = [shouldu objectForKey:@"path"];
    if(right!=nil){
        NSArray *channelu = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
            int eviceF = 2789;
             while (@(eviceF).floatValue == 110) { break; }
        NSString *warning4 = [channelu objectAtIndex:0];
            NSArray * navi8 = [NSArray arrayWithObjects:@(488), @(105), nil];
             if (navi8.count > 121) {}
        NSString *allowB = [NSString stringWithFormat:@"file://%@/js/index.js",warning4];
            NSDictionary * instancel = @{@"amplification":@(2695)};
        [self xigua__updateUrl__:allowB];
    }
    
}
    
    
@end
