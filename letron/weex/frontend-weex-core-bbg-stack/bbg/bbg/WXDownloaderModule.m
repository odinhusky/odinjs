

#import "WXDownloaderModule.h"
#import "AppDelegate.h"
#import "WXFileCheck.h"
#import "WeexViewController.h"
#import <ZipArchive.h>
#import "GlobalData.h"

@implementation WXDownloaderModule
    
WX_EXPORT_METHOD(@selector(f__rd__download__:callback:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__updateUrl__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__update__))

-(void)f__rd__update__ {
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    
    NSString *localFile = [userDefault objectForKey:@"path"];
    if(localFile!=nil){
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *docDir = [paths objectAtIndex:0];
        NSString *jspath = [NSString stringWithFormat:@"file://%@/js/index.js",docDir];
        [self f__rd__updateUrl__:jspath];
    }
    
}


-(void)f__rd__updateUrl__: (NSString*) url {
    
    
        NSURL *u = [NSURL URLWithString:url];
        
        [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
//            AppDelegate * appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
            [[GlobalData f__rd__init__].wx f__rd__changeUrl__:u];
        }];
    
}
    
    
-(void)f__rd__download__:(NSString *)urlStr callback:(WXModuleKeepAliveCallback)callback{
    
    
    if ([urlStr hasPrefix:@"file:///"]) {//本地路径直接返回
        callback(urlStr, NO);
        return;
    }
    
    NSFileManager* manager = [NSFileManager defaultManager];
    
    //http类型
    NSString *fileName = [self getFileName:urlStr];//待加密
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *docDir = [paths objectAtIndex:0];
    
    NSString *dirpath = [NSString stringWithFormat:@"%@",docDir];
    
    NSString *filepath = [NSString stringWithFormat:@"%@/%@",dirpath,fileName];
    
    if (![manager fileExistsAtPath:dirpath]) {
        
        [manager createDirectoryAtPath:dirpath withIntermediateDirectories:YES attributes:nil error:nil];
        
    }
    
    if (NO && [manager fileExistsAtPath:filepath]) {
        NSString *pathNew = [NSString stringWithFormat:@"file://%@",filepath];
        
        //不应该是用同一个文件,防止下载失败时覆盖正常文件
        dispatch_async(dispatch_get_main_queue(), ^{
            callback(pathNew, NO);
        });
        
    }
    else
    {
    
    
    //1.网址
    NSURL *url=[NSURL URLWithString:urlStr];
    //2.请求
//    NSURLRequest *request=[NSURLRequest requestWithURL:url];
    //3.队列
//    NSOperationQueue *queue=[[NSOperationQueue alloc]init];
    //4.发送异步请求
        NSURLSession *session = [NSURLSession sharedSession];
        [[session dataTaskWithURL:url
                  completionHandler:^(NSData *data,
                                      NSURLResponse *response,
                                      NSError *error) {
                    // handle response
            if(error){
                callback(@"", NO);
                return;
            }
            
            
            if (![data writeToFile:filepath atomically:YES]) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    //触发error
                    callback(@"", NO);
                });
            }else{
                
//                NSString *pathNew = [NSString stringWithFormat:@"file://%@",filepath];
                
                if([filepath hasSuffix:@"zip"]){
                    ZipArchive *zipArchive = [[ZipArchive alloc]init];
                    if ([zipArchive UnzipOpenFile:filepath]) {
//                        NSString *jspath = [NSString stringWithFormat:@"%@/js/",dirpath];
//                        [manager removeItemAtPath:jspath error:nil];
                        [zipArchive UnzipFileTo:dirpath overWrite:YES];
                        [zipArchive UnzipCloseFile];
                    }
                }
                
                NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
                NSString *jspath = [NSString stringWithFormat:@"file://%@/js/index.js", dirpath];
                [userDefault setObject:jspath forKey:@"path"];
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(jspath, NO);
                    
//                    UIViewController *demo = [[WXDemoViewController alloc] init];
//                    ((WXDemoViewController *)demo).url = [NSURL URLWithString:pathNew];
//                    [[UIApplication sharedApplication] delegate].window.rootViewController = [[WXRootViewController alloc] initWithRootViewController:demo];
                    
                });
                
                
            }

          }] resume];
        
//    [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse * response, NSData *  data, NSError *  connectionError) {
//
//
//        if(connectionError){
//            callback(@"");
//            return;
//        }
//
//
//        if (![data writeToFile:filepath atomically:YES]) {
//            NSLog(@"io exception while writing");
//            dispatch_async(dispatch_get_main_queue(), ^{
//                //触发error
//                callback(@"");
//            });
//        }else{
//
//            NSString *pathNew = [NSString stringWithFormat:@"file://%@",filepath];
//
//
//            dispatch_async(dispatch_get_main_queue(), ^{
//                callback(pathNew);
//            });
//
//
//        }
//
//     }];
    
    }
    
}
    //去掉http前缀,获取存储文件的名称
-(NSString*)getFileName:(NSString*)urlStr{
    
    NSString *f = [NSString stringWithFormat:@"%lu.zip", [urlStr hash]];
    return f;
//    NSURL *url = [NSURL URLWithString:urlStr];
//    NSString *path = [url path];
//
//    int length=(int)path.length;
//
//    for (int i=length-1; i>-1; i--) {
//        if ([[path substringWithRange:NSMakeRange(i, 1)] isEqualToString:@"/"]) {
//            NSString *result = [urlStr substringWithRange:NSMakeRange(i+1, length-i-1)];
//            NSLog(@"filename = %@", result);
//            return result;
//        }
//    }
//
//    NSLog(@"filename = %@", path);
//    return path;
}
    
    
@end
