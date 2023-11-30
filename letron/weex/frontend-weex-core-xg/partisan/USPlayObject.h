
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "QFPlayObject.h"
#import "BManagerObject.h"
#import "QVImplScreenObject.h"


NS_ASSUME_NONNULL_BEGIN

@interface USPlayObject : NSObject
@property (nonatomic, strong) QFPlayObject *  activityStatusRegistModel;
@property (nonatomic, strong) BManagerObject *  beganRenderForegroundModel;
@property (nonatomic, strong) QVImplScreenObject *  s_imageModel;
@property (nonatomic, assign) float  loaderScriptWeex;
@property (nonatomic, assign) long  activity;
@property (nonatomic, assign) double  motion;

@end

NS_ASSUME_NONNULL_END
