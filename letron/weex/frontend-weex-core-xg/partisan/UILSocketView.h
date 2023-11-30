
#import <UIKit/UIKit.h>

#import "BRHMainWeexView.h"
#import "DSHLoaderToreView.h"
#import "WVWeexObject.h"
#import "PONewsView.h"
#import "USPlayObject.h"


NS_ASSUME_NONNULL_BEGIN

@interface UILSocketView : UIView
@property (nonatomic, strong) UILabel *  volumeUrlLabel;
@property (nonatomic, strong) UIImageView *  loadImageView;
@property (nonatomic, assign) Boolean  recognizerPlay;
@property (nonatomic, assign) float  app;



-(UIImageView *)backgroundSetup:(NSArray *)ended baseforView:(long)baseforView ksetLayout:(float)ksetLayout;

-(NSInteger)endedUpdate_mcConfiguration:(Boolean)edit appManager:(NSString *)appManager;

-(NSString *)itemWeex:(NSString *)kremove status:(NSArray *)status;

@end

NS_ASSUME_NONNULL_END
