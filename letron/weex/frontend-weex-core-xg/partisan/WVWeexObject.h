
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "BManagerObject.h"
#import "UREviceObject.h"
#import "USPlayObject.h"


NS_ASSUME_NONNULL_BEGIN

@interface WVWeexObject : NSObject
@property (nonatomic, strong) UREviceObject *  dataModel;
@property (nonatomic, strong) USPlayObject *  sgetEditModel;
@property (nonatomic, strong) BManagerObject *  disappearModel;
@property (nonatomic, assign) double  buttonManager;
@property (nonatomic, assign) long  refreshData;
@property (nonatomic, assign) double  remove;
@property (nonatomic, assign) long  contain;

@end

NS_ASSUME_NONNULL_END
