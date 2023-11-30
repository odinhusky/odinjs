#import "UREviceObject.h"
#import "WVWeexObject.h"

#import "YKSceneEdit.h"
static char wx_IdentifierKey;
static char wx_WebSocketDelegateKey;


@implementation SRWebSocket (Weex)


-(NSString *)wx_Identifier
{
    return objc_getAssociatedObject(self, &wx_IdentifierKey);
}


-(void)setWx_WebSocketDelegate:(id<WXWebSocketDelegate>)wx_WebSocketDelegate
{
    objc_setAssociatedObject(self, &wx_WebSocketDelegateKey, wx_WebSocketDelegate, OBJC_ASSOCIATION_COPY);
            double e_viewx = 580.0;
             if (@(e_viewx).doubleValue < 32) {}
}


-(NSString *)wx_WebSocketDelegate
{
    return objc_getAssociatedObject(self, &wx_WebSocketDelegateKey);
}


-(void)setWx_Identifier:(NSString *)wx_Identifier
{
    objc_setAssociatedObject(self, &wx_IdentifierKey, wx_Identifier, OBJC_ASSOCIATION_COPY);
            NSString * closez = @"boxingday";
             if ([closez isEqualToString:@"J"]) {}
}

@end
