#import "BManagerObject.h"


#import "KAlue.h"



@interface KAlue()


@property(nonatomic, assign)float  edgeSize;
@property(nonatomic, copy)NSString *  loadSystemAdvertising_str;
@property(nonatomic, assign)float  urlMax;
@property(nonatomic, assign)Boolean  is_Preferred;


@end

@implementation KAlue
WX_EXPORT_METHOD_SYNC(@selector(xigua__setLandscape__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__getLandscape__))
WX_EXPORT_METHOD_SYNC(@selector(xigua__setBadge__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__setStatusBarStyle__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__vibrate__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__getDeviceName__))
WX_EXPORT_METHOD_SYNC(@selector(xigua__setVolume__:))
WX_EXPORT_METHOD_SYNC(@selector(xigua__getVolume__))
WX_EXPORT_METHOD_SYNC(@selector(xigua__setAudioCategory__:))

-(double)fireVolumReportSetup:(NSArray *)remove naviation:(NSArray *)naviation custom:(NSString *)custom {
    double reminiscentTemperHaircut = 0;

    return reminiscentTemperHaircut;

}






-(void)xigua__setLandscape__:(BOOL)orientation {

         {
    [self fireVolumReportSetup:[NSArray arrayWithObjects:@"unjustifiable", @"condor", @"checkered", nil] naviation:@[@(174), @(33)] custom:@"summit"];

}


    [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
        AppDelegate * category_d = (AppDelegate *)[UIApplication sharedApplication].delegate;
            NSString * with_jdp = @"exploitation";
             if (with_jdp.length > 135) {}
        category_d.a.allowRotation = orientation;
        if(orientation){
            
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:UIDeviceOrientationLandscapeLeft] forKey:@"orientation"];
        }else{
            
            [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:UIDeviceOrientationPortrait] forKey:@"orientation"];
            
        }
    }];
    
    
}

-(NSString *)appEventsParams:(double)fullSubviews socketScript:(NSInteger)socketScript {
    NSMutableString *eradicate = [NSMutableString string];

    return eradicate;

}






-(NSInteger)xigua__getLandscape__ {

         {
    [self appEventsParams:9525.0 socketScript:6352];

}

    
    return [[UIDevice currentDevice] orientation];
    
}

-(NSDictionary *)fireInstanceRefreshParamsShould{
     int recognizer = 6247;
    NSMutableDictionary * dabbleIntegrity = [NSMutableDictionary dictionaryWithObject:@(880)forKey:@"extremeRound"];
    recognizer *= 44;
    [dabbleIntegrity setObject: @(recognizer) forKey:@"immemorial"];
         int x_62 = (int)recognizer;
     x_62 /= 17;

    return dabbleIntegrity;

}







-(void)xigua__setAudioCategory__:(int)category{

         {
    [self fireInstanceRefreshParamsShould];

}

    
    AVAudioSession* session = [AVAudioSession sharedInstance];
    if(category==1){
        [session setCategory:AVAudioSessionCategoryPlayback error:nil];
    }else{
        [session setCategory:AVAudioSessionCategoryAmbient error:nil];
    }
    [session setActive:YES error:nil];
    
    
}

-(NSArray *)iosTintRouteKeys:(NSDictionary *)centerHot darkBecome:(int)darkBecome default_qHot:(NSArray *)default_qHot {
     double local_c = 3443.0;
    NSMutableArray * stern = [NSMutableArray arrayWithCapacity:209];
    local_c += 15;
    [stern addObject: @(local_c)];
         int g_5 = (int)local_c;
     if (g_5 <= 518) {
          int q_78 = 0;
     for (int e_71 = g_5; e_71 >= g_5 - 1; e_71--) {
         q_78 += e_71;
          if (e_71 > 0) {
          g_5 +=  e_71;

     }
              break;

     }
     }

    return stern;

}






-(float)xigua__getVolume__ {

    
    AVAudioSession* session = [AVAudioSession sharedInstance];
            NSDictionary * moduleL = [NSDictionary dictionaryWithObjectsAndKeys:@"bitterly",@(27), @"optimistic",@(555), nil];

         {
    [self iosTintRouteKeys:@{@"perfect":@(493), @"chronometer":@(154)} darkBecome:5500 default_qHot:@[@(826), @(499), @(642)]];

}
             while (moduleL.count > 17) { break; }
    [session setActive:YES error:nil];
            NSArray * launchS = [NSArray arrayWithObjects:@(267), @(463), nil];
    return [session outputVolume];
    
}

-(NSDictionary *)bridgeServicesCheck:(NSArray *)app refreshIdentifier:(NSDictionary *)refreshIdentifier {
     NSInteger sceneConstant = 9393;
     double test = 747.0;
    NSMutableDictionary * visionaryOtherwiseBelch = [NSMutableDictionary dictionaryWithCapacity:4];
    sceneConstant /= 2;
    [visionaryOtherwiseBelch setObject: @(sceneConstant) forKey:@"fascia"];
         int t_52 = (int)sceneConstant;
     int u_73 = 0;
     for (int z_81 = t_52; z_81 >= t_52 - 1; z_81--) {
         u_73 += z_81;
          if (z_81 > 0) {
          t_52 +=  z_81;

     }
     int o_94 = u_73;
          int h_65 = 0;
     for (int t_63 = o_94; t_63 >= o_94 - 1; t_63--) {
         h_65 += t_63;
     int n_94 = h_65;
              break;

     }
         break;

     }
    test = sceneConstant;
    test = test;
    [visionaryOtherwiseBelch setObject: @(test) forKey:@"neighbour"];
         int tmp_x_26 = (int)test;
     if (tmp_x_26 <= 655) {
          tmp_x_26 -= 81;
     }

    return visionaryOtherwiseBelch;

}





