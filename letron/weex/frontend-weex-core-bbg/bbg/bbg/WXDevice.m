

#import "WXDevice.h"
#import "GlobalData.h"


@implementation WXDevice
WX_EXPORT_METHOD_SYNC(@selector(f__rd__setLandscape__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__getLandscape__))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__setBadge__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__setStatusBarStyle__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__vibrate__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__getDeviceName__))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__setVolume__:))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__getVolume__))
WX_EXPORT_METHOD_SYNC(@selector(f__rd__setAudioCategory__:))

-(void)f__rd__setLandscape__:(BOOL)orientation {

//    NSLog(@"orientation = %ld", [UIDevice currentDevice].orientation);
    [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
//        AppDelegate * appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        [GlobalData f__rd__init__].allowRotation = orientation;
        if(orientation){
            //但是注意这个方法必须在general里面设置支持锁旋转的方向，否则就是强行旋转，会导致程序崩溃，而且不会有崩溃日志，很难发现崩溃在哪里，所以使用这个方法的时候一定要注意设置支持的方向。
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:UIDeviceOrientationLandscapeLeft] forKey:@"orientation"];
        }else{
            
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:UIDeviceOrientationPortrait] forKey:@"orientation"];
            
        }
    }];
    
    
}

-(NSInteger)f__rd__getLandscape__ {
    
    return [[UIDevice currentDevice] orientation];
    
}


-(void)f__rd__setBadge__:(int)number {
    
    [UIApplication sharedApplication].applicationIconBadgeNumber = number;
    
}

-(void)f__rd__setStatusBarStyle__:(BOOL)style {
    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
//        AppDelegate * appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        [GlobalData f__rd__init__].wx.statusBarDarkStyle = style;
        [[GlobalData f__rd__init__].wx setNeedsStatusBarAppearanceUpdate];
    }];
    
}
-(void)f__rd__vibrate__:(int)type {
    
    if(type == 0){
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    }else{
        AudioServicesPlaySystemSound(type);
    }
    
}

-(NSString*)f__rd__getDeviceName__ {
    return [[UIDevice currentDevice]name];
}

-(void)f__rd__setVolume__:(float)volume {
    
    UISlider *volumeViewSlider = [WXDevice f__rd__getSystemVolumSlider__];
    if(volumeViewSlider){
        volumeViewSlider.value = volume;
    }else{
        NSLog(@"volumeViewSlider NOT found");
    }
    
}

/*
 *获取系统音量滑块
 */
+(UISlider*)f__rd__getSystemVolumSlider__ {
    static UISlider *volumeViewSlider = nil;
    if (volumeViewSlider == nil) {
        MPVolumeView *volumeView = [[MPVolumeView alloc] initWithFrame:CGRectMake(100, 100, 10, 10)];
        volumeView.backgroundColor = [UIColor clearColor];
        volumeView.hidden = NO;
        volumeView.alpha = 0.01;
        
        for (UIView* newView in volumeView.subviews) {
            if ([newView.class.description isEqualToString:@"MPVolumeSlider"]){
                volumeViewSlider = (UISlider*)newView;
                break;
            }
        }
    }
    
    return volumeViewSlider;
}

-(void)f__rd__setAudioCategory__:(int)category{
    
    AVAudioSession* session = [AVAudioSession sharedInstance];
    if(category==1){
        [session setCategory:AVAudioSessionCategoryPlayback error:nil];
    }else{
        [session setCategory:AVAudioSessionCategoryAmbient error:nil];
    }
    [session setActive:YES error:nil];
    
    
}

-(float)f__rd__getVolume__ {
    
    AVAudioSession* session = [AVAudioSession sharedInstance];
    [session setActive:YES error:nil];
    return [session outputVolume];
    
}
@end
