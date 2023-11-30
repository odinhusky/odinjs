

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <WeexSDK/WeexSDK.h>
#import "WXComponent.h"
#import <WebKit/WebKit.h>
#import <AVKit/AVKit.h>


NS_ASSUME_NONNULL_BEGIN

@interface WXAirPlay : WXComponent<AVRoutePickerViewDelegate>

@property (nonatomic) BOOL play;

@end

NS_ASSUME_NONNULL_END