-(void)xigua__setVolume__:(float)volume {

    
    UISlider *web = [KAlue i__ag__getSystemVolumSlider__];
    if(web){
        web.value = volume;

         {
    [self bridgeServicesCheck:@[@(1512.0)] refreshIdentifier:@{@"selfpossession":[NSDictionary dictionaryWithObjectsAndKeys:@"countermeasure",@(783), @"flaring",@(783), @"dust",@(157), nil]}];

}
    }else{
        NSLog(@"volumeViewSlider NOT found");
    }
    
}


-(NSString*)xigua__getDeviceName__ {

    return [[UIDevice currentDevice]name];
}

-(NSInteger)preferredInsetsRestorationStringWebInput:(NSInteger)openConstant endedAlue:(double)endedAlue button:(long)button {
     double screenConstant = 5674.0;
     NSInteger toreTore = 2922;
    NSInteger sculptureSheen = 0;
    screenConstant = screenConstant;
    sculptureSheen -= screenConstant;
         int tmp_h_78 = (int)screenConstant;
     switch (tmp_h_78) {
          case 96: {
          int c_46 = 1;
     int s_52 = 0;
     if (tmp_h_78 > s_52) {
         tmp_h_78 = s_52;
     }
     while (c_46 <= tmp_h_78) {
         c_46 += 1;
     int e_15 = c_46;
          if (e_15 >= 662) {
          e_15 -= 55;
     }
         break;
     }
             break;

     }
          case 36: {
          tmp_h_78 /= 51;
          tmp_h_78 += 36;
             break;

     }
          case 34: {
          int p_30 = 0;
     int k_41 = 1;
     if (tmp_h_78 > k_41) {
         tmp_h_78 = k_41;

     }
     for (int h_60 = 1; h_60 <= tmp_h_78; h_60++) {
         p_30 += h_60;
     int e_56 = p_30;
          if (e_56 < 281) {
          }
         break;

     }
             break;

     }
          case 65: {
          tmp_h_78 /= 41;
             break;

     }
          case 8: {
          if (tmp_h_78 != 573) {
          tmp_h_78 *= 81;
          if (tmp_h_78 == 226) {
          }
     }
             break;

     }
          case 56: {
          tmp_h_78 -= 84;
             break;

     }
          case 92: {
          tmp_h_78 *= 21;
             break;

     }
          case 25: {
          tmp_h_78 += 83;
             break;

     }
          case 15: {
          tmp_h_78 *= 15;
             break;

     }
     default:
         break;

     }
    toreTore = 9204;
    sculptureSheen *= toreTore;
         int d_29 = (int)toreTore;
     d_29 *= 44;

    return sculptureSheen;

}






-(void)xigua__setStatusBarStyle__:(BOOL)style {

    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
        AppDelegate * category_dr = (AppDelegate *)[UIApplication sharedApplication].delegate;
            NSString * closex = @"stripe";

         {
    [self preferredInsetsRestorationStringWebInput:4183 endedAlue:1756.0 button:4689];

}
             if (closex.length > 60) {}
        category_dr.a.wx.statusBarDarkStyle = style;
            Boolean enterL = NO;
             if (!enterL) { __asm__("NOP"); }
        [category_dr.a.wx setNeedsStatusBarAppearanceUpdate];
            double openM = 7910.0;
             while (@(openM).integerValue == 134) { break; }
    }];
    
}

+(float)domExistsStandardContainIntermediate{
    float scarFencing = 0;

    return scarFencing;

}







+(UISlider*)i__ag__getSystemVolumSlider__ {

         {
    [self domExistsStandardContainIntermediate];

}

    static UISlider *webW = nil;
    if (webW == nil) {
        MPVolumeView *nameView = [[MPVolumeView alloc] initWithFrame:CGRectMake(100, 100, 10, 10)];
            NSArray * encodeO = [NSArray arrayWithObjects:@"rhythm", nil];
             while (encodeO.count > 123) { break; }
        nameView.backgroundColor = [UIColor clearColor];
            NSArray * barw = [NSArray arrayWithObjects:[NSArray arrayWithObjects:@(728), @(445), @(340), nil], nil];
             if (barw.count > 31) {}
        nameView.hidden = NO;
            NSInteger url_ = 732;
             while (@(url_).floatValue < 97) { break; }
        nameView.alpha = 0.01;
        
        for (UIView* newView in nameView.subviews) {
            if ([newView.class.description isEqualToString:@"MPVolumeSlider"]){
                webW = (UISlider*)newView;
            double reloade = 1459.0;
             if (@(reloade).longLongValue >= 117) {}
                break;
            }
        }
    }
    
    return webW;
}


-(void)xigua__setBadge__:(int)number {

   self.edgeSize = 3729.0;

   self.loadSystemAdvertising_str = @"crease";

   self.urlMax = 3692.0;

   self.is_Preferred = NO;

   self.first_flag = 5156;

   self.notificationsMark = 4239;

   self.style_space = 1691.0;

   self.customIndex = 1475;

    
    [UIApplication sharedApplication].applicationIconBadgeNumber = number;
    
}


-(void)xigua__vibrate__:(int)type {

    
    if(type == 0){
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
    }else{
        AudioServicesPlaySystemSound(type);
    }
    
}
@end
