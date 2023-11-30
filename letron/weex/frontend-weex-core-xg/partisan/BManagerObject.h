
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "QFPlayObject.h"
#import "UREviceObject.h"
#import "QVImplScreenObject.h"


NS_ASSUME_NONNULL_BEGIN

@interface BManagerObject : NSObject
@property (nonatomic, strong) QFPlayObject *  socketModel;
@property (nonatomic, strong) QVImplScreenObject *  cancelledOpenModel;
@property (nonatomic, strong) UREviceObject *  originalRefreshAudioModel;
@property (nonatomic, assign) float  screen;
@property (nonatomic, assign) NSInteger  queueEdit;

@end

NS_ASSUME_NONNULL_END
